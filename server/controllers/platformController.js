import userModel from '../models/userModel.js';
import { fetchCredlyData, verifyCredlyOwnership } from '../services/credlyService.js';
import { fetchLeetCodeData, verifyLeetCodeOwnership } from '../services/leetcodeService.js';
import { verifyCodeChefOwnership } from '../services/codechefService.js';
import { verifyCodeStudioOwnership } from '../services/codestudioService.js';
import { verifyCodolioOwnership, fetchCodolioData } from '../services/codolioService.js';

// Platforms that Codolio aggregates — mutually exclusive with codolio
const CODOLIO_TRACKED = ['leetcode', 'codechef', 'codestudio'];

// 1️⃣ Link a username to a platform (with mutual-exclusivity check)
export const linkPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['credly', 'leetcode', 'codechef', 'codestudio', 'codolio'].includes(platform))
      return res.status(400).json({ success: false, message: 'Invalid platform' });

    // ── Mutual-exclusivity: Codolio ↔ individual platforms ─────────────────
    if (platform === 'codolio') {
      // Trying to connect Codolio → block if any tracked platform is already verified
      const conflictingPlatform = CODOLIO_TRACKED.find(
        (p) => user.platforms[p]?.verified
      );
      if (conflictingPlatform) {
        return res.status(400).json({
          success: false,
          message: `You have ${conflictingPlatform} individually connected. Please disconnect it first to connect Codolio.`,
          conflict: conflictingPlatform,
        });
      }
    } else if (CODOLIO_TRACKED.includes(platform)) {
      // Trying to connect individual platform → block if Codolio is already verified
      if (user.platforms.codolio?.verified) {
        return res.status(400).json({
          success: false,
          message: `Codolio is connected and already tracks ${platform}. Disconnect Codolio first to connect platforms individually.`,
          conflict: 'codolio',
        });
      }
    }

    // Generate verification code
    const randomLetters = Array.from({ length: 6 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    const verificationCode = 'ORBITO' + randomLetters;

    user.platforms[platform] = {
      username,
      verified: false,
      verificationCode,
      isPublic: user.platforms[platform]?.isPublic ?? true, // preserve existing flag
    };

    await user.save();

    res.json({
      success: true,
      message: `Verification required for ${platform}`,
      verificationCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Fetch all linked platforms' data (only isPublic=true)
export const fetchAllPlatformsData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const results = {};

    if (
      user.platforms.credly?.username &&
      user.platforms.credly?.verified &&
      user.platforms.credly?.isPublic !== false
    ) {
      results.credly = await fetchCredlyData(user.platforms.credly.username);
    }

    if (
      user.platforms.leetcode?.username &&
      user.platforms.leetcode?.verified &&
      user.platforms.leetcode?.isPublic !== false
    ) {
      results.leetcode = await fetchLeetCodeData(user.platforms.leetcode.username);
    }

    if (
      user.platforms.codolio?.username &&
      user.platforms.codolio?.verified &&
      user.platforms.codolio?.isPublic !== false
    ) {
      results.codolio = await fetchCodolioData(user.platforms.codolio.username);
    }

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch platform data' });
  }
};

// Platform verifiers mapping
const PLATFORM_VERIFIERS = {
  credly:     verifyCredlyOwnership,
  leetcode:   verifyLeetCodeOwnership,
  codechef:   verifyCodeChefOwnership,
  codestudio: verifyCodeStudioOwnership,
  codolio:    verifyCodolioOwnership,
};

// 3️⃣ Verify platform ownership
export const verifyPlatform = async (req, res) => {
  try {
    const { platform } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user?.platforms[platform]?.username)
      return res.status(400).json({ success: false, message: 'Platform not linked' });

    const username = user.platforms[platform].username;
    const code     = user.platforms[platform].verificationCode;

    const verifyFunc = PLATFORM_VERIFIERS[platform];
    if (!verifyFunc)
      return res.status(400).json({ success: false, message: 'Platform verification not supported' });

    const verified = await verifyFunc(username, code);

    if (verified) {
      user.platforms[platform].verified = true;
      await user.save();
      return res.json({ success: true, message: `${platform} account verified successfully` });
    } else {
      return res.status(400).json({
        success: false,
        message: `Verification failed. Code not found on ${platform} profile.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
};

// 4️⃣ Get user's platform status (includes isPublic)
export const getUserPlatforms = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const platforms = {};
    Object.keys(user.platforms.toObject()).forEach((platform) => {
      platforms[platform] = {
        username: user.platforms[platform]?.username || null,
        verified: user.platforms[platform]?.verified || false,
        isPublic: user.platforms[platform]?.isPublic ?? true,
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

    user.platforms[platform] = {
      username: null,
      verified: false,
      verificationCode: null,
      isPublic: true,
    };

    await user.save();
    res.json({ success: true, message: `${platform} connection removed successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 6️⃣ Update platform visibility (isPublic toggle)
export const updatePlatformVisibility = async (req, res) => {
  try {
    const { platform, isPublic } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['credly', 'leetcode', 'codechef', 'codestudio', 'codolio'].includes(platform))
      return res.status(400).json({ success: false, message: 'Invalid platform' });
    if (typeof isPublic !== 'boolean')
      return res.status(400).json({ success: false, message: 'isPublic must be a boolean' });

    // Only allow toggling if platform is verified
    if (!user.platforms[platform]?.verified)
      return res.status(400).json({ success: false, message: 'Platform not verified' });

    user.platforms[platform].isPublic = isPublic;
    await user.save();

    res.json({
      success: true,
      message: `${platform} is now ${isPublic ? 'public' : 'private'}`,
      isPublic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
