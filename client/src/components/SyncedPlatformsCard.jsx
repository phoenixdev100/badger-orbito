import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, Plus, ExternalLink, Settings, LayoutGrid, Check } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const getPlatformExternalUrl = (platformId, username) => {
  if (!username) return '#';
  switch (platformId) {
    case 'leetcode':
      return `https://leetcode.com/u/${username}`;
    case 'codechef':
      return `https://www.codechef.com/users/${username}`;
    case 'codestudio':
      return `https://www.naukri.com/code360/profile/${username}`;
    case 'credly':
      return `https://www.credly.com/users/${username}`;
    case 'codolio':
      return `https://codolio.com/profile/${username}`;
    case 'hackerrank':
      return `https://www.hackerrank.com/profile/${username}`;
    default:
      return '#';
  }
};

export default function SyncedPlatformsCard({ connectedPlatforms = [], onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { platformFilter, setPlatformFilter } = useContext(AppContext);

  // Apply a platform filter and jump to the dashboard Trophy Room
  const applyFilter = (platformId) => {
    setPlatformFilter(platformId);
    onClose?.();
    if (pathname === '/dashboard') {
      document.getElementById('trophy-room')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard#trophy-room');
    }
  };

  // Handle click outside to close the card
  useEffect(() => {
    const handleClickOutside = (event) => {
      const card = document.getElementById('synced-platforms-card');
      const trigger = document.getElementById('synced-trigger-btn');
      if (card && !card.contains(event.target) && !trigger?.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      id="synced-platforms-card"
      className="group relative overflow-hidden rounded-3xl bg-black border border-gray-800 p-6 w-80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(0,0,0,0.9)] select-none text-white animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Status indicator with pulse animation */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
        <div className="relative">
          <div className="h-3 w-3 rounded-full border-2 border-white/60 bg-green-500 group-hover:scale-125 transition-all duration-300"></div>
          <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-30"></div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
          {connectedPlatforms.length} Active
        </span>
      </div>

      {/* Central Emblem matching the Profile photo format */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-black p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(16,185,129,0.3)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(16,185,129,0.5)] group-hover:scale-110 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Title & Info */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-emerald-400">
          Synced Platforms
        </h3>
        <p className="mt-0.5 text-xs text-gray-400 font-mono">
          {connectedPlatforms.length} {connectedPlatforms.length === 1 ? 'Ecosystem' : 'Ecosystems'} Connected
        </p>
      </div>

      {/* Platforms List */}
      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-0.5 relative z-10">
        {/* All Platforms (reset filter) */}
        <button
          type="button"
          onClick={() => {
            setPlatformFilter('all');
            onClose?.();
            if (pathname === '/dashboard') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/dashboard');
            }
          }}
          className={`w-full flex items-center justify-between p-2 rounded-2xl border transition-all cursor-pointer ${
            platformFilter === 'all'
              ? 'bg-emerald-500/15 border-emerald-500/50'
              : 'bg-gray-900/60 border-gray-800/80 hover:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-black/80 border border-gray-800 flex items-center justify-center p-1 shrink-0">
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate">All Platforms</p>
              <p className="text-[10px] text-gray-400 font-mono truncate">Show everything</p>
            </div>
          </div>
          {platformFilter === 'all' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
        </button>

        {connectedPlatforms.length > 0 ? (
          connectedPlatforms.map((platform) => {
            const extUrl = getPlatformExternalUrl(platform.id, platform.username);
            const isActive = platformFilter === platform.id;
            return (
              <div
                key={platform.id}
                role="button"
                tabIndex={0}
                onClick={() => applyFilter(platform.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') applyFilter(platform.id); }}
                title={`Filter dashboard by ${platform.name}`}
                className={`w-full flex items-center justify-between p-2 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-500/50'
                    : 'bg-gray-900/60 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-black/80 border border-gray-800 flex items-center justify-center p-1 shrink-0">
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{platform.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono truncate">
                      {platform.username ? `@${platform.username}` : 'Verified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  <a
                    href={extUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                    title={`Open ${platform.name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-xs text-gray-500">
            No platforms connected yet.
          </div>
        )}
      </div>

      {connectedPlatforms.length > 0 && (
        <p className="mt-3 text-[10px] text-gray-500 text-center relative z-10">
          Click a platform to filter your dashboard
        </p>
      )}

      {/* Action Buttons: Add Platform & Manage */}
      <div className="mt-6 flex gap-3 relative z-10">
        <button
          type="button"
          onClick={() => {
            onClose?.();
            navigate('/addPlatform');
          }}
          className="flex-1 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 border border-gray-600/80 py-3 text-sm font-medium text-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 hover:from-gray-800 hover:to-gray-600 hover:border-gray-400 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose?.();
            navigate('/settings');
          }}
          className="flex-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-500/80 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-200 hover:from-emerald-500 hover:to-teal-400 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Manage</span>
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-emerald-500/40 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}

