import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import GradientBlobCard from '../components/gradient-bold-card';
import Sidebar from '../components/Sidebar';
import FeaturedAchievements from '../components/FeaturedAchievements';
import ContestRatingSection from '../components/ContestRatingSection';
import { XCard } from '../components/ui/x-gradient-card';
import { AppContext } from '../context/AppContext';
import { Award } from 'lucide-react';

// ─── Platform display metadata ─────────────────────────────────────────────
const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',      color: '#FFA116' },
  codechef:      { label: 'CodeChef',      color: '#6B3FA0' },
  codestudio:    { label: 'CodeStudio',    color: '#DD4015' },
  hackerrank:    { label: 'HackerRank',    color: '#2EC866' },
  geeksforgeeks: { label: 'GeeksForGeeks', color: '#2F8D46' },
  codeforces:    { label: 'Codeforces',    color: '#1F8ACB' },
  atcoder:       { label: 'AtCoder',       color: '#7B7B7B' },
  credly:        { label: 'Credly',        color: '#FF6B00' },
};

// ─── Badge with image icon ─────────────────────────────────────────────────
const ImageBadge = ({ badge }) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900/40 border border-slate-800/60 px-3 py-4 min-w-[90px] max-w-[110px] transition-all duration-200 hover:border-slate-600/60 hover:bg-slate-900/60">
    <div className="w-14 h-14 rounded-full bg-slate-900/80 flex items-center justify-center overflow-hidden mb-2 ring-1 ring-slate-700/50">
      <img
        src={badge.icon}
        alt={badge.title || 'Badge'}
        className="w-full h-full object-contain p-1"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
    <p className="text-[10px] text-center text-slate-200 leading-tight line-clamp-2 font-medium">
      {badge.title || 'Badge'}
    </p>
    {badge.stars != null && (
      <p className="text-[9px] mt-0.5" style={{ color: '#F6C90E' }}>
        {'★'.repeat(badge.stars)}{'☆'.repeat(Math.max(0, 5 - badge.stars))}
      </p>
    )}
    {badge.platform && (
      <p className="text-[9px] text-slate-500 mt-0.5 capitalize">
        {PLATFORM_META[badge.platform]?.label || badge.platform}
      </p>
    )}
  </div>
);

// ─── Badge without image (truly unknown placeholder) ───────────────────────
const FallbackBadge = ({ badge }) => {
  const color   = badge.platformColor || '#888';
  const initial = (badge.title || '?').charAt(0).toUpperCase();
  const stars   = badge.stars;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-slate-800/60 px-3 py-4 min-w-[90px] max-w-[110px] transition-all duration-200"
      style={{ background: `${color}11` }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-2 text-xl font-bold"
        style={{ background: `${color}22`, color, border: `1.5px solid ${color}55` }}
      >
        {initial}
      </div>
      <p className="text-[10px] text-center text-slate-200 leading-tight line-clamp-2 font-medium">
        {badge.title}
      </p>
      {badge.level && (
        <p className="text-[9px] capitalize mt-0.5" style={{ color }}>{badge.level}</p>
      )}
      {stars != null && (
        <p className="text-[9px] mt-0.5" style={{ color: '#F6C90E' }}>
          {'★'.repeat(stars)}{'☆'.repeat(Math.max(0, 5 - stars))}
        </p>
      )}
    </div>
  );
};

