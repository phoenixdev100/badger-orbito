import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  User,
  Shield,
  Layers,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Trash2,
  Sparkles,
  ShieldCheck,
  KeyRound,
  LogOut,
  AtSign,
  Clock,
  Copy,
  Check,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';
import getDeveloperAvatar from '../utils/avatarHelper.js';

const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',      color: '#FFA116', bg: '#FFA11615', url: 'https://leetcode.com' },
  codechef:      { label: 'CodeChef',      color: '#6B3FA0', bg: '#6B3FA015', url: 'https://codechef.com' },
  codestudio:    { label: 'CodeStudio',    color: '#DD4015', bg: '#DD401515', url: 'https://naukri.com/code360' },
  hackerrank:    { label: 'HackerRank',    color: '#2EC866', bg: '#2EC86615', url: 'https://hackerrank.com' },
  geeksforgeeks: { label: 'GeeksForGeeks', color: '#2F8D46', bg: '#2F8D4615', url: 'https://geeksforgeeks.org' },
  codeforces:    { label: 'Codeforces',    color: '#1F8ACB', bg: '#1F8ACB15', url: 'https://codeforces.com' },
  atcoder:       { label: 'AtCoder',       color: '#7B7B7B', bg: '#7B7B7B15', url: 'https://atcoder.jp' },
  credly:        { label: 'Credly',        color: '#FF6B00', bg: '#FF6B0015', url: 'https://credly.com' },
  codolio:       { label: 'Codolio',       color: '#06b6d4', bg: '#06b6d415', url: 'https://codolio.com' },
};

