import axios from 'axios';

export const verifyCodeStudioOwnership = async (username, verificationCode) => {
  try {
    const url = `https://www.codingninjas.com/studio/profile/${username}`;
    const { data } = await axios.get(url);
    
    // Check if verification code exists in the profile HTML
    // This could be in bio, name, or other profile fields
    const htmlContent = data.toLowerCase();
    const codeToFind = verificationCode.toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('CodeStudio verification error:', err.message);
    return false;
  }
};
