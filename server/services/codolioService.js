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
  'arrays':                 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'strings':                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'math':                   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg',
  'number theory':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg',
  'greedy':                 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'bit manipulation':       'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
  'dynamic programming':    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'graph':                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg',
  'graphs':                 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg',
  'trees':                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'tree':                   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'binary trees':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'binary tree':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'binary search trees':    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'binary search tree':     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'tries':                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'trie':                   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'linked lists':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'linked list':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'backtracking':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'sorting':                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'binary search':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'breadth-first search':   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg',
  'depth-first search':     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg',
  'computational geometry': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
  'hash table':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  'heap':                   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg',
  'matrices (2d arrays)':   'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
  'matrices':               'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
  'recursion':              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'sql':                    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'stacks & queues':        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  'two pointers':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
  'ad-hoc':                 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'ad hoc':                 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
};

// Resolve icon URL for a no-icon badge (HackerRank or CodeStudio)
const resolveIconForBadge = (platform, badgeName, displayName) => {
  const key = ((displayName || badgeName) || '').toLowerCase().trim();
  if (platform === 'hackerrank') {
    return HACKERRANK_SKILL_ICONS[key] || HACKERRANK_SKILL_ICONS[badgeName?.toLowerCase()] || null;
  }
  if (platform === 'codestudio') {
    if (CODESTUDIO_TOPIC_ICONS[key]) return CODESTUDIO_TOPIC_ICONS[key];
    const bName = (badgeName || '').toLowerCase().trim();
    if (CODESTUDIO_TOPIC_ICONS[bName]) return CODESTUDIO_TOPIC_ICONS[bName];
    // Partial substring lookup
    for (const [topic, iconUrl] of Object.entries(CODESTUDIO_TOPIC_ICONS)) {
      if (key.includes(topic) || topic.includes(key)) return iconUrl;
    }
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

// Generate direct profile URL for each coding platform based on user handle
const getProfileUrl = (platform, handle) => {
  if (!handle) return null;
  const h = encodeURIComponent(String(handle).trim());
  switch (platform?.toLowerCase()) {
    case 'leetcode':
      return `https://leetcode.com/u/${h}/`;
    case 'codechef':
      return `https://www.codechef.com/users/${h}`;
    case 'codestudio':
      return `https://www.naukri.com/code360/profile/${h}`;
    case 'hackerrank':
      return `https://www.hackerrank.com/profile/${h}`;
    case 'geeksforgeeks':
      return `https://www.geeksforgeeks.org/user/${h}/`;
    case 'codeforces':
      return `https://codeforces.com/profile/${h}`;
    case 'atcoder':
      return `https://atcoder.jp/users/${h}`;
    case 'credly':
      return `https://www.credly.com/users/${h}`;
    default:
      return null;
  }
};

// Known verified tech certificate images & badges from trusted CDN
const KNOWN_CERT_ICONS = {
  'python':          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'java':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'sql':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
  'javascript':      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'problem solving': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'react':           'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'node':            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'css':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  'c#':              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  'c++':             'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'go':              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
  'r':               'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg',
};

const resolveCertificateImage = (certName, rawImage) => {
  if (rawImage && String(rawImage).startsWith('http')) return rawImage;
  const lower = (certName || '').toLowerCase();
  for (const [key, iconUrl] of Object.entries(KNOWN_CERT_ICONS)) {
    if (lower.includes(key)) return iconUrl;
  }
  return null;
};

// Count unique active days from the submissionCalendar object
const countActiveDaysFromCalendar = (calendar) => {
  if (!calendar || typeof calendar !== 'object') return 0;
  return Object.values(calendar).filter((v) => (v || 0) > 0).length;
};

export const verifyCodolioOwnership = async (userKey, verificationCode) => {
  try {
    const safeKey = encodeURIComponent(String(userKey).trim());
    const url = `https://api.codolio.com/profile?userKey=${safeKey}`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Orbito-Portfolio-Engine/1.0' },
    });
    const profileData = JSON.stringify(data).toLowerCase();
    return profileData.includes(String(verificationCode).toLowerCase());
  } catch (err) {
    console.error('Codolio verification error:', err.message);
    return false;
  }
};

export const fetchCodolioData = async (userKey) => {
  try {
    const safeKey = encodeURIComponent(String(userKey).trim());
    const url = `https://api.codolio.com/profile?userKey=${safeKey}`;

    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Orbito-Portfolio-Engine/1.0' },
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
        imageUrl: resolveCertificateImage(c.name, c.imageUrl),
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
      let rawCalendar = profile.dailyActivityStatsResponse?.submissionCalendar;
      let parsedCalendar = null;
      if (typeof rawCalendar === 'string') {
        try {
          parsedCalendar = JSON.parse(rawCalendar);
        } catch (e) {
          parsedCalendar = null;
        }
      } else if (rawCalendar && typeof rawCalendar === 'object') {
        parsedCalendar = rawCalendar;
      }

      const activeDaysApi   = profile.dailyActivityStatsResponse?.totalActiveDays;
      const activeDays      = activeDaysApi != null ? activeDaysApi : countActiveDaysFromCalendar(parsedCalendar);

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

      const handle = us?.handle || profile.platformUserName || profile.username || profile.handle || profile.userName || null;
      const profileUrl = profile.profileUrl || profile.url || getProfileUrl(platform, handle);

      return {
        platform,
        platformColor: color,
        handle,
        profileUrl,
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
        submissionCalendar: parsedCalendar      || null,
      };
    });

    // Merge calendars from all platforms
    const combinedCalendar = {};
    processedPlatforms.forEach((p) => {
      if (p.submissionCalendar && typeof p.submissionCalendar === 'object') {
        Object.entries(p.submissionCalendar).forEach(([ts, count]) => {
          combinedCalendar[ts] = (combinedCalendar[ts] || 0) + (Number(count) || 0);
        });
      }
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
        submissionCalendar: combinedCalendar,
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
