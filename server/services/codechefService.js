import axios from 'axios';

export const verifyCodeChefOwnership = async (username, verificationCode) => {
  try {
    const url = `https://www.codechef.com/users/${username}`;
    const { data } = await axios.get(url);
    
    // Check if verification code exists in the profile HTML
    // This could be in bio, name, or other profile fields
    const htmlContent = data.toLowerCase();
    const codeToFind = verificationCode.toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('CodeChef verification error:', err.message);
    return false;
  }
};