// ─── Build featured achievements ───────────────────────────────────────────
function buildFeaturedAchievements(platforms) {
  const achievements = [];
  platforms.forEach((p) => {
    if (p.platform === 'leetcode' && p.questionsSolved > 0) {
      achievements.push({
        id: 'lc-feat', platform: 'leetcode',
        title: 'LeetCode',
        description: `${p.questionsSolved} problems solved`,
        count: p.contestRating ? `${p.contestRating}` : `${p.questionsSolved}`,
        badgeImage: p.badges.find((b) => b.icon)?.icon || null,
        color: 'bg-orange-500',
      });
    }
    if (p.platform === 'codechef' && p.userStats) {
      const stars = p.userStats.stars;
      achievements.push({
        id: 'cc-feat', platform: 'codechef',
        title: 'CodeChef',
        description: `Rating ${p.contestRating || '—'}`,
        count: stars ? `${stars}★` : `${p.contestRating || '—'}`,
        badgeImage: p.badges.find((b) => b.icon)?.icon || null,
        color: 'bg-purple-500',
      });
    }
    if (p.platform === 'hackerrank' && p.badges.length > 0) {
      const topBadge = [...p.badges].sort((a, b) => (b.stars || 0) - (a.stars || 0))[0];
      achievements.push({
        id: 'hr-feat', platform: 'hackerrank',
        title: 'HackerRank',
        description: `${topBadge.title} — ${topBadge.stars}★`,
        count: `${topBadge.stars}★`,
        badgeImage: topBadge.icon || null,
        icon: <Award className="w-6 h-6 text-green-400" />,
        color: 'bg-green-500',
      });
    }
    if (p.platform === 'codestudio' && p.userStats) {
      achievements.push({
        id: 'cs-feat', platform: 'codestudio',
        title: 'CodeStudio',
        description: `Rating ${p.contestRating || '—'} · ${p.userStats.userLevelName || ''}`,
        count: `${p.contestRating || p.questionsSolved || '—'}`,
        badgeImage: p.userStats.titlePhoto || null,
        color: 'bg-red-500',
      });
    }
    if (p.platform === 'geeksforgeeks' && p.questionsSolved > 0) {
      achievements.push({
        id: 'gfg-feat', platform: 'geeksforgeeks',
        title: 'GeeksForGeeks',
        description: `${p.questionsSolved} problems solved`,
        count: `${p.questionsSolved}`,
        color: 'bg-green-600',
      });
    }
    if (p.platform === 'codeforces' && p.userStats?.currentRating) {
      achievements.push({
        id: 'cf-feat', platform: 'codeforces',
        title: 'Codeforces',
        description: `Rating ${p.userStats.currentRating} · ${p.userStats.rank || ''}`,
        count: `${p.userStats.currentRating}`,
        badgeImage: p.userStats.titlePhoto || null,
        color: 'bg-blue-500',
      });
    }
  });
  return achievements.slice(0, 4);
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/platforms/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setPlatformData(response.data.data || {});
        } else {
          setPlatformData({});
        }
      } catch (err) {
        console.error('Failed to fetch platform data:', err);
        setError('Failed to load platform data');
        setPlatformData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl, token]);

  // ── Aggregation ──────────────────────────────────────────────────────────
  const codolio          = platformData?.codolio || {};
  const codolioSummary   = codolio.summary || {};
  const codolioplatforms = codolio.platforms || [];
  const credlyBadges     = platformData?.credly?.badges || [];

  // Correct connected-platforms count = actual Badger-verified accounts
  const connectedPlatforms = Object.keys(platformData || {}).length;

  const totalBadges       = (codolioSummary.totalBadges || 0) + (platformData?.credly?.badgeCount || 0);
  const totalCertificates = codolioSummary.totalCertificates || 0;
  const totalQuestions    = codolioSummary.totalQuestionsSolved || 0;
  const totalActiveDays   = codolioSummary.totalActiveDays || 0;
  const topSkill          = codolioSummary.topSkill || null;
  const topSkillStars     = codolioSummary.topSkillStars ?? null;

  // ── Badges split: has icon vs. fallback ──────────────────────────────────
  const codolioBadgesWithIcon  = codolioplatforms.flatMap((p) => (p.badges || []).filter((b) => b.icon));
  const codolioBadgesNoIcon    = codolioplatforms.flatMap((p) => (p.badges || []).filter((b) => !b.icon));
  const credlyBadgesNormalized = credlyBadges.map((b) => ({
    id: b.id, icon: b.image, title: b.name, platform: 'credly',
  }));
  const allBadgesWithIcon = [...credlyBadgesNormalized, ...codolioBadgesWithIcon];

  // Certificates
  const codolioCertificates = codolioplatforms.flatMap((p) => p.certificates || []);

  // Featured achievements
  const featuredAchievements = buildFeaturedAchievements(codolioplatforms);

  return (
    <div className="w-full bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          <div className="relative overflow-visible text-white">
            <style>{`
              @keyframes grid-draw { 0%{stroke-dashoffset:1000;opacity:0} 50%{opacity:.5} 100%{stroke-dashoffset:0;opacity:.3} }
              @keyframes pulse-glow { 0%,100%{opacity:.1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.1)} }
              .grid-line{stroke:#94a3b8;stroke-width:.5;opacity:0;stroke-dasharray:5 5;stroke-dashoffset:1000;animation:grid-draw 2s ease-out forwards}
              .detail-dot{fill:#cbd5e1;opacity:0;animation:pulse-glow 3s ease-in-out infinite}
            `}</style>

            {/* Grid background */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <pattern id="gridDashboard" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridDashboard)" />
              <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
              <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
              <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
              <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
              <circle cx="20%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3s' }} />
              <circle cx="80%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3.2s' }} />
              <circle cx="20%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.4s' }} />
              <circle cx="80%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.6s' }} />
            </svg>

            <div className="relative z-10 space-y-8">

              {/* ── Stat Cards (single row) ── */}
              <GradientBlobCard
                totalBadges={totalBadges}
                topSkill={topSkill}
                topSkillStars={topSkillStars}
                connectedPlatforms={connectedPlatforms}
                totalCertificates={totalCertificates}
                totalQuestions={totalQuestions}
                totalActiveDays={totalActiveDays}
                loading={loading}
              />

              {/* ── Featured Achievements ── */}
              <div className="mt-12">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="h-[180px] rounded-xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <FeaturedAchievements achievements={featuredAchievements} />
                )}
              </div>

              {/* ── Contests + Rating Chart ── */}
              <ContestRatingSection platforms={codolioplatforms} loading={loading} />

              {/* ── Awards / Badges ── */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Awards</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {loading
                        ? 'Loading your badges...'
                        : totalBadges > 0
                        ? `${totalBadges} badges across ${connectedPlatforms} connected ${connectedPlatforms === 1 ? 'platform' : 'platforms'}`
                        : 'Connect and verify platforms to start earning badges.'}
                    </p>
                  </div>
                  {allBadgesWithIcon.length + codolioBadgesNoIcon.length > 20 && (
                    <button type="button" className="text-xs text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline">
                      show more
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="flex flex-wrap gap-4">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-[90px] h-[120px] rounded-xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
                    ))}
                  </div>
                )}

                {!loading && totalBadges === 0 && (
                  <div className="text-slate-500 text-sm">No badges to display yet.</div>
                )}

                {/* Badges with resolved icon URLs */}
                {!loading && allBadgesWithIcon.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {allBadgesWithIcon.slice(0, 20).map((badge, i) => (
                      <ImageBadge key={badge.id || i} badge={badge} />
                    ))}
                  </div>
                )}

                {/* Truly icon-less fallback badges */}
                {!loading && codolioBadgesNoIcon.length > 0 && (
                  <>
                    {allBadgesWithIcon.length > 0 && (
                      <div className="my-4 border-t border-slate-800/60" />
                    )}
                    <div className="flex flex-wrap gap-4">
                      {codolioBadgesNoIcon.slice(0, 16).map((badge, i) => (
                        <FallbackBadge key={badge.id || i} badge={badge} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── Certificates ── */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Certificates</h2>
                </div>

                {loading && <div className="text-slate-400 text-sm">Loading certificates...</div>}
                {!loading && error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && !error && credlyBadges.length === 0 && codolioCertificates.length === 0 && (
                  <div className="text-slate-400 text-sm">
                    No certificates found. Connect Credly or HackerRank to see certificates here.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {credlyBadges.map((badge) => (
                    <XCard
                      key={badge.id}
                      authorName={badge.name || 'Credly Badge'}
                      authorHandle={badge.issuer ? `@${badge.issuer}` : '@credly'}
                      authorImage={badge.image}
                      content={[
                        badge.description || 'Achievement issued via Credly.',
                        badge.skills?.length ? `Skills: ${badge.skills.join(', ')}` : '',
                      ].filter(Boolean)}
                      timestamp={badge.issued_on ? `Issued: ${new Date(badge.issued_on).toLocaleDateString()}` : ''}
                      isVerified={true}
                    />
                  ))}

                  {codolioCertificates.map((cert, index) => {
                    const meta = PLATFORM_META[cert.platform] || { label: cert.platform };
                    return (
                      <XCard
                        key={cert.id || `cert-${index}`}
                        authorName={cert.name || 'Certificate'}
                        authorHandle={`@${cert.platform || 'codolio'}`}
                        authorImage={cert.imageUrl || null}
                        content={[`Verified ${cert.type || 'certificate'} from ${meta.label}.`]}
                        timestamp=""
                        isVerified={true}
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;