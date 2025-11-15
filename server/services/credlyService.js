import axios from 'axios';

export const fetchCredlyData = async (username) => {
  try {
    const url = `https://www.credly.com/users/${username}/badges.json`;
    const { data } = await axios.get(url);
    return data.data.map(b => ({
      name: b.badge_template.name,
      image: b.badge_template.image_url,
      issued_on: b.issued_at,
      description: b.badge_template.description
    }));
  } catch (err) {
    console.error('Credly fetch error:', err.message);
    return [];
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
