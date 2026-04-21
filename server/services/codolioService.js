import axios from 'axios';

// ─── Icon mappings for platforms whose API returns null icons ────────────────

// HackerRank skill badge name → devicon / CDN URL
const HACKERRANK_SKILL_ICONS = {
  'java':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'python':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'react':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'c':               'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
  'c++':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'sql':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-plain.svg',
  '10 days of javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'javascript':      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'linux shell':     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg',
  'problem solving': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'go':              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
  'ruby':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
};

// CodeStudio topic badge displayName → devicon / icon URL
const CODESTUDIO_TOPIC_ICONS = {
  'arrays':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'strings':         'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'math':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg',
  'number theory':   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg',
  'greedy':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'bit manipulation':'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
  'dynamic programming': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'graphs':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg',
  'trees':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'linked lists':    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'backtracking':    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'sorting':         'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'binary search':   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
};

// Resolve icon URL for a no-icon badge (HackerRank or CodeStudio)
const resolveIconForBadge = (platform, badgeName, displayName) => {
  const key = ((displayName || badgeName) || '').toLowerCase().trim();
  if (platform === 'hackerrank') {
    return HACKERRANK_SKILL_ICONS[key] || HACKERRANK_SKILL_ICONS[badgeName?.toLowerCase()] || null;
  }
  if (platform === 'codestudio') {
    return CODESTUDIO_TOPIC_ICONS[key] || null;
  }
  return null;
};

// Fix relative icon URLs (e.g. LeetCode DCC badge paths)
const normalizeBadgeIcon = (icon, platform) => {
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  if (platform === 'leetcode') return `https://leetcode.com${icon}`;
  return icon;
};

const PLATFORM_COLORS = {
  leetcode:      '#FFA116',
  codechef:      '#6B3FA0',
  codestudio:    '#DD4015',
  hackerrank:    '#2EC866',
  geeksforgeeks: '#2F8D46',
  codeforces:    '#1F8ACB',
  atcoder:       '#7B7B7B',
};

// Count unique active days from the submissionCalendar object
const countActiveDaysFromCalendar = (calendar) => {
  if (!calendar || typeof calendar !== 'object') return 0;
  return Object.values(calendar).filter((v) => (v || 0) > 0).length;
};

