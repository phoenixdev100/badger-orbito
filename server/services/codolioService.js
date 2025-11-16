import axios from 'axios';

export const verifyCodolioOwnership = async (userKey, verificationCode) => {
  try {
    const url = `https://api.codolio.com/profile?userKey=${userKey}`;
    console.log('Fetching Codolio profile:', url);
    
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Codolio profile data received');
    
    // Check if the verification code exists in the profile data
    // This will depend on the actual API response structure
    // For now, we'll check if the code exists in the stringified response
    const profileData = JSON.stringify(data).toLowerCase();
    return profileData.includes(verificationCode.toLowerCase());
    
  } catch (err) {
    console.error('Codolio verification error:', err.message);
    return false;
  }
};
