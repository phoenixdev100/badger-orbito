import axios from 'axios';

export const verifyCodeChefOwnership = async (username, verificationCode) => {
  try {
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://www.codechef.com/users/${safeUsername}`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });
    
    const htmlContent = String(data).toLowerCase();
    const codeToFind = String(verificationCode).toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('CodeChef verification error:', err.message);
    return false;
  }
};
