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
