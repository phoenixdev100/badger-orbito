import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowUpDown,
  Award,
  Binary,
  Boxes,
  Brackets,
  Calculator,
  CheckCircle,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  Flame,
  GitFork,
  Globe,
  Layers,
  Link2,
  Network,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  Shapes,
  Share2,
  ShieldCheck,
  Sparkles,
  Table,
  TrendingUp,
  Trophy,
  Undo2,
  User,
  X,
  Zap,
} from 'lucide-react';

import GradientBlobCard from '../components/gradient-bold-card';
import Sidebar from '../components/Sidebar';
import FeaturedAchievements from '../components/FeaturedAchievements';
import ContestRatingSection from '../components/ContestRatingSection';
import ShareProfileModal from '../components/ShareProfileModal';
import { AppContext } from '../context/AppContext';
import getDeveloperAvatar from '../utils/avatarHelper.js';

// ─── Platform Metadata & Brand Accents ───────────────────────────────────────
const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',      color: '#FFA116', bg: '#FFA11618', url: 'https://leetcode.com' },
  codechef:      { label: 'CodeChef',      color: '#6B3FA0', bg: '#6B3FA018', url: 'https://codechef.com' },
  codestudio:    { label: 'CodeStudio',    color: '#DD4015', bg: '#DD401518', url: 'https://naukri.com/code360' },
  hackerrank:    { label: 'HackerRank',    color: '#2EC866', bg: '#2EC86618', url: 'https://hackerrank.com' },
  geeksforgeeks: { label: 'GeeksForGeeks', color: '#2F8D46', bg: '#2F8D4618', url: 'https://geeksforgeeks.org' },
  codeforces:    { label: 'Codeforces',    color: '#1F8ACB', bg: '#1F8ACB18', url: 'https://codeforces.com' },
  atcoder:       { label: 'AtCoder',       color: '#7B7B7B', bg: '#7B7B7B18', url: 'https://atcoder.jp' },
  credly:        { label: 'Credly',        color: '#FF6B00', bg: '#FF6B0018', url: 'https://credly.com' },
};

// Resolve the user's authentic profile URL for a linked platform
function getPlatformProfileUrl(platform, p, userPlatforms = {}, platformData = {}) {
  if (p?.profileUrl) return p.profileUrl;

  const handle =
    p?.handle ||
    p?.userStats?.handle ||
    userPlatforms?.[platform] ||
    platformData?.userPlatforms?.[platform] ||
    (platform === 'credly' ? userPlatforms?.credly || platformData?.credly?.username : null) ||
    (platform === 'leetcode' ? userPlatforms?.leetcode || platformData?.leetcode?.username : null) ||
    (platform === 'codolio' ? userPlatforms?.codolio || platformData?.codolio?.username : null);

  if (handle) {
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
      case 'codolio':
        return `https://codolio.com/profile/${h}`;
      default:
        break;
    }
  }

  return PLATFORM_META[platform]?.url || '#';
}

