import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle,
  Lock,
  ExternalLink,
  Share2,
  Trophy,
  Award,
  Flame,
  ArrowRight,
  Globe,
  Sparkles,
  Search,
  X,
  FileCheck2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import GradientBlobCard from '../components/gradient-bold-card';
import ContestRatingSection from '../components/ContestRatingSection';
import FeaturedAchievements from '../components/FeaturedAchievements';
import { AppContext } from '../context/AppContext';
import getDeveloperAvatar from '../utils/avatarHelper.js';

// ── Platform Colors & Meta ──────────────────────────────────────────────────
const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',      color: '#FFA116', bg: '#FFA11618', url: 'https://leetcode.com' },
  codechef:      { label: 'CodeChef',      color: '#A855F7', bg: '#A855F718', url: 'https://codechef.com' },
  codestudio:    { label: 'CodeStudio',    color: '#DD4015', bg: '#DD401518', url: 'https://naukri.com/code360' },
  hackerrank:    { label: 'HackerRank',    color: '#2EC866', bg: '#2EC86618', url: 'https://hackerrank.com' },
  geeksforgeeks: { label: 'GeeksForGeeks', color: '#2F8D46', bg: '#2F8D4618', url: 'https://geeksforgeeks.org' },
  codeforces:    { label: 'Codeforces',    color: '#1F8ACB', bg: '#1F8ACB18', url: 'https://codeforces.com' },
  atcoder:       { label: 'AtCoder',       color: '#7B7B7B', bg: '#7B7B7B18', url: 'https://atcoder.jp' },
  credly:        { label: 'Credly',        color: '#FF6B00', bg: '#FF6B0018', url: 'https://credly.com' },
  codolio:       { label: 'Codolio',       color: '#06b6d4', bg: '#06b6d418', url: 'https://codolio.com' },
};

function getPlatformProfileUrl(platform, handle, userPlatforms, platformData) {
  const h =
    handle ||
    userPlatforms?.[platform] ||
    platformData?.userPlatforms?.[platform] ||
    platformData?.[platform]?.username ||
    '';

  if (h) {
    switch (platform) {
      case 'leetcode':
        return `https://leetcode.com/u/${h}`;
      case 'codechef':
        return `https://www.codechef.com/users/${h}`;
      case 'codestudio':
        return `https://www.naukri.com/code360/profile/${h}`;
      case 'credly':
        return `https://www.credly.com/users/${h}`;
      case 'codolio':
        return `https://codolio.com/profile/${h}`;
      case 'hackerrank':
        return `https://www.hackerrank.com/profile/${h}`;
      default:
        break;
    }
  }
  return PLATFORM_META[platform]?.url || '#';
}

// ── Badge Card Component ────────────────────────────────────────────────────
const BadgeCard = ({ badge, onClick }) => {
  const meta = PLATFORM_META[badge.platform] || { label: badge.platform || 'Platform', color: '#06b6d4' };
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.15 }}
      onClick={() => onClick(badge)}
      className="group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#0e1017]/80 hover:bg-[#131622]/90 border border-white/10 hover:border-white/20 transition-all text-center cursor-pointer shadow-lg w-full h-[135px] sm:h-[145px] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"
        style={{ backgroundColor: meta.color }}
      />
      <div className="relative z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center p-1 bg-black/60 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-200 shrink-0">
        {badge.icon && !imgError ? (
          <img
            src={badge.icon}
            alt={badge.title || 'Badge'}
            className="w-full h-full object-contain filter drop-shadow"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full rounded-xl flex items-center justify-center border shadow-inner text-xs font-bold"
            style={{ backgroundColor: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }}
          >
            <Trophy className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10 w-full text-center mt-2 flex flex-col items-center">
        <p className="text-[11px] sm:text-xs text-white font-medium leading-tight line-clamp-2 w-full group-hover:text-cyan-300 transition-colors">
          {badge.title || 'Achievement'}
        </p>
        <span
          className="mt-1 px-1.5 py-0.2 rounded-md text-[9px] font-semibold tracking-wider uppercase border border-white/10"
          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>
    </motion.button>
  );
};

