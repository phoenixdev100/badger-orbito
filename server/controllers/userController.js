import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fetchCredlyData } from '../services/credlyService.js';
import { fetchLeetCodeData } from '../services/leetcodeService.js';
import { fetchCodolioData } from '../services/codolioService.js';

// Helper: Format safe user object for client response
const formatSafeUser = (user) => ({
    name:                  user.name,
    email:                 user.email,
    username:              user.username || user.email?.split('@')[0] || 'developer',
    usernameLastChangedAt: user.usernameLastChangedAt || null,
    isProfilePublic:       user.isProfilePublic !== false,
    bio:                   user.bio || '',
    profilePicture:        user.profilePicture || '',
    createdAt:             user.createdAt,
    updatedAt:             user.updatedAt,
    platforms: Object.keys(user.platforms || {}).reduce((acc, key) => {
        const p = user.platforms[key] || {};
        acc[key] = {
            verified: !!p.verified,
            username: p.username || null,
            isPublic: p.isPublic !== false,
        };
        return acc;
    }, {}),
});

// Helper: Generate unique clean username from email
const generateUniqueUsername = async (email) => {
    const base = (email.split('@')[0] || 'dev').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    let candidate = base || 'developer';
    const exists = await userModel.findOne({ username: candidate });
    if (!exists) return candidate;

    for (let i = 0; i < 15; i++) {
        const suffix = Math.floor(100 + Math.random() * 900);
        const test = `${candidate}${suffix}`;
        const found = await userModel.findOne({ username: test });
        if (!found) return test;
    }
    return `${candidate}${Date.now().toString().slice(-4)}`;
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const username = await generateUniqueUsername(email);

        const userData = {
            name,
            email,
            password: hashedPassword,
            username,
            isProfilePublic: true,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: formatSafeUser(user) });
    } catch (error) {
        console.error('Registration error:', error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).exec();

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Lazy initialization of username if missing
            if (!user.username) {
                user.username = await generateUniqueUsername(user.email);
                await user.save();
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: formatSafeUser(user) });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (name && name.trim()) user.name = name.trim();
        if (bio !== undefined) user.bio = bio.trim();
        await user.save();

        res.json({ success: true, message: 'Profile updated successfully', user: formatSafeUser(user) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Update Username with 30-Day Cooldown & Uniqueness ───────────────────────
const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }

        const clean = username.trim().toLowerCase();

        // 3-30 chars, alphanumeric + underscores + hyphens
        const regex = /^[a-z0-9_-]{3,30}$/;
        if (!regex.test(clean)) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 3-30 characters long and contain only letters, numbers, underscores, and hyphens'
            });
        }

        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.username === clean) {
            return res.json({ success: true, message: 'Username is already set to this', user: formatSafeUser(user) });
        }

        // 30-day cooldown constraint check
        if (user.usernameLastChangedAt) {
            const msDiff = Date.now() - new Date(user.usernameLastChangedAt).getTime();
            const daysDiff = msDiff / (1000 * 60 * 60 * 24);
            if (daysDiff < 30) {
                const remainingDays = Math.ceil(30 - daysDiff);
                return res.status(400).json({
                    success: false,
                    message: `Username can only be changed once every 30 days. You can change it again in ${remainingDays} day${remainingDays > 1 ? 's' : ''}.`,
                    remainingDays
                });
            }
        }

        // Check if username is already taken by someone else
        const existing = await userModel.findOne({ username: clean, _id: { $ne: user._id } });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `@${clean} is already taken by another developer. Please choose a different username.`
            });
        }

        user.username = clean;
        user.usernameLastChangedAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: `Username successfully changed to @${clean}!`,
            user: formatSafeUser(user)
        });
    } catch (error) {
        console.error('Update username error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Toggle Public / Private Profile Visibility ──────────────────────────────
const updateVisibility = async (req, res) => {
    try {
        const { isProfilePublic } = req.body;
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isProfilePublic = Boolean(isProfilePublic);
        await user.save();

        res.json({
            success: true,
            message: user.isProfilePublic
                ? 'Your profile is now PUBLIC. Anyone with your link can view it.'
                : 'Your profile is now PRIVATE. Public links will show a private profile notice.',
            user: formatSafeUser(user)
        });
    } catch (error) {
        console.error('Update visibility error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Public Profile Endpoint (/u/:username) ──────────────────────────────────
const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) return res.status(400).json({ success: false, message: 'Username parameter required' });

        const clean = username.trim().toLowerCase();
        let user = await userModel.findOne({ username: clean });

        // Fallback: check email prefix
        if (!user) {
            user = await userModel.findOne({ email: new RegExp(`^${clean}@`, 'i') });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Developer profile @${clean} was not found.`
            });
        }

        // If profile is set to private by the developer
        if (user.isProfilePublic === false) {
            return res.json({
                success: true,
                isPrivate: true,
                user: {
                    name: user.name,
                    username: user.username || clean,
                    profilePicture: user.profilePicture || null,
                }
            });
        }

        // Profile is public: fetch verified platforms
        const results = {};
        if (user.platforms?.credly?.username && user.platforms.credly?.verified && user.platforms.credly?.isPublic !== false) {
            results.credly = await fetchCredlyData(user.platforms.credly.username);
        }
        if (user.platforms?.leetcode?.username && user.platforms.leetcode?.verified && user.platforms.leetcode?.isPublic !== false) {
            results.leetcode = await fetchLeetCodeData(user.platforms.leetcode.username);
        }
        if (user.platforms?.codolio?.username && user.platforms.codolio?.verified && user.platforms.codolio?.isPublic !== false) {
            results.codolio = await fetchCodolioData(user.platforms.codolio.username);
        }

        const userPlatforms = {
            credly:     user.platforms?.credly?.username     || null,
            leetcode:   user.platforms?.leetcode?.username   || null,
            codechef:   user.platforms?.codechef?.username   || null,
            codestudio: user.platforms?.codestudio?.username || null,
            codolio:    user.platforms?.codolio?.username    || null,
        };

        res.json({
            success: true,
            isPrivate: false,
            user: {
                name: user.name,
                username: user.username || clean,
                bio: user.bio || '',
                profilePicture: user.profilePicture || null,
                createdAt: user.createdAt,
            },
            data: results,
            userPlatforms,
        });
    } catch (error) {
        console.error('Public profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to load public profile' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    loginUser,
    updateProfile,
    changePassword,
    updateUsername,
    updateVisibility,
    getPublicProfile
};
