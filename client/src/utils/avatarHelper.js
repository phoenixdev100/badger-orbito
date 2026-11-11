import assets from '../assets/assets.js';

export const DEFAULT_MEMOJI_AVATAR = "https://ik.imagekit.io/fpxbgsota/memoji-alex.png?updatedAt=1752933824067";

/**
 * Resolves developer avatar with the exact priority cascade:
 * 1. user.profilePicture (if explicitly set / custom uploaded)
 * 2. Connected platform picture:
 *    - Codolio profile image or aggregated platform titlePhoto/avatar
 *    - Credly photo_url / avatar
 *    - LeetCode userAvatar / avatar
 *    - CodeChef / CodeStudio titlePhoto / avatar
 *    (Uses the first connected platform that has a photo; if first has none, checks second, etc.)
 * 3. Default original profile photo (assets.DeepakImage)
 * 4. Default memoji fallback
 */
export const getDeveloperAvatar = (user = null, platformData = null) => {
  // 1. Explicit user profile picture
  if (user?.profilePicture && typeof user.profilePicture === 'string' && user.profilePicture.trim() !== '') {
    return user.profilePicture;
  }

  // 2. Connected platform avatars cascade
  if (platformData && typeof platformData === 'object') {
    // Check Codolio top-level
    if (platformData.codolio?.profileImage) return platformData.codolio.profileImage;
    if (platformData.codolio?.summary?.profileImage) return platformData.codolio.summary.profileImage;

    // Check Codolio aggregated platform profiles (LeetCode, CodeStudio, CodeChef, etc.)
    const platforms = platformData.codolio?.platforms || [];
    for (const p of platforms) {
      if (p.userStats?.titlePhoto) return p.userStats.titlePhoto;
      if (p.avatar) return p.avatar;
      if (p.profileImage) return p.profileImage;
    }

    // Check Credly direct
    if (platformData.credly?.photo_url || platformData.credly?.avatar) {
      return platformData.credly.photo_url || platformData.credly.avatar;
    }

    // Check LeetCode direct
    if (platformData.leetcode?.userAvatar || platformData.leetcode?.avatar) {
      return platformData.leetcode.userAvatar || platformData.leetcode.avatar;
    }

    // Check CodeChef direct
    if (platformData.codechef?.avatar || platformData.codechef?.profileImage) {
      return platformData.codechef.avatar || platformData.codechef.profileImage;
    }

    // Check CodeStudio direct
    if (platformData.codestudio?.userStats?.titlePhoto || platformData.codestudio?.avatar) {
      return platformData.codestudio.userStats?.titlePhoto || platformData.codestudio.avatar;
    }
  }

  // 3. User photo from assets (the user's DeepakImage photo from the original card)
  if (assets && assets.DeepakImage) {
    return assets.DeepakImage;
  }

  // 4. Default memoji avatar fallback
  return DEFAULT_MEMOJI_AVATAR;
};

export default getDeveloperAvatar;