// ── Badge Detail Modal ──────────────────────────────────────────────────────
const BadgeDetailModal = ({ badge, onClose }) => {
  if (!badge) return null;
  const meta = PLATFORM_META[badge.platform] || { label: badge.platform || 'Platform', color: '#06b6d4' };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c0d12] border border-white/15 p-6 shadow-2xl text-white text-center" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="w-20 h-20 rounded-2xl p-2 mx-auto flex items-center justify-center border border-white/15 mb-4" style={{ backgroundColor: `${meta.color}15` }}>
          {badge.icon ? <img src={badge.icon} alt={badge.title} className="w-full h-full object-contain" /> : <Trophy className="w-8 h-8 text-amber-400" />}
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 mb-2 inline-block" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
          {meta.label} Verified
        </span>
        <h3 className="text-xl font-bold text-white mt-1">{badge.title}</h3>
        <div className="w-full mt-6 pt-4 border-t border-white/10 flex items-center justify-center text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Authenticated via Orbito
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Certificate Modal ───────────────────────────────────────────────────────
const CertificateModal = ({ cert, onClose, userName }) => {
  if (!cert) return null;
  const meta = PLATFORM_META[cert.platform] || { label: cert.platform || 'Platform', color: '#10b981' };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090a0f] border border-white/20 p-6 sm:p-8 shadow-2xl text-white my-auto" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0f1118] via-[#090b10] to-[#08090d] border-2 border-amber-500/30 p-6 sm:p-10 shadow-2xl text-center">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30">
            Official Credential
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mt-4">{cert.title || cert.name || 'Verified Certificate'}</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">Issued to</p>
          <p className="text-lg font-bold text-cyan-400 mt-1">{userName || 'Developer'}</p>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4" /> Cryptographically Verified via Orbito Protocol
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Build Featured Achievements ─────────────────────────────────────────────
function buildFeaturedAchievements(platforms) {
  const achievements = [];
  (platforms || []).forEach((p) => {
    if (p.platform === 'leetcode' && p.questionsSolved > 0) {
      achievements.push({
        id: 'lc-feat', platform: 'leetcode', title: 'LeetCode',
        description: `${p.questionsSolved} problems solved`,
        count: p.contestRating ? `${p.contestRating}` : `${p.questionsSolved}`,
        badgeImage: p.badges?.find((b) => b.icon)?.icon || null,
        color: 'bg-orange-500',
      });
    }
    if (p.platform === 'codechef' && p.contestRating) {
      achievements.push({
        id: 'cc-feat', platform: 'codechef', title: 'CodeChef',
        description: `Peak Rating · ${p.stars || 0}★`,
        count: `${p.contestRating}`,
        badgeImage: null, color: 'bg-purple-500',
      });
    }
    if (p.platform === 'codestudio' && p.userStats) {
      achievements.push({
        id: 'cs-feat', platform: 'codestudio', title: 'CodeStudio',
        description: `${p.userStats.problemsSolved || 0} coding challenges solved`,
        count: `${p.userStats.problemsSolved || 0}`,
        badgeImage: null, color: 'bg-red-500',
      });
    }
  });
  return achievements;
}

const PublicProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = (import.meta.env.VITE_BASE_URL || '').replace(/\/+$/, '');
        const res = await axios.get(`${baseUrl}/api/user/public/${encodeURIComponent(username)}`);
        if (!isMounted) return;

        if (res.data?.success) {
          if (res.data.isPrivate) {
            setIsPrivate(true);
            setProfileData(res.data);
          } else {
            setIsPrivate(false);
            setProfileData(res.data);
          }
        } else {
          setError(res.data?.message || 'Profile not found');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load developer profile');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPublicProfile();
    return () => { isMounted = false; };
  }, [username]);

  // Dynamic SEO Title
  useEffect(() => {
    if (profileData?.user?.name || username) {
      const displayName = profileData?.user?.name ? `${profileData.user.name} (@${username})` : `@${username}`;
      document.title = `${displayName} - Developer Portfolio | Orbito`;
    } else {
      document.title = 'Developer Profile | Orbito';
    }
  }, [profileData, username]);

  // Aggregation
  const user = profileData?.user || {};
  const platformData = profileData?.data || {};
  const userPlatforms = profileData?.userPlatforms || {};

  const codolio = platformData?.codolio || {};
  const codolioSummary = codolio.summary || {};
  const codolioplatforms = codolio.platforms || [];
  const credlyBadges = platformData?.credly?.badges || [];

  const totalBadges = (codolioSummary.totalBadges || 0) + (platformData?.credly?.badgeCount || 0);
  const totalCertificates = (codolioSummary.totalCertificates || 0) + credlyBadges.length;
  const totalQuestions = codolioSummary.totalQuestionsSolved || 0;
  const totalActiveDays = codolioSummary.totalActiveDays || 0;
  const topSkill = codolioSummary.topSkill || null;
  const topSkillStars = codolioSummary.topSkillStars ?? null;

  const connectedPlatformsCount = useMemo(() => {
    const TRACKED = ['codolio', 'credly', 'leetcode', 'codechef', 'codestudio'];
    return TRACKED.filter((k) => {
      const v = platformData[k];
      return v && (v.platforms?.length || v.badges?.length || v.totalQuestions != null || v.username);
    }).length;
  }, [platformData]);

  const allBadges = useMemo(() => {
    const list = [];
    credlyBadges.forEach((b) => {
      list.push({
        id: b.id || `credly-${b.name}`,
        title: b.name,
        platform: 'credly',
        icon: b.image || null,
        description: b.description,
        skills: b.skills || [],
      });
    });
    codolioplatforms.forEach((p) => {
      (p.badges || []).forEach((b) => {
        list.push({ ...b, platform: b.platform || p.platform });
      });
    });
    return list;
  }, [credlyBadges, codolioplatforms]);

  const codolioCertificates = codolioplatforms.flatMap((p) => p.certificates || []);
  const featuredAchievements = buildFeaturedAchievements(codolioplatforms);

  const devLevel = Math.min(99, Math.max(1, Math.floor(totalQuestions / 40 + totalBadges * 2) || 1));
  const devTitle =
    totalQuestions > 600
      ? 'Senior Systems Architect'
      : totalQuestions > 300
      ? 'Full-Stack Software Engineer'
      : totalQuestions > 100
      ? 'Competitive Programmer'
      : 'Junior Developer';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Public profile link copied!');
  };

  // ── Render Loading State ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center animate-pulse mb-4">
          <Globe className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-300">Resolving developer telemetry...</p>
        <p className="text-xs text-slate-500 mt-1 font-mono">@{username}</p>
      </div>
    );
  }

  // ── Render Error / Not Found ──────────────────────────────────────────────
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
          <X className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Developer Not Found</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          {error || `No developer profile matching @${username} was found on Orbito.`}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-lg"
        >
          <span>Explore Orbito Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // ── Render Private Profile Notice ─────────────────────────────────────────
  if (isPrivate) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0c0d12] border border-white/15 p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">This Profile is Private</h2>
          <p className="text-xs font-mono text-cyan-400 mt-1">@{user.username || username}</p>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            The developer has set their Orbito portfolio visibility to private. Verified contest telemetry and badges are hidden.
          </p>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all"
            >
              Back to Home
            </Link>

            {currentUser?.username === username && (
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-slate-200 transition-all"
              >
                <span>Change in Settings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Render Public Verified Showcase ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Floating Glass Brand Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#07080c]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-base tracking-tight text-white hover:text-cyan-400 transition-colors">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-black">O</span>
            <span>Orbito</span>
          </Link>
          <span className="hidden sm:inline text-xs text-slate-500">|</span>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">Verified Developer Portfolio</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all shadow-md"
          >
            <span>Create Yours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Portfolio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── 1. Profile Hero Banner ── */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0c0d14] via-[#090a10] to-[#0d0e16] border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-2xl shrink-0">
                <div className="w-full h-full rounded-[22px] bg-[#090a0f] flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src={getDeveloperAvatar(user, platformData)}
                    alt={user.name || 'Developer'}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user.name || 'Developer'}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified Developer
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-cyan-400">@{user.username || username}</span>
                  <span className="text-slate-600">•</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-xs font-medium">
                    Level {devLevel} · {devTitle}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{connectedPlatformsCount} Platforms Synced</span>
                </p>

                {user.bio && (
                  <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">{user.bio}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Public Profile</span>
            </button>
          </div>
        </div>

        {/* ── 2. Bento Stats Grid ── */}
        <GradientBlobCard
          totalBadges={totalBadges}
          topSkill={topSkill}
          topSkillStars={topSkillStars}
          connectedPlatforms={connectedPlatformsCount}
          totalCertificates={totalCertificates}
          totalQuestions={totalQuestions}
          totalActiveDays={totalActiveDays}
          loading={false}
        />

        {/* ── 3. Featured Milestones ── */}
        {featuredAchievements.length > 0 && (
          <FeaturedAchievements achievements={featuredAchievements} />
        )}

        {/* ── 4. Contest Ratings & Activity Heatmap ── */}
        <ContestRatingSection platforms={codolioplatforms} summary={codolioSummary} loading={false} />

        {/* ── 5. Trophy Room ── */}
        <div className="rounded-3xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Trophy Room</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                  {allBadges.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Verified honors, contest medals, and domain masteries.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3.5 sm:gap-4">
            {allBadges.map((badge, idx) => (
              <BadgeCard key={badge.id || idx} badge={badge} onClick={setSelectedBadge} />
            ))}
          </div>
        </div>

        {/* ── 6. Verified Certificates ── */}
        {(credlyBadges.length > 0 || codolioCertificates.length > 0) && (
          <div className="rounded-3xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verified Credentials</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                    {credlyBadges.length + codolioCertificates.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Official master diplomas and industry credentials.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credlyBadges.map((cert, i) => (
                <div
                  key={cert.id || i}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center p-1.5 shrink-0">
                    {cert.image ? <img src={cert.image} alt={cert.name} className="w-full h-full object-contain" /> : <Award className="w-6 h-6 text-orange-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{cert.name}</p>
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mt-0.5">Credly Verified</p>
                  </div>
                </div>
              ))}

              {codolioCertificates.map((cert, i) => (
                <div
                  key={cert.id || `codolio-cert-${i}`}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center p-1.5 shrink-0">
                    <Award className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{cert.name || cert.title || 'Certificate'}</p>
                    <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mt-0.5">Verified</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedBadge && <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />}
      {selectedCert && <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} userName={user.name} />}
    </div>
  );
};

export default PublicProfile;

