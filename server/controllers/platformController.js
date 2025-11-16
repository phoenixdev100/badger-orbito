import crypto from 'crypto';
import userModel from '../models/userModel.js';
import { fetchCredlyData, verifyCredlyOwnership } from '../services/credlyService.js';
import { fetchLeetCodeData, verifyLeetCodeOwnership } from '../services/leetcodeService.js';
import { verifyCodeChefOwnership } from '../services/codechefService.js';
import { verifyCodeStudioOwnership } from '../services/codestudioService.js';
import { verifyCodolioOwnership } from '../services/codolioService.js';

// 1️⃣ Link a username to a platform
export const linkPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['credly', 'leetcode', 'codechef', 'codestudio', 'codolio'].includes(platform))
      return res.status(400).json({ success: false, message: 'Invalid platform' });

    // Generate a random string of 6 uppercase letters (A-Z)
    const randomLetters = Array.from({ length: 6 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    const verificationCode = 'ORBITO' + randomLetters;

    user.platforms[platform] = {
      username,
      verified: false,
      verificationCode
    };

    await user.save();

    res.json({
      success: true,
      message: `Verification required for ${platform}`,
      verificationCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// 2️⃣ Fetch all linked platforms' data
export const fetchAllPlatformsData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const results = {};

    if (user.platforms.credly?.username && user.platforms.credly?.verified)
      results.credly = await fetchCredlyData(user.platforms.credly.username);

    if (user.platforms.leetcode?.username && user.platforms.leetcode?.verified)
      results.leetcode = await fetchLeetCodeData(user.platforms.leetcode.username);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch platform data' });
  }
};

// Platform verifiers mapping
const PLATFORM_VERIFIERS = {
  credly: verifyCredlyOwnership,
  leetcode: verifyLeetCodeOwnership,
  codechef: verifyCodeChefOwnership,
  codestudio: verifyCodeStudioOwnership,
  codolio: verifyCodolioOwnership
};

// 3️⃣ Verify platform ownership
export const verifyPlatform = async (req, res) => {
  try {
    const { platform } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user?.platforms[platform]?.username)
      return res.status(400).json({ success: false, message: 'Platform not linked' });

    const username = user.platforms[platform].username;
    const code = user.platforms[platform].verificationCode;

    const verifyFunc = PLATFORM_VERIFIERS[platform];
    if (!verifyFunc) {
      return res.status(400).json({ success: false, message: 'Platform verification not supported' });
    }

    const verified = await verifyFunc(username, code);

    if (verified) {
      user.platforms[platform].verified = true;
      await user.save();
      return res.json({ success: true, message: `${platform} account verified successfully` });
    } else {
      return res.status(400).json({ success: false, message: `Verification failed. Code not found on ${platform} profile.` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
};

// 4️⃣ Get user's platform status
export const getUserPlatforms = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const platforms = {};
    Object.keys(user.platforms).forEach(platform => {
      platforms[platform] = {
        username: user.platforms[platform]?.username || null,
        verified: user.platforms[platform]?.verified || false
      };
    });

    res.json({ success: true, platforms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5️⃣ Delete platform connection
export const deletePlatform = async (req, res) => {
  try {
    const { platform } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['credly', 'leetcode', 'codechef', 'codestudio', 'codolio'].includes(platform))
      return res.status(400).json({ success: false, message: 'Invalid platform' });

    // Reset platform data
    user.platforms[platform] = {
      username: null,
      verified: false,
      verificationCode: null
    };

    await user.save();

    res.json({ success: true, message: `${platform} connection removed successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
