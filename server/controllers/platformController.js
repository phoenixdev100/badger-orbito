import userModel from '../models/userModel.js';
import { fetchCredlyData } from '../services/credlyService.js';
import { fetchLeetCodeData } from '../services/leetcodeService.js';

// 1️⃣ Link a username to a platform
export const linkPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!['credly', 'leetcode'].includes(platform))
      return res.status(400).json({ success: false, message: 'Platform not supported' });

    user.platforms[platform] = username;
    await user.save();

    res.json({ success: true, message: `${platform} username linked successfully` });
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

    if (user.platforms.credly)
      results.credly = await fetchCredlyData(user.platforms.credly);

    if (user.platforms.leetcode)
      results.leetcode = await fetchLeetCodeData(user.platforms.leetcode);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch platform data' });
  }
};
