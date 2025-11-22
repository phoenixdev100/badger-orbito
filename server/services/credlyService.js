import axios from 'axios';

export const fetchCredlyData = async (username) => {
  try {
    const url = `https://www.credly.com/users/${username}/badges.json`;
    const { data } = await axios.get(url);

    const badgesArray = Array.isArray(data?.data) ? data.data : [];

    const badges = badgesArray.map((b) => ({
      id: b.id,
      name: b.badge_template?.name,
      image: b.badge_template?.image_url || b.image_url,
      issued_on: b.issued_at_date || b.issued_at,
      description: b.badge_template?.description,
      issuer: b.issuer?.entities?.[0]?.entity?.name,
      level: b.badge_template?.level,
      type_category: b.badge_template?.type_category,
      skills: Array.isArray(b.badge_template?.skills)
        ? b.badge_template.skills.map((s) => s.name)
        : [],
    }));

    return {
      badges,
      badgeCount: badges.length,
      metadata: data?.metadata || null,
    };
  } catch (err) {
    console.error('Credly fetch error:', err.message);
    return {
      badges: [],
      badgeCount: 0,
      metadata: null,
    };
  }
};

export const verifyCredlyOwnership = async (username, verificationCode) => {
  try {
    const url = `https://www.credly.com/users/${username}/badges#credly`;
    const { data } = await axios.get(url);
    
    // Check if verification code exists in the profile HTML
    // This could be in bio, name, or other profile fields
    const htmlContent = data.toLowerCase();
    const codeToFind = verificationCode.toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('Credly verification error:', err.message);
    return false;
  }
};
