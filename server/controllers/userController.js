import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { fetchCredlyData } from '../services/credlyService.js';
import { fetchLeetCodeData } from '../services/leetcodeService.js';
import { fetchCodolioData } from '../services/codolioService.js';

// Helper: Escape special regex characters to prevent ReDoS / NoSQL injection
const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper: Format safe user object for client response
const formatSafeUser = (user) => ({
    name:                  user.name,
    email:                 user.email,
    username:              user.username || user.email?.split('@')[0] || 'developer',
    usernameLastChangedAt: user.usernameLastChangedAt || null,
    passwordChangedAt:     user.passwordChangedAt || null,
    lastLoginAt:           user.lastLoginAt || null,
    loginHistory:          (user.loginHistory || []).slice(0, 10),
    twoFactorEnabled:      !!user.twoFactorEnabled,
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
            return res.status(400).json({ success: false, message: "Missing required details (name, email, password)" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address" });
        }

        if (typeof password !== 'string' || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include a letter and a number" });
        }

        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const username = await generateUniqueUsername(normalizedEmail);

        const userData = {
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            username,
            isProfilePublic: true,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: formatSafeUser(user) });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await userModel.findOne({ email: normalizedEmail }).exec();

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            if (user.twoFactorEnabled && user.twoFactorSecret) {
                const tempToken = jwt.sign(
                    { id: user._id, purpose: '2fa-pending' },
                    process.env.JWT_SECRET,
                    { expiresIn: '5m' }
                );
                return res.json({ success: true, requires2FA: true, tempToken });
            }

            // Lazy initialization of username if missing
            if (!user.username) {
                user.username = await generateUniqueUsername(user.email);
            }
            user.lastLoginAt = new Date();
            const ua = String(req.headers['user-agent'] || '');
            user.loginHistory = [
              { at: user.lastLoginAt, ip: req.ip || '', userAgent: ua.slice(0, 200) },
              ...(user.loginHistory || []),
            ].slice(0, 10);
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ success: true, token, user: formatSafeUser(user) });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
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

        // Fallback: check email prefix safely using escaped regex to prevent ReDoS
        if (!user) {
            user = await userModel.findOne({ email: new RegExp(`^${escapeRegex(clean)}@`, 'i') });
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
        if (typeof newPassword !== 'string' || newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters and include a letter and a number' });
        }
        if (newPassword === currentPassword) {
            return res.status(400).json({ success: false, message: 'New password must be different from the current password' });
        }

        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordChangedAt = new Date();
        await user.save();

        res.json({ success: true, message: 'Password changed successfully. All other sessions have been signed out.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Two-Factor Authentication (TOTP) ────────────────────────────────────────
const setup2FA = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.twoFactorEnabled) {
            return res.status(400).json({ success: false, message: '2FA is already enabled' });
        }

        const secret = speakeasy.generateSecret({
            name: `Orbito (${user.email})`,
            issuer: 'Orbito',
        });

        user.twoFactorSecret = secret.base32;
        await user.save();

        const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
        res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrDataUrl,
            otpauthUrl: secret.otpauth_url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to setup 2FA' });
    }
};

const enable2FA = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await userModel.findById(req.userId);
        if (!user?.twoFactorSecret) {
            return res.status(400).json({ success: false, message: 'Run 2FA setup first' });
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: String(code || '').replace(/\s/g, ''),
            window: 1,
        });

        if (!valid) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        user.twoFactorEnabled = true;
        await user.save();
        res.json({ success: true, message: 'Two-factor authentication enabled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to enable 2FA' });
    }
};

const disable2FA = async (req, res) => {
    try {
        const { password, code } = req.body;
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (!user.twoFactorEnabled) {
            return res.status(400).json({ success: false, message: '2FA is not enabled' });
        }

        const isMatch = await bcrypt.compare(String(password || ''), user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: String(code || '').replace(/\s/g, ''),
            window: 1,
        });
        if (!valid) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        user.twoFactorSecret = null;
        user.twoFactorEnabled = false;
        await user.save();
        res.json({ success: true, message: 'Two-factor authentication disabled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to disable 2FA' });
    }
};

const verify2FALogin = async (req, res) => {
    try {
        const { tempToken, code } = req.body;
        if (!tempToken || !code) {
            return res.status(400).json({ success: false, message: 'Token and code are required' });
        }

        const decoded = jwt.verify(String(tempToken), process.env.JWT_SECRET);
        if (decoded.purpose !== '2fa-pending' || !decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid session' });
        }

        const user = await userModel.findById(decoded.id).exec();
        if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
            return res.status(400).json({ success: false, message: '2FA is not enabled for this account' });
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: String(code).replace(/\s/g, ''),
            window: 1,
        });
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid authentication code' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: formatSafeUser(user) });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Verification failed. Please login again.' });
    }
};

// Sign out all devices: bumps passwordChangedAt so every existing JWT is rejected
const signOutAllDevices = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.passwordChangedAt = new Date();
        await user.save();

        res.json({ success: true, message: 'Signed out from all devices. Please login again.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to sign out devices' });
    }
};

export {
    registerUser,
    loginUser,
    signOutAllDevices,
    updateProfile,
    changePassword,
    updateUsername,
    updateVisibility,
    getPublicProfile,
    setup2FA,
    enable2FA,
    disable2FA,
    verify2FALogin
};
