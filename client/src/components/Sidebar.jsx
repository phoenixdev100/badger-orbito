import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import assets from '../assets/assets.js';
import AnimatedProfileCard from './info-card';
import ShareProfileModal from './ShareProfileModal';
import { AppContext } from '../context/AppContext';
import getDeveloperAvatar from '../utils/avatarHelper.js';

import {
  LayoutDashboard,
  Trophy,
  Award,
  Plus,
  Share2,
} from 'lucide-react';

// ─── Compact Sleek Sidebar Tooltip ──────────────────────────────────────────
const SidebarTooltip = ({ label }) => (
  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[99999] pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-1.5 group-hover:translate-x-0 transition-all duration-150 ease-out whitespace-nowrap">
    <div className="px-2.5 py-1 rounded-lg bg-[#0e1017] border border-white/15 text-xs font-medium text-white shadow-xl backdrop-blur-md">
      {label}
    </div>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, platformData, platformFilter, setPlatformFilter } = useContext(AppContext);

  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popups & Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Debounced hover timer for smooth transitions
  const profileTimerRef = useRef(null);

  // Platform metadata with official logos
  const PLATFORM_LOGOS = {
    leetcode:   { name: 'LeetCode',   logo: assets.leetcodeImage },
    codechef:   { name: 'CodeChef',   logo: assets.codechefImage },
    credly:     { name: 'Credly',     logo: assets.credlyImage },
    codestudio: { name: 'CodeStudio', logo: assets.codestudioImage },
    codolio:    { name: 'Codolio',    logo: assets.codolioImage },
  };

  // Fetch user's verified connected platforms
  useEffect(() => {
    let isMounted = true;
    const fetchUserPlatforms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const baseUrl = (import.meta.env.VITE_BASE_URL || '').replace(/\/+$/, '');
        const response = await axios.get(`${baseUrl}/api/platforms/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.success && response.data.platforms && isMounted) {
          const connected = [];
          for (const [platform, data] of Object.entries(response.data.platforms)) {
            if (data.verified && PLATFORM_LOGOS[platform]) {
              connected.push({
                id: platform,
                name: PLATFORM_LOGOS[platform].name,
                logo: PLATFORM_LOGOS[platform].logo,
                username: data.username
              });
            }
          }
          setConnectedPlatforms(connected);
        }
      } catch (error) {
        console.error('Error fetching user platforms:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserPlatforms();
    return () => { isMounted = false; };
  }, []);

  // Hover Handlers for Profile & Settings
  const handleMouseEnterProfile = () => {
    clearTimeout(profileTimerRef.current);
    setShowProfilePopup(true);
  };

  const handleMouseLeaveProfile = () => {
    profileTimerRef.current = setTimeout(() => {
      setShowProfilePopup(false);
    }, 220);
  };

  // Primary Navigation Actions
  const primaryNavItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      onClick: () => {
        setPlatformFilter('all');
        if (pathname === '/dashboard') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/dashboard');
        }
      },
      isActive: (pathname === '/dashboard' || pathname === '/') && !window.location.hash,
    },
    {
      id: 'trophy',
      icon: Trophy,
      label: 'Trophy Room',
      onClick: () => {
        if (pathname === '/dashboard') {
          document.getElementById('trophy-room')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/dashboard#trophy-room');
        }
      },
      isActive: window.location.hash === '#trophy-room',
    },
    {
      id: 'certificates',
      icon: Award,
      label: 'Certificates',
      onClick: () => {
        if (pathname === '/dashboard') {
          document.getElementById('certificates-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/dashboard#certificates-section');
        }
      },
      isActive: window.location.hash === '#certificates-section',
    },
    {
      id: 'addPlatform',
      icon: Plus,
      label: 'Add Platform',
      onClick: () => navigate('/addPlatform'),
      isActive: pathname === '/addPlatform',
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share Portfolio',
      onClick: () => setShowShareModal(true),
      isActive: false,
    },
  ];

  // Select a platform filter and jump to the dashboard top
  const handlePlatformSelect = (platformId) => {
    const newFilter = platformFilter === platformId ? 'all' : platformId;
    setPlatformFilter(newFilter);
    if (pathname === '/dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-20 bg-[#07080c]/95 backdrop-blur-2xl flex flex-col items-center py-4 z-50 border-r border-white/10 select-none overscroll-contain">
        {/* ── Brand Logo at Top ── */}
        <div className="mb-5 relative group">
          <a
            href="/dashboard"
            className="w-11 h-11 rounded-2xl flex items-center justify-center p-1 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-200 group-hover:scale-105"
          >
            <img src={assets.websiteLogo} alt="Orbito" className="w-8 h-8 rounded-xl object-contain" />
          </a>
          <SidebarTooltip label="Orbito Hub" />
        </div>

        {/* ── Primary Navigation Items ── */}
        <nav className="flex flex-col items-center space-y-3 overflow-hidden overscroll-contain">
          {primaryNavItems.map((item) => {
            const IconComponent = item.icon;
            const active = item.isActive;

            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={item.onClick}
                  className={`
                    relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden
                    ${active
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                  aria-label={item.label}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      active ? 'text-black stroke-[2.3]' : 'text-slate-300 group-hover:text-white stroke-[1.8]'
                    }`}
                  />
                </button>

                <SidebarTooltip label={item.label} />
              </div>
            );
          })}
        </nav>

        {/* ── Connected Platforms — scrollable dashboard filter ── */}
        {(loading || connectedPlatforms.length > 0) && (
          <div className="flex-1 min-h-0 w-full mt-4 flex flex-col items-center">
            <div className="w-10 border-t border-white/10 mb-2 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-3 shrink-0">
              Synced
            </span>
            <div className="flex-1 min-h-0 w-full overflow-y-auto scrollbar-none overscroll-contain flex flex-col items-center">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 animate-pulse shrink-0 mt-3" />
                  ))
                : connectedPlatforms.map((platform) => {
                    const isActive = platformFilter === platform.id;
                    return (
                      <div key={platform.id} className="relative group shrink-0 mt-3">
                        <button
                          type="button"
                          onClick={() => handlePlatformSelect(platform.id)}
                          className={`
                            relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden p-1.5
                            ${isActive
                              ? 'bg-emerald-500/20 border border-emerald-400/60 shadow-[0_0_16px_rgba(52,211,153,0.35)]'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                            }
                          `}
                          aria-label={`Filter by ${platform.name}`}
                          title={platform.name}
                        >
                          <img
                            src={platform.logo}
                            alt={platform.name}
                            className="w-full h-full object-contain"
                          />
                        </button>

                        {/* Active filter indicator dot */}
                        {isActive && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07080c] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        {/* ── Bottom Section: Profile & Settings ── */}
        <div className="mt-auto flex flex-col items-center space-y-3 pt-3">
          {/* PROFILE & SETTINGS ICON (At Very Bottom) */}
          <div
            className="relative group"
            onMouseEnter={handleMouseEnterProfile}
            onMouseLeave={handleMouseLeaveProfile}
          >
            <button
              id="profile-trigger-btn"
              type="button"
              onClick={() => setShowProfilePopup((prev) => !prev)}
              className={`
                relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer group
                ${showProfilePopup
                  ? 'p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'p-[1px] bg-white/10 hover:bg-gradient-to-tr hover:from-cyan-500/60 hover:to-indigo-500/60'
                }
              `}
              aria-label="Profile and Settings Menu"
            >
              <div className="w-full h-full rounded-[14px] bg-[#0c0d12] flex items-center justify-center overflow-hidden relative group-hover:bg-[#12141c] transition-colors p-0.5">
                <img
                  src={getDeveloperAvatar(user, platformData)}
                  alt={user?.name || 'Developer'}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>

              {/* Active session green dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07080c] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </button>

            {!showProfilePopup && (
              <SidebarTooltip label="Profile & Settings" />
            )}
          </div>
        </div>
      </div>

      {/* ── ORIGINAL BLACK PROFILE CARD UI (With Memoji Photo & 2 Options) ── */}
      {showProfilePopup && (
        <div
          onMouseEnter={handleMouseEnterProfile}
          onMouseLeave={handleMouseLeaveProfile}
          className="fixed left-24 bottom-4 z-[99999]"
        >
          <AnimatedProfileCard onClose={() => setShowProfilePopup(false)} />
        </div>
      )}

      {/* ── Share Portfolio Modal ── */}
      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};

export default Sidebar;