export const verifyCodolioOwnership = async (userKey, verificationCode) => {
  try {
    const url = `https://api.codolio.com/profile?userKey=${userKey}`;
    console.log('Fetching Codolio profile:', url);
    const { data } = await axios.get(url, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
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
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });

    const platformProfiles = data?.data?.platformProfiles?.platformProfiles || [];

    let totalBadges       = 0;
    let totalCertificates = 0;
    let totalQuestionsSolved = 0;
    let totalActiveDays   = 0;
    let totalContests     = 0;
    let topSkill          = null;
    let topSkillStars     = 0;
    const contestBreakdown = [];

    const processedPlatforms = platformProfiles.map((profile) => {
      const platform = profile.platform;
      const color    = PLATFORM_COLORS[platform] || '#888888';

      // ── Badges ───────────────────────────────────────────────────────────
      const badgeList = profile.badgeStats?.badgeList || [];
      const badges = badgeList.map((b, idx) => {
        // First try the raw API icon (normalised for relative URLs)
        let resolvedIcon = normalizeBadgeIcon(b.icon, platform);
        // If still null, look up our mapping table
        if (!resolvedIcon) {
          resolvedIcon = resolveIconForBadge(platform, b.name, b.displayName);
        }

        return {
          id:           `${platform}-badge-${b.name}-${idx}`,
          title:        b.displayName || b.shortName || b.name,
          level:        b.name,          // e.g. "achiever", "specialist"
          category:     b.category,
          icon:         resolvedIcon,    // may still be null if truly unknown
          stars:        b.stars ?? null,
          creationDate: b.creationDate,
          platform,
          platformColor: color,
        };
      });

      // ── Certificates ─────────────────────────────────────────────────────
      const certList = profile.certificateStats?.certificates || [];
      const certificates = certList.map((c) => ({
        id:       `${platform}-cert-${c.name}`,
        name:     c.name || 'Certificate',
        type:     c.type,
        imageUrl: c.imageUrl || null,
        platform,
        platformColor: color,
      }));

      // ── User stats ────────────────────────────────────────────────────────
      const us = profile.userStats;
      const userStats = us
        ? {
            handle:        us.handle,
            currentRating: us.currentRating,
            maxRating:     us.maxRating,
            stars:         us.stars,
            rank:          us.rank || us.maxRank,
            titlePhoto:    us.titlePhoto,
            level:         us.level,
            userLevelName: us.userLevelName,
          }
        : null;

      // ── Question stats ────────────────────────────────────────────────────
      const questionsSolved = profile.totalQuestionStats?.totalQuestionCounts || 0;
      const easyCount       = profile.totalQuestionStats?.easyQuestionCounts  || 0;
      const mediumCount     = profile.totalQuestionStats?.mediumQuestionCounts || 0;
      const hardCount       = profile.totalQuestionStats?.hardQuestionCounts  || 0;

      // ── Active days ───────────────────────────────────────────────────────
      const calendar        = profile.dailyActivityStatsResponse?.submissionCalendar;
      const activeDaysApi   = profile.dailyActivityStatsResponse?.totalActiveDays;
      const activeDays      = activeDaysApi != null ? activeDaysApi : countActiveDaysFromCalendar(calendar);

      // ── Contest stats ─────────────────────────────────────────────────────
      const rawContestList  = profile.contestActivityStats?.contestActivityList || [];
      // Normalise and sort by date ascending for the graph
      const contestList = rawContestList
        .map((c) => ({
          contestName: c.contestName,
          rating:      c.rating,
          rank:        c.rank,
          contestDate: c.contestDate,   // Unix timestamp (seconds)
        }))
        .sort((a, b) => a.contestDate - b.contestDate);

      const contestCount = contestList.length;
      if (contestCount > 0) {
        contestBreakdown.push({ platform, count: contestCount, color });
        totalContests += contestCount;
      }

      // ── Top skill (HackerRank star badges) ───────────────────────────────
      if (platform === 'hackerrank') {
        badgeList.forEach((b) => {
          if ((b.stars || 0) > topSkillStars) {
            topSkillStars = b.stars;
            topSkill      = b.name;
          }
        });
      }

      // ── Accumulate totals ─────────────────────────────────────────────────
      totalBadges          += badges.length;
      totalCertificates    += certificates.length;
      totalQuestionsSolved += questionsSolved;
      totalActiveDays      += activeDays;

      return {
        platform,
        platformColor: color,
        badges,
        certificates,
        userStats,
        questionsSolved,
        easyCount,
        mediumCount,
        hardCount,
        activeDays,
        contestCount,
        contestList,            // sorted contest history for rating graph
        contestRating: userStats?.currentRating || null,
        maxRating:     userStats?.maxRating     || null,
      };
    });

    // Fallback top skill: platform with most questions if HackerRank not connected
    if (!topSkill && processedPlatforms.length > 0) {
      const best = processedPlatforms.reduce((a, b) =>
        (a.questionsSolved || 0) > (b.questionsSolved || 0) ? a : b
      );
      if (best.questionsSolved > 0) {
        topSkill = best.platform.charAt(0).toUpperCase() + best.platform.slice(1);
        topSkillStars = null;
      }
    }

    return {
      platforms: processedPlatforms,
      summary: {
        totalBadges,
        totalCertificates,
        totalQuestionsSolved,
        totalActiveDays,
        totalContests,
        contestBreakdown,
        topSkill,
        topSkillStars,
      },
    };
  } catch (err) {
    console.error('Codolio fetch error:', err.message);
    return {
      platforms: [],
      summary: {
        totalBadges: 0,
        totalCertificates: 0,
        totalQuestionsSolved: 0,
        totalActiveDays: 0,
        totalContests: 0,
        contestBreakdown: [],
        topSkill: null,
        topSkillStars: null,
      },
    };
  }
};