// ─── Smart Topic & Badge Icon Resolver ───────────────────────────────────────
// If no image icon exists (or fails to load), maps topic keywords to glowing vector emblems
function renderTopicIcon(title = '', meta) {
  const t = title.toLowerCase();

  // Trees, BST, Tries
  if (t.includes('tree') || t.includes('trie')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
        <GitFork className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Graphs, BFS, DFS
  if (t.includes('graph') || t.includes('breadth') || t.includes('depth') || (t.includes('first') && t.includes('search'))) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
        <Network className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Bit Manipulation, Binary Code
  if (t.includes('bit') || (t.includes('binary') && !t.includes('search'))) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-sky-500/20 to-blue-500/20 border border-sky-500/30 text-sky-400">
        <Binary className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Geometry / Computational Geometry
  if (t.includes('geometr')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
        <Shapes className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Hash Table, Maps
  if (t.includes('hash') || t.includes('map')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-rose-400">
        <Table className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Heap, Priority Queue
  if (t.includes('heap') || t.includes('priority')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400">
        <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Linked List
  if (t.includes('linked list') || (t.includes('list') && !t.includes('hash'))) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 text-teal-400">
        <Link2 className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Math, Number Theory
  if (t.includes('math') || t.includes('number')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400">
        <Calculator className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Matrices (2D Arrays)
  if (t.includes('matric') || t.includes('matrix') || t.includes('2d')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400">
        <Boxes className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Recursion, Backtracking
  if (t.includes('recursion') || t.includes('backtrack')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-red-500/20 to-rose-500/20 border border-rose-500/30 text-rose-400">
        <Repeat className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // SQL, Database
  if (t.includes('sql') || t.includes('data') || t.includes('db')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
        <Database className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Stacks & Queues
  if (t.includes('stack') || t.includes('queue')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400">
        <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Two Pointers, Sliding Window
  if (t.includes('pointer') || t.includes('window')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
        <ArrowLeftRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Greedy
  if (t.includes('greedy')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
        <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Sorting
  if (t.includes('sort')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400">
        <ArrowUpDown className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Searching, Binary Search
  if (t.includes('search')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400">
        <Search className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Dynamic Programming (DP)
  if (t.includes('dynamic') || t.includes('dp')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 text-fuchsia-400">
        <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Strings
  if (t.includes('string')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400">
        <FileCode2 className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Arrays
  if (t.includes('array')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400">
        <Brackets className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Ad-Hoc
  if (t.includes('ad-hoc') || t.includes('adhoc')) {
    return (
      <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-tr from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400">
        <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    );
  }

  // Default Fallback Developer Medal
  return (
    <div
      className="w-full h-full rounded-xl flex items-center justify-center border shadow-inner"
      style={{
        backgroundColor: `${meta.color}18`,
        borderColor: `${meta.color}40`,
        color: meta.color,
      }}
    >
      <Award className="w-6 h-6 sm:w-7 sm:h-7" />
    </div>
  );
}

// ─── Build Featured Achievements ─────────────────────────────────────────────
function buildFeaturedAchievements(platforms) {
  const achievements = [];
  platforms.forEach((p) => {
    if (p.platform === 'leetcode' && p.questionsSolved > 0) {
      achievements.push({
        id: 'lc-feat',
        platform: 'leetcode',
        title: 'LeetCode',
        description: `${p.questionsSolved} problems solved`,
        count: p.contestRating ? `${p.contestRating}` : `${p.questionsSolved}`,
        badgeImage: p.badges?.find((b) => b.icon)?.icon || null,
        color: 'bg-orange-500',
      });
    }
    if (p.platform === 'codechef' && p.userStats) {
      const stars = p.userStats.stars;
      achievements.push({
        id: 'cc-feat',
        platform: 'codechef',
        title: 'CodeChef',
        description: `Rating ${p.contestRating || '-'} · ${p.userStats.globalRank ? `Rank #${p.userStats.globalRank}` : 'Competitive'}`,
        count: stars ? `${stars}★` : `${p.contestRating || '-'}`,
        badgeImage: p.badges?.find((b) => b.icon)?.icon || null,
        color: 'bg-purple-500',
      });
    }
    if (p.platform === 'hackerrank' && p.badges?.length > 0) {
      const topBadge = [...p.badges].sort((a, b) => (b.stars || 0) - (a.stars || 0))[0];
      achievements.push({
        id: 'hr-feat',
        platform: 'hackerrank',
        title: 'HackerRank',
        description: `${topBadge.title} · ${topBadge.stars}★ Certified`,
        count: `${topBadge.stars}★`,
        badgeImage: topBadge.icon || null,
        color: 'bg-green-500',
      });
    }
    if (p.platform === 'codestudio' && p.userStats) {
      achievements.push({
        id: 'cs-feat',
        platform: 'codestudio',
        title: 'CodeStudio',
        description: `Rating ${p.contestRating || '-'} · ${p.userStats.userLevelName || 'Ranked'}`,
        count: `${p.contestRating || p.questionsSolved || '-'}`,
        badgeImage: p.userStats.titlePhoto || null,
        color: 'bg-red-500',
      });
    }
    if (p.platform === 'geeksforgeeks' && p.questionsSolved > 0) {
      achievements.push({
        id: 'gfg-feat',
        platform: 'geeksforgeeks',
        title: 'GeeksForGeeks',
        description: `${p.questionsSolved} practice problems completed`,
        count: `${p.questionsSolved}`,
        color: 'bg-emerald-600',
      });
    }
    if (p.platform === 'codeforces' && p.userStats?.currentRating) {
      achievements.push({
        id: 'cf-feat',
        platform: 'codeforces',
        title: 'Codeforces',
        description: `Rating ${p.userStats.currentRating} · ${p.userStats.rank || 'Coder'}`,
        count: `${p.userStats.currentRating}`,
        badgeImage: p.userStats.titlePhoto || null,
        color: 'bg-blue-500',
      });
    }
  });
  return achievements.slice(0, 4);
}

// ─── Badge Card Component ───────────────────────────────────────────────────
const BadgeCard = ({ badge, onClick }) => {
  const meta = PLATFORM_META[badge.platform] || { label: badge.platform || 'Award', color: '#06b6d4' };
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onClick(badge)}
      whileHover={{ y: -4, scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col items-center justify-center rounded-2xl bg-[#0c0d12]/90 border border-white/10 hover:border-white/25 p-2.5 sm:p-3 w-full h-[135px] sm:h-[145px] shadow-lg backdrop-blur-xl transition-colors text-center cursor-pointer overflow-hidden"
    >
      {/* Subtle hover glow ring */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"
        style={{ backgroundColor: meta.color }}
      />

      {/* Badge Icon or Smart Topic Emblem */}
      <div className="relative z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center p-1 bg-black/60 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-200 shrink-0">
        {badge.icon && !imgError ? (
          <img
            src={badge.icon}
            alt={badge.title || 'Badge'}
            className="w-full h-full object-contain filter drop-shadow"
            onError={() => setImgError(true)}
          />
        ) : (
          renderTopicIcon(badge.title, meta)
        )}
      </div>

      {/* Title & Platform Tag */}
      <div className="relative z-10 w-full text-center mt-2 flex flex-col items-center">
        <p className="text-[11px] sm:text-xs text-white font-medium leading-tight line-clamp-2 w-full group-hover:text-cyan-300 transition-colors">
          {badge.title || 'Achievement'}
        </p>

        {badge.stars != null && (
          <p className="text-[10px] mt-0.5 font-bold tracking-widest text-amber-400">
            {'★'.repeat(Math.min(badge.stars, 5))}
          </p>
        )}

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

// ─── Badge Inspection Modal ─────────────────────────────────────────────────
const BadgeDetailModal = ({ badge, onClose }) => {
  if (!badge) return null;
  const meta = PLATFORM_META[badge.platform] || { label: badge.platform || 'Platform', color: '#06b6d4' };
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#0c0d12] border border-white/15 p-6 sm:p-7 shadow-2xl text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-24 h-24 rounded-2xl p-3 flex items-center justify-center border border-white/15 shadow-xl mb-4"
            style={{ backgroundColor: `${meta.color}15` }}
          >
            {badge.icon && !imgError ? (
              <img
                src={badge.icon}
                alt={badge.title}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              renderTopicIcon(badge.title, meta)
            )}
          </div>

          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 mb-2"
            style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
          >
            {meta.label} Verified
          </span>

          <h3 className="text-xl font-bold text-white tracking-tight">{badge.title}</h3>

          {badge.description && (
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {badge.description}
            </p>
          )}

          {badge.stars != null && (
            <div className="mt-3 text-amber-400 text-sm font-bold tracking-widest">
              {'★'.repeat(badge.stars)}{'☆'.repeat(Math.max(0, 5 - badge.stars))}
            </div>
          )}

          {badge.skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {badge.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Authenticated via Orbito - Centered */}
          <div className="w-full mt-6 pt-4 border-t border-white/10 flex items-center justify-center text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Authenticated via Orbito
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Certificate Inspection Modal ───────────────────────────────────────────
// ─── Certificate Inspection Modal (High-Resolution Enterprise Diploma) ──────
const CertificateDetailModal = ({ cert, onClose, userName }) => {
  if (!cert) return null;
  const meta = PLATFORM_META[cert.platform] || { label: cert.platform || 'Platform', color: '#10b981' };
  const [imgError, setImgError] = useState(false);
  const certImage = (cert.image || cert.imageUrl) && !imgError ? (cert.image || cert.imageUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#090a0f] border border-white/20 p-4 sm:p-7 md:p-8 shadow-2xl text-white my-auto overflow-hidden"
      >
        {/* Ambient background glow accents */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: meta.color }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: '#10b981' }}
        />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Standard Master Diploma Canvas ────────────────────────── */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0f1118] via-[#090b10] to-[#08090d] border-2 border-amber-500/30 p-6 sm:p-9 md:p-11 shadow-2xl overflow-hidden">
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

          {/* Watermark Security Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Top Authority Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
                Orbito Verified Credential · Official Certificate
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            {/* Platform Emblem & Badge if image exists */}
            <div className="my-3 flex items-center justify-center">
              {certImage ? (
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl p-2.5 flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md"
                  style={{ backgroundColor: `${meta.color}15` }}
                >
                  <img
                    src={certImage}
                    alt={cert.name}
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-3 flex items-center justify-center border border-amber-500/30 shadow-2xl"
                  style={{ backgroundColor: `${meta.color}18` }}
                >
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
                </div>
              )}
            </div>

            {/* Certificate Header Prose */}
            <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-1 font-mono">
              This is officially awarded to
            </p>

            {/* Recipient Full Name */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1.5 font-serif capitalize">
              {userName || 'Verified Developer'}
            </h2>

            <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent my-3" />

            <p className="text-xs sm:text-sm text-slate-400">
              for successfully demonstrating technical proficiency and verified achievement in
            </p>

            {/* Certificate Title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mt-2 tracking-tight">
              {cert.name}
            </h3>

            {/* Description if available */}
            {cert.description && (
              <p className="text-xs sm:text-sm text-slate-300/90 mt-2.5 max-w-2xl leading-relaxed">
                {cert.description}
              </p>
            )}

            {/* Skills Pills */}
            {cert.skills?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-xl">
                {cert.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-white/10 text-[11px] text-slate-200 border border-white/10 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Three-Column Diploma Verification Footer */}
            <div className="w-full mt-8 pt-6 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
              {/* Left Column: Issuer */}
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Verified Issuer</p>
                <p className="text-sm font-bold text-white mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  {cert.issuer || meta.label}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Platform: {meta.label}</p>
              </div>

              {/* Center Column: Golden Cryptographic Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400/60 bg-gradient-to-b from-amber-500/20 to-yellow-600/10 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 p-1">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="text-[8px] font-bold tracking-tighter text-amber-300 font-mono mt-0.5 uppercase">Verified</span>
                </div>
                <span className="text-[9px] text-amber-400/80 font-mono tracking-widest mt-1">SEAL OF AUTHENTICITY</span>
              </div>

              {/* Right Column: Date & Credential ID */}
              <div className="text-center sm:text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Date Issued</p>
                <p className="text-sm font-bold text-white mt-0.5 font-mono">
                  {cert.issued_on || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[200px] sm:ml-auto">
                  ID: {cert.id || `ORB-${Math.abs(cert.name.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase()}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authenticated via Orbito - Centered Bottom of Modal */}
        <div className="w-full mt-6 flex items-center justify-center text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Authenticated via Orbito
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Dashboard Page ────────────────────────────────────────────────────
const Dashboard = () => {
  const { backendUrl, token, user, platformFilter, setPlatformFilter } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard | Orbito';
  }, []);

  const [platformData, setPlatformData] = useState(null);
  const [userPlatforms, setUserPlatforms] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Search states for Trophy Room (platform filter lives in AppContext so the
  // left sidebar platform icons can drive it)
  const [badgeSearch, setBadgeSearch] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);

  // Show loading skeleton when platform filter changes
  useEffect(() => {
    setFilterLoading(true);
    const timer = setTimeout(() => setFilterLoading(false), 400);
    return () => clearTimeout(timer);
  }, [platformFilter]);

  // Fetch full developer achievements
  const fetchData = async (isSync = false) => {
    if (!token) return;
    if (isSync) setSyncing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}/api/platforms/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setPlatformData(response.data.data || {});
        setUserPlatforms(response.data.userPlatforms || response.data.data?.userPlatforms || {});
        if (isSync) toast.success('Platforms synchronized successfully!');
      } else {
        setPlatformData({});
        setUserPlatforms({});
      }
    } catch (err) {
      console.error('Failed to fetch platform data:', err);
      setError('Failed to load platform data');
      setPlatformData({});
      setUserPlatforms({});
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl, token]);

  // Handle hash scrolling for quick section jumps
  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Share Profile Modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  // ── Aggregation ──────────────────────────────────────────────────────────
  const codolio          = platformData?.codolio || {};
  const codolioSummary   = codolio.summary || {};
  const codolioplatforms = codolio.platforms || [];
  const credlyBadges     = platformData?.credly?.badges || [];

  // Count only genuine connected platforms that have actual verified data
  const TRACKED_PLATFORM_KEYS = ['codolio', 'credly', 'leetcode', 'codechef', 'codestudio'];
  const connectedPlatforms = useMemo(() => {
    if (!platformData) return 0;
    return TRACKED_PLATFORM_KEYS.filter((key) => {
      const val = platformData[key];
      if (!val) return false;
      if (Array.isArray(val.platforms) && val.platforms.length > 0) return true;
      if (Array.isArray(val.badges) && val.badges.length > 0) return true;
      if (val.totalQuestions != null || val.questionsSolved != null) return true;
      if (val.username || val.badgeCount > 0) return true;
      return false;
    }).length;
  }, [platformData]);
  const totalBadges       = (codolioSummary.totalBadges || 0) + (platformData?.credly?.badgeCount || 0);
  const totalCertificates = (codolioSummary.totalCertificates || 0) + credlyBadges.length;
  const totalQuestions    = codolioSummary.totalQuestionsSolved || 0;
  const totalActiveDays   = codolioSummary.totalActiveDays || 0;
  const topSkill          = codolioSummary.topSkill || null;
  const topSkillStars     = codolioSummary.topSkillStars ?? null;

  // Normalized Badges List
  const allBadges = useMemo(() => {
    const list = [];

    // Credly badges
    credlyBadges.forEach((b) => {
      list.push({
        id: b.id || `credly-${b.name}`,
        title: b.name,
        icon: b.image,
        platform: 'credly',
        description: b.description,
        issuer: b.issuer,
        skills: b.skills || [],
        issued_on: b.issued_on,
      });
    });

    // Codolio platform badges
    codolioplatforms.forEach((p) => {
      (p.badges || []).forEach((b, i) => {
        list.push({
          id: b.id || `${p.platform}-${i}`,
          title: b.title || 'Platform Badge',
          icon: b.icon || null,
          platform: p.platform || 'codolio',
          stars: b.stars,
          level: b.level,
        });
      });
    });

    return list;
  }, [credlyBadges, codolioplatforms]);

  // Shared platform matcher — 'codolio' is an aggregator, so it matches every
  // codolio-sourced platform (i.e. anything that isn't Credly)
  const matchesPlatform = (p) => {
    if (platformFilter === 'all') return true;
    if (platformFilter === 'codolio') return p !== 'credly';
    if (platformFilter === 'other') {
      return !['leetcode', 'credly', 'codechef', 'hackerrank'].includes(p);
    }
    return p === platformFilter;
  };

  // Filtered badges based on active platform filter and search query
  const filteredBadges = useMemo(() => {
    return allBadges.filter((b) => {
      const query = badgeSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.platform?.toLowerCase().includes(query) ||
        (b.skills && b.skills.some((s) => s.toLowerCase().includes(query)));

      return matchesPlatform(b.platform) && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBadges, platformFilter, badgeSearch]);

  // Certificates & platform sections narrowed by the same filter
  const codolioCertificates = codolioplatforms.flatMap((p) => p.certificates || []);
  const filteredCredlyBadges = credlyBadges.filter(() => matchesPlatform('credly'));
  const filteredCodolioCertificates = codolioCertificates.filter((c) => matchesPlatform(c.platform));
  const visiblePlatforms = codolioplatforms.filter((p) => matchesPlatform(p.platform));
  const featuredAchievements = buildFeaturedAchievements(visiblePlatforms);
  const activeFilterLabel =
    platformFilter === 'codolio' ? 'Codolio'
    : platformFilter === 'other' ? 'More'
    : PLATFORM_META[platformFilter]?.label || platformFilter;

  // Dynamic developer level calculation
  const devLevel = Math.min(99, Math.max(1, Math.floor(totalQuestions / 40 + totalBadges * 2) || 1));
  const devTitle =
    totalQuestions > 600
      ? 'Senior Systems Architect'
      : totalQuestions > 300
      ? 'Full-Stack Software Engineer'
      : totalQuestions > 100
      ? 'Competitive Programmer'
      : 'Junior Developer';

  return (
    <div className="w-full bg-black min-h-screen text-white">
      <Sidebar />

      {/* Main Content Pane - Fully Utilizing Screen Width */}
      <div className="ml-0 md:ml-20">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10">
          <div className="relative overflow-visible space-y-8">

            {/* ── 1. DEVELOPER COMMAND HEADER ─────────────────────────────────── */}
            <div className="relative w-full rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Background ambient lighting */}
              <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left: Avatar + Identity */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-lg shrink-0">
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center overflow-hidden p-0.5">
                      <img
                        src={getDeveloperAvatar(user, platformData)}
                        alt={user?.name || 'Developer'}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                    {/* Live status dot */}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" title="Verified" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {user?.name || 'Developer'}
                      </h1>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified Developer
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-cyan-400">@{user?.email?.split('@')[0] || 'orbito'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-xs font-medium">
                        Level {devLevel} · {devTitle}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">
                        {connectedPlatforms} {connectedPlatforms === 1 ? 'Platform' : 'Platforms'} Connected
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-semibold text-white transition-all cursor-pointer hover:shadow-lg"
                  >
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>Share Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchData(true)}
                    disabled={syncing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-sm font-semibold text-cyan-400 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Data'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── 2. CONNECTED PLATFORMS QUICK STRIP ─────────────────────────── */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                  Linked Developer Ecosystems
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/addPlatform')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Connect Platform
                </button>
              </div>

              {filterLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 w-full">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 w-full">
                  {visiblePlatforms.map((p) => {
                    const meta = PLATFORM_META[p.platform] || { label: p.platform, color: '#06b6d4', url: '#' };
                    const targetUrl = getPlatformProfileUrl(p.platform, p, userPlatforms, platformData);
                    const handle = p.handle || p.userStats?.handle || userPlatforms?.[p.platform] || platformData?.userPlatforms?.[p.platform];
                    const isActive = platformFilter === p.platform;
                    return (
                      <div
                        key={p.platform}
                        role="button"
                        tabIndex={0}
                        onClick={() => setPlatformFilter(isActive ? 'all' : p.platform)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPlatformFilter(isActive ? 'all' : p.platform); }}
                        title={isActive ? `Clear ${meta.label} filter` : `Filter dashboard by ${meta.label}`}
                        className={`rounded-xl bg-[#0c0d12]/80 border p-3 flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isActive
                            ? 'border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.25)]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                            <p className="text-xs font-semibold text-white truncate">{meta.label}</p>
                            {isActive && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {p.contestRating ? `Rating ${p.contestRating}` : `${p.questionsSolved || 0} Solved`}
                          </p>
                        </div>
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                          title={handle ? `Open ${meta.label} Profile (@${handle})` : `Open ${meta.label}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    );
                  })}

                  {/* If Credly is connected */}
                  {filteredCredlyBadges.length > 0 && (() => {
                    const isActive = platformFilter === 'credly';
                    return (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPlatformFilter(isActive ? 'all' : 'credly')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPlatformFilter(isActive ? 'all' : 'credly'); }}
                        title={isActive ? 'Clear Credly filter' : 'Filter dashboard by Credly'}
                        className={`rounded-xl bg-[#0c0d12]/80 border p-3 flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isActive
                            ? 'border-orange-400/60 shadow-[0_0_18px_rgba(255,107,0,0.25)]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-xs font-semibold text-white truncate">Credly</p>
                            {isActive && <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {filteredCredlyBadges.length} Badges
                          </p>
                        </div>
                        <a
                          href={getPlatformProfileUrl('credly', null, userPlatforms, platformData)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                          title={userPlatforms?.credly || platformData?.userPlatforms?.credly ? `Open Credly Profile (@${userPlatforms?.credly || platformData?.userPlatforms?.credly})` : "Open Credly"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ── 3. ENTERPRISE BENTO STATS GRID ──────────────────────────────── */}
            <div className="w-full">
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
            </div>

            {/* ── 4. FEATURED MILESTONES / ACHIEVEMENTS ───────────────────────── */}
            <div className="w-full mt-8">
              {loading || filterLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[180px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                  ))}
                </div>
              ) : (
                <FeaturedAchievements achievements={featuredAchievements} />
              )}
            </div>

            {/* ── 5. CONTEST RATINGS & PERFORMANCE CHART ──────────────────────── */}
            <div className="w-full mt-8">
              <ContestRatingSection platforms={visiblePlatforms} summary={codolioSummary} loading={loading || filterLoading} />
            </div>

            {/* ── 6. ENTERPRISE TROPHY ROOM / BADGES SHOWCASE ─────────────────── */}
            <div id="trophy-room" className="w-full mt-12 scroll-mt-6 rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Trophy Room</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                      {filteredBadges.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified honors, contest medals, and domain masteries across all connected platforms.
                  </p>
                  {platformFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setPlatformFilter('all')}
                      title="Clear platform filter"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/25 transition-colors cursor-pointer"
                    >
                      <span>Filtered: {activeFilterLabel}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Search Bar + Filter Tabs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={badgeSearch}
                      onChange={(e) => setBadgeSearch(e.target.value)}
                      placeholder="Search awards by name or skill..."
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400 transition-colors w-full sm:w-56"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'leetcode', label: 'LeetCode' },
                      { id: 'credly', label: 'Credly' },
                      { id: 'codechef', label: 'CodeChef' },
                      { id: 'hackerrank', label: 'HackerRank' },
                      { id: 'other', label: 'More' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPlatformFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                          platformFilter === tab.id
                            ? 'bg-white text-black font-semibold shadow-md'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges Grid View - Fully Stretched Grid with No Empty Gaps */}
              {loading || filterLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3.5 sm:gap-4 w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <div key={i} className="w-full h-[135px] sm:h-[145px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                  ))}
                </div>
              ) : filteredBadges.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  {badgeSearch
                    ? `No awards matching "${badgeSearch}". Try a different keyword.`
                    : platformFilter !== 'all'
                    ? `No awards found for ${activeFilterLabel}.`
                    : 'No awards found for this category.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3.5 sm:gap-4 w-full">
                  {filteredBadges.map((badge, idx) => (
                    <BadgeCard
                      key={badge.id || idx}
                      badge={badge}
                      onClick={setSelectedBadge}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── 7. VERIFIED CERTIFICATES SHOWCASE ──────────────────────────── */}
            <div id="certificates-section" className="w-full mt-12 scroll-mt-6 rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Verified Certifications</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                      {filteredCredlyBadges.length + filteredCodolioCertificates.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Industry-recognized certifications cryptographically verified through platforms.
                  </p>
                </div>
              </div>

              {filterLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[120px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                  ))}
                </div>
              ) : filteredCredlyBadges.length === 0 && filteredCodolioCertificates.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm border border-dashed border-white/10 rounded-2xl">
                  {platformFilter !== 'all'
                    ? 'No verified certificates found for the selected platform.'
                    : 'No verified certificates yet. Connect your Credly or HackerRank account to populate official badges here.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 w-full">
                  {/* Credly Verified Certificates */}
                  {filteredCredlyBadges.map((badge) => (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedCert({ ...badge, platform: 'credly' })}
                    className="group rounded-2xl bg-[#0e0f14] border border-white/10 hover:border-emerald-500/40 hover:bg-[#12141c] p-5 shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0">
                        {badge.image ? (
                          <img
                            src={badge.image}
                            alt={badge.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <Award className="w-8 h-8 text-amber-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {badge.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Credly
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {badge.description || `Issued by ${badge.issuer || 'Accredited Authority'}`}
                        </p>
                      </div>
                    </div>

                    {badge.skills?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                        {badge.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-300 border border-white/5">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Codolio Platform Certificates */}
                {filteredCodolioCertificates.map((cert, index) => {
                  const meta = PLATFORM_META[cert.platform] || { label: cert.platform, color: '#06b6d4' };
                  return (
                    <div
                      key={cert.id || index}
                      onClick={() => setSelectedCert(cert)}
                      className="group rounded-2xl bg-[#0e0f14] border border-white/10 hover:border-emerald-500/40 hover:bg-[#12141c] p-5 shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0">
                          {cert.imageUrl ? (
                            <img
                              src={cert.imageUrl}
                              alt={cert.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <ShieldCheck className="w-8 h-8" style={{ color: meta.color }} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {cert.name || 'Verified Certificate'}
                            </h4>
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-white/10"
                              style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                            >
                              <CheckCircle className="w-3 h-3" /> {meta.label}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            Verified {cert.type || 'credential'} issued through {meta.label}.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Badge Detail Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Certificate Detail Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateDetailModal
            cert={selectedCert}
            userName={user?.name || 'Verified Developer'}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Share Portfolio Modal ────────────────────────────────────────── */}
      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default Dashboard;
