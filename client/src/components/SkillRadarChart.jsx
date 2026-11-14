import React, { useMemo } from 'react';

const SKILL_CATEGORIES = [
  { id: 'dsa', label: 'DSA', color: '#FFA116' },
  { id: 'frontend', label: 'Frontend', color: '#06b6d4' },
  { id: 'backend', label: 'Backend', color: '#22C55E' },
  { id: 'devops', label: 'DevOps', color: '#A855F7' },
  { id: 'system', label: 'System Design', color: '#EF4444' },
];

const DSA_PLATFORMS = ['leetcode', 'codeforces', 'codechef', 'atcoder', 'geeksforgeeks'];
const GENERAL_PLATFORMS = ['codestudio', 'hackerrank'];

const KEYWORD_MAP = {
  frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'frontend', 'front-end', 'ui', 'ux', 'web', 'tailwind', 'nextjs', 'next.js'],
  backend: ['node', 'nodejs', 'python', 'java', 'spring', 'django', 'flask', 'express', 'api', 'backend', 'back-end', 'server', 'database', 'sql', 'mongodb', 'postgres', 'mysql', 'graphql', 'rest'],
  devops: ['docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'google cloud', 'ci/cd', 'devops', 'linux', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions', 'cloud'],
  system: ['system design', 'architecture', 'scalability', 'distributed', 'microservices', 'load balancing', 'caching', 'cache', 'database design', 'high availability', 'sharding', 'cap theorem'],
};

const addScore = (scores, key, value) => {
  scores[key] = Math.min(100, scores[key] + value);
};

const scoreFromKeywords = (scores, text) => {
  if (!text) return;
  const t = String(text).toLowerCase();
  Object.entries(KEYWORD_MAP).forEach(([skill, keywords]) => {
    if (keywords.some((k) => t.includes(k))) {
      addScore(scores, skill, 6);
    }
  });
};

const calculateSkillScores = (platforms = [], credlyBadges = []) => {
  const scores = {
    dsa: 0,
    frontend: 0,
    backend: 0,
    devops: 0,
    system: 0,
  };

  platforms.forEach((p) => {
    const solved = p.questionsSolved || 0;
    const rating = p.contestRating || p.maxRating || 0;
    const maxRating = p.maxRating || rating;
    const activeDays = p.activeDays || 0;
    const contests = p.contestCount || 0;
    const easyCount = p.easyCount || 0;
    const mediumCount = p.mediumCount || 0;
    const hardCount = p.hardCount || 0;
    const stars = p.userStats?.stars || 0;
    const level = p.userStats?.level || p.userStats?.userLevelName || 0;

    if (DSA_PLATFORMS.includes(p.platform)) {
      addScore(scores, 'dsa', Math.min(50, solved * 0.05 + easyCount * 0.03 + mediumCount * 0.08 + hardCount * 0.15 + rating * 0.015 + maxRating * 0.01 + activeDays * 0.1 + contests * 0.8));
      addScore(scores, 'system', Math.min(25, rating * 0.02 + maxRating * 0.015 + contests * 1.2));
    }

    if (GENERAL_PLATFORMS.includes(p.platform)) {
      const base = solved * 0.05 + activeDays * 0.1 + stars * 2 + (typeof level === 'number' ? level : 0);
      addScore(scores, 'frontend', Math.min(40, base));
      addScore(scores, 'backend', Math.min(40, base));
      addScore(scores, 'devops', Math.min(15, solved * 0.02 + stars));
    }

    (p.badges || []).forEach((b) => {
      scoreFromKeywords(scores, b.title || b.name);
      if ((b.stars || 0) >= 3) addScore(scores, 'system', 3);
      if ((b.stars || 0) >= 4) {
        addScore(scores, 'frontend', 2);
        addScore(scores, 'backend', 2);
      }
    });

    (p.certificates || []).forEach((c) => {
      scoreFromKeywords(scores, c.name || c.title);
      addScore(scores, 'system', 2);
    });
  });

  // Credly badges & skills are strong real-world skill signals
  credlyBadges.forEach((b) => {
    const text = [b.name, b.issuer, ...(b.skills || [])].filter(Boolean).join(' ');
    scoreFromKeywords(scores, text);
    addScore(scores, 'system', 1.5);
    if ((b.skills || []).length > 0) addScore(scores, 'backend', 1);
  });

  Object.keys(scores).forEach((key) => {
    scores[key] = Math.min(100, Math.round(scores[key]));
  });

  return scores;
};

const SkillRadarChart = ({ platforms = [], credlyBadges = [], loading = false }) => {
  const skillScores = useMemo(() => calculateSkillScores(platforms, credlyBadges), [platforms, credlyBadges]);
  const hasData = Object.values(skillScores).some((score) => score > 0);

  if (loading) {
    return (
      <div className="w-full h-[260px] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
        <span className="text-slate-500 text-sm">Loading skill analysis...</span>
      </div>
    );
  }

  const centerX = 180;
  const centerY = 118;
  const radius = 68;
  const levels = 5;
  const angleStep = (Math.PI * 2) / SKILL_CATEGORIES.length;

  const getPoints = (value = 100) => {
    return SKILL_CATEGORIES.map((cat, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (radius * value) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return { x, y };
    });
  };

  const dataPoints = getPoints();
  const skillPoints = SKILL_CATEGORIES.map((cat, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (radius * skillScores[cat.id]) / 100;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  });

  const polygonPath = skillPoints.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `L ${p.x} ${p.y}`;
  }).join(' ') + ' Z';

  const gridLevels = Array.from({ length: levels }, (_, i) => i + 1).map((level) => {
    const levelPoints = getPoints((level / levels) * 100);
    const path = levelPoints.map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      return `L ${p.x} ${p.y}`;
    }).join(' ') + ' Z';
    return { level, path };
  });

  const axisLines = dataPoints.map((p) => `M ${centerX} ${centerY} L ${p.x} ${p.y}`);

  if (!hasData) {
    return (
      <div className="w-full h-[260px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <p className="text-slate-400 text-sm">No skill data available for the selected platform.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg viewBox="0 18 360 206" className="w-full h-auto max-w-[380px] mx-auto">
        {gridLevels.map(({ level, path }) => (
          <path key={level} d={path} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
        ))}

        {axisLines.map((line, i) => (
          <path key={i} d={line} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        ))}

        <path
          d={polygonPath}
          fill="rgba(6, 182, 212, 0.18)"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {skillPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06b6d4" />
        ))}

        {SKILL_CATEGORIES.map((cat, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const labelRadius = radius + 17;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);

          return (
            <text
              key={cat.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={cat.color}
              fontSize="10"
              fontWeight="600"
            >
              {cat.label}
            </text>
          );
        })}

        {skillPoints.map((p, i) => {
          const cat = SKILL_CATEGORIES[i];
          const angle = angleStep * i - Math.PI / 2;
          const scoreRadius = Math.max(16, (radius * skillScores[cat.id]) / 100 - 12);
          const x = centerX + scoreRadius * Math.cos(angle);
          const y = centerY + scoreRadius * Math.sin(angle);

          return (
            <text
              key={`score-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="8.5"
              fontWeight="bold"
            >
              {skillScores[cat.id]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default SkillRadarChart;