const Settings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Settings | Orbito';
  }, []);
  const {
    user,
    setUser,
    logout,
    platformData,
    updateProfile,
    changePassword,
    updateUsername,
    updateVisibility,
    getUserPlatforms,
    updatePlatformVisibility,
    deletePlatform,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Username & Visibility state
  const [customUsername, setCustomUsername] = useState(user?.username || user?.email?.split('@')[0] || '');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  const isProfilePublic = user?.isProfilePublic !== false;

  const getCooldownInfo = () => {
    if (!user?.usernameLastChangedAt) return { canChange: true, remainingDays: 0 };
    const diffDays = (Date.now() - new Date(user.usernameLastChangedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 30) {
      return { canChange: false, remainingDays: Math.ceil(30 - diffDays) };
    }
    return { canChange: true, remainingDays: 0 };
  };

  const cooldown = getCooldownInfo();

  const handleSaveUsername = async (e) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }
    setIsSavingUsername(true);
    await updateUsername(customUsername.trim());
    setIsSavingUsername(false);
  };

  const handleToggleProfileVisibility = async () => {
    setIsTogglingVisibility(true);
    await updateVisibility(!isProfilePublic);
    setIsTogglingVisibility(false);
  };

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Platform state
  const [platforms, setPlatforms] = useState({});
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [togglingPlatform, setTogglingPlatform] = useState(null);

  // Danger Zone dialog
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch connected platforms
  const loadPlatforms = async () => {
    setLoadingPlatforms(true);
    try {
      const res = await getUserPlatforms();
      if (res?.success && res.platforms) {
        setPlatforms(res.platforms);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlatforms(false);
    }
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.bio) setBio(user.bio);
    loadPlatforms();
  }, [user]);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await updateProfile(name, bio);
      if (res?.success) {
        toast.success('Profile updated successfully!');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res?.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setIsChangingPass(false);
    }
  };

  // Handle Platform Visibility Toggle
  const handleToggleVisibility = async (platformKey, currentVisibility) => {
    setTogglingPlatform(platformKey);
    const nextVal = !currentVisibility;
    try {
      const res = await updatePlatformVisibility(platformKey, nextVal);
      if (res?.success) {
        setPlatforms((prev) => ({
          ...prev,
          [platformKey]: {
            ...prev[platformKey],
            isPublic: nextVal,
          },
        }));
      }
    } finally {
      setTogglingPlatform(null);
    }
  };

  // Copy shareable public link
  const copyProfileLink = () => {
    const url = `${window.location.origin}/dashboard`;
    navigator.clipboard.writeText(url);
    toast.success('Public profile link copied to clipboard!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Identity', icon: User },
    { id: 'platforms', label: 'Connected Platforms', icon: Layers },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="w-full bg-black min-h-screen text-white flex">
      {/* Sidebar on left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-20 w-full min-h-screen">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>Account & Developer Settings</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage your unified developer profile, platform privacy, security credentials, and alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={copyProfileLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Share Public Profile
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? tab.id === 'danger'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
                        : 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: PROFILE & IDENTITY ─────────────────────────────────── */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="flex items-start gap-4 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-white/15 overflow-hidden p-0.5 shadow-xl shrink-0">
                    <img
                      src={getDeveloperAvatar(user, platformData)}
                      alt={name || 'Developer'}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{name || 'Developer'}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Verified Orbito Account
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Managed via authentication provider</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Developer Bio & Headline
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Competitive Programmer · Full-Stack Architect · Open Source Contributor"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Custom Developer Username Card with 30-Day Cooldown ── */}
              <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <AtSign className="w-4 h-4 text-cyan-400" />
                      <span>Custom Developer Username</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Your unique Orbito handle determines your public portfolio URL: <span className="font-mono text-cyan-400">{window.location.origin}/u/{user?.username || customUsername}</span>
                    </p>
                  </div>

                  <a
                    href={`/u/${user?.username || customUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shrink-0 self-start"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 30-Day Policy Alert Box */}
                <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3 ${
                  !cooldown.canChange
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                }`}>
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="text-xs leading-relaxed">
                    {!cooldown.canChange ? (
                      <p>
                        <strong className="font-semibold">30-Day Cooldown Active:</strong> You can only change your username once every 30 days. You can change it again in <strong className="underline">{cooldown.remainingDays} days</strong> (last changed on {new Date(user.usernameLastChangedAt).toLocaleDateString()}).
                      </p>
                    ) : (
                      <p>
                        <strong className="font-semibold">Important Rule:</strong> You can only change your username once every 30 days. It must be unique across all developers on Orbito.
                      </p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveUsername} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Unique Handle
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-sm">@</span>
                      <input
                        type="text"
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                        disabled={!cooldown.canChange || isSavingUsername}
                        placeholder="e.g. deepak_codes"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border text-sm text-white focus:outline-none transition-colors font-mono ${
                          !cooldown.canChange ? 'border-white/10 opacity-60 cursor-not-allowed' : 'border-white/15 focus:border-cyan-400'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Allowed: letters, numbers, underscores, and hyphens (3-30 characters).
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!cooldown.canChange || isSavingUsername || customUsername === user?.username}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-semibold text-xs sm:text-sm hover:bg-cyan-300 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingUsername ? 'Verifying & Saving...' : !cooldown.canChange ? 'Cooldown Active' : 'Update Username'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Public / Private Profile Visibility ── */}
              <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${
                      isProfilePublic
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    }`}>
                      {isProfilePublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isProfilePublic ? 'Public Profile is Active' : 'Profile is currently Private'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isProfilePublic
                          ? 'Anyone opening your link (/u/' + (user?.username || customUsername || 'handle') + ') can see your verified telemetry and badges.'
                          : 'Anyone visiting your public link will see a locked screen stating this profile is private.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleProfileVisibility}
                    disabled={isTogglingVisibility}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                      isProfilePublic
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    {isTogglingVisibility ? 'Updating...' : isProfilePublic ? 'Switch to Private' : 'Make Public'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 2: CONNECTED PLATFORMS & VISIBILITY ───────────────────── */}
          {activeTab === 'platforms' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <span>Connected Coding Ecosystems</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Toggle public visibility on your developer portfolio and manage platform handles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/addPlatform')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Connect New Platform
                  </button>
                </div>

                {loadingPlatforms ? (
                  <div className="py-12 flex justify-center text-slate-400 text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading platform configurations...
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {Object.keys(platforms).length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-sm border border-dashed border-white/10 rounded-2xl">
                        No external platforms connected yet. Click "Connect New Platform" above.
                      </div>
                    ) : (
                      Object.entries(platforms).map(([platformKey, data]) => {
                        const meta = PLATFORM_META[platformKey] || { label: platformKey, color: '#06b6d4', url: '#' };
                        const isPublic = data.isPublic !== false;
                        const isToggling = togglingPlatform === platformKey;

                        return (
                          <div
                            key={platformKey}
                            className="rounded-xl bg-black/60 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: meta.color }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white">{meta.label}</h4>
                                  {data.verified ? (
                                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-md border border-emerald-500/20">
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded-md border border-amber-500/20">
                                      Unverified
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  @{data.username || 'Not set'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleToggleVisibility(platformKey, isPublic)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                  isPublic
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>{isPublic ? 'Public Profile' : 'Hidden'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => navigate('/addPlatform')}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Reconfigure Platform"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TAB 3: SECURITY & PASSWORD ─────────────────────────────────── */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="pb-6 border-b border-white/10 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-indigo-400" />
                    <span>Password & Authentication</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your secret access credentials and account protection.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isChangingPass ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── TAB 4: DANGER ZONE ────────────────────────────────────────── */}
          {activeTab === 'danger' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>Danger Zone</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Irreversible actions affecting your Orbito developer profile and authentication credentials.
                  </p>
                </div>

                <div className="divide-y divide-rose-500/10">
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Sign Out All Sessions</p>
                      <p className="text-xs text-slate-400">Clear stored tokens and log out of all active devices immediately.</p>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-rose-300">Delete Account & Aggregated Data</p>
                      <p className="text-xs text-slate-400">Permanently delete your user account, linked platform keys, and cache.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#0c0d12] border border-rose-500/40 p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center gap-2.5 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Delete Account Permanently</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This action is irreversible. All your connected platforms, cached verification badges, and personal records will be completely deleted.
              </p>
              <p className="text-xs text-slate-400">
                Type <span className="font-mono font-bold text-white">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2 rounded-xl bg-black border border-rose-500/30 text-sm text-white focus:outline-none focus:border-rose-400"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== 'DELETE'}
                  onClick={() => {
                    localStorage.clear();
                    toast.success('Account reset successfully');
                    navigate('/');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  Confirm Deletion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;

