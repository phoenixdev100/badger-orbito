import axios from 'axios';

export const fetchCredlyData = async (username) => {
  try {
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://www.credly.com/users/${safeUsername}/badges.json`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });

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
      username,
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
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://www.credly.com/users/${safeUsername}/badges#credly`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });
    
    const htmlContent = String(data).toLowerCase();
    const codeToFind = String(verificationCode).toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('Credly verification error:', err.message);
    return false;
  }
};
