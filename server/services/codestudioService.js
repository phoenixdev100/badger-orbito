import axios from 'axios';

export const verifyCodeStudioOwnership = async (username, verificationCode) => {
  try {
    const url = `https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${username}&request_differentiator=1763014939880&app_context=publicsection&naukri_request=true`;

    console.log('Fetching CodeStudio profile:', url);
    const { data } = await axios.get(url);
    console.log('CodeStudio profile data received');
    
    // Check if the verification code matches the profile name
    if (data?.data?.profile?.name) {
      const profileName = data.data.profile.name;
      console.log('Profile name:', profileName);
      console.log('Verification code to find:', verificationCode);
      
      return profileName === verificationCode;
    }
  } catch (err) {
    console.error('CodeStudio verification error:', err.message);
    return false;
  }
};
