import axios from 'axios';

export const verifyCodolioOwnership = async (userKey, verificationCode) => {
  try {
    const url = `https://api.codolio.com/profile?userKey=${userKey}`;
    console.log('Fetching Codolio profile:', url);

    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Codolio profile data received');

    const profileData = JSON.stringify(data).toLowerCase();
    return profileData.includes(verificationCode.toLowerCase());
  } catch (err) {
    console.error('Codolio verification error:', err.message);
    return false;
  }
};

export const fetchCodolioData = async (userKey) => {
  try {
    const url = `https://api.codolio.com/profile?userKey=${userKey}`;
    console.log('Fetching Codolio data for user:', url);

    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const platformProfiles =
      data?.data?.platformProfiles?.platformProfiles || [];

    const processedPlatforms = platformProfiles.map((profile) => {
      const platform = profile.platform;

      const badgeStats = profile.badgeStats || null;
      const badgeList = badgeStats?.badgeList || [];

      const certificateStats = profile.certificateStats || null;
      const certificateList = certificateStats?.certificates || [];

      return {
        platform,
        badges: Array.isArray(badgeList) ? badgeList : [],
        certificates: Array.isArray(certificateList) ? certificateList : [],
      };
    });

    return {
      platforms: processedPlatforms,
    };
  } catch (err) {
    console.error('Codolio fetch error:', err.message);
    return {
      platforms: [],
    };
  }
};

export const fetchCodolioPlatformStats = async () => {
  try {
    const url = 'https://api.codolio.com/profile?userKey=phoenixdev100';
    console.log('Fetching Codolio platform stats:', url);

    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const platformProfiles =
      data?.data?.platformProfiles?.platformProfiles || [];

    const platforms = platformProfiles.map((profile) => {
      const platform = profile.platform;

      const badgeStats = profile.badgeStats || null;
      const badgeList = badgeStats?.badgeList || [];
      const badgeCount = Array.isArray(badgeList) ? badgeList.length : 0;

      const certificateStats = profile.certificateStats || null;
      const certificateList = certificateStats?.certificates || [];
      const certificateCount = Array.isArray(certificateList)
        ? certificateList.length
        : 0;

      return {
        platform,
        badgeStats,
        badgeCount,
        certificateStats,
        certificateCount,
      };
    });

    return {
      raw: data,
      platforms,
      totalPlatforms: platforms.length,
      totalBadges: platforms.reduce(
        (sum, p) => sum + (Number.isFinite(p.badgeCount) ? p.badgeCount : 0),
        0,
      ),
      totalCertificates: platforms.reduce(
        (sum, p) =>
          sum + (Number.isFinite(p.certificateCount) ? p.certificateCount : 0),
        0,
      ),
    };
  } catch (err) {
    console.error('Codolio fetch error:', err.message);
    throw err;
  }
};
