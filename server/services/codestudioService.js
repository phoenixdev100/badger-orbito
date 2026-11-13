import axios from 'axios';

export const verifyCodeStudioOwnership = async (username, verificationCode) => {
  try {
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${safeUsername}&request_differentiator=1763014939880&app_context=publicsection&naukri_request=true`;

    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });
    
    // Check if the verification code matches the profile name
    if (data?.data?.profile?.name) {
      const profileName = String(data.data.profile.name).trim();
      const codeToMatch = String(verificationCode).trim();
      return profileName === codeToMatch;
    }
    return false;
  } catch (err) {
    console.error('CodeStudio verification error:', err.message);
    return false;
  }
};
