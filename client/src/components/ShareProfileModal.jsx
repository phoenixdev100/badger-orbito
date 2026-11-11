import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Share2,
  Globe,
  Lock,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const ShareProfileModal = ({ isOpen, onClose }) => {
  const { user, updateVisibility } = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const username = user?.username || user?.email?.split('@')[0] || 'developer';
  const publicUrl = `${window.location.origin}/u/${username}`;
  const isPublic = user?.isProfilePublic !== false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Public portfolio link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleToggleVisibility = async () => {
    setIsUpdating(true);
    await updateVisibility(!isPublic);
    setIsUpdating(false);
  };

  const shareText = `Check out my verified developer portfolio & competitive programming telemetry on Orbito: ${publicUrl}`;

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out my verified developer telemetry & honors on Orbito 🚀`
    )}&url=${encodeURIComponent(publicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name || 'Developer'} - Orbito Portfolio`,
          text: `Check out my verified developer telemetry and coding achievements on Orbito.`,
          url: publicUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-[#0c0d12] border border-white/15 p-6 sm:p-7 shadow-2xl text-white overflow-hidden"
        >
          {/* Ambient glow accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Share Public Portfolio</h3>
              <p className="text-xs text-slate-400">
                Share your verified developer telemetry and honors with recruiters & peers.
              </p>
            </div>
          </div>

          {/* Visibility Toggle Card */}
          <div className="mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isPublic
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}
              >
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {isPublic ? 'Public Profile' : 'Private Profile'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {isPublic
                    ? 'Anyone with your link can view your verified telemetry.'
                    : 'Your link displays a locked private profile notice.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleVisibility}
              disabled={isUpdating}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                isPublic
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15'
              }`}
            >
              {isUpdating ? 'Updating...' : isPublic ? 'Make Private' : 'Make Public'}
            </button>
          </div>

          {/* Public Link Box */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your Unique Portfolio Link
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/15">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-cyan-300 outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-white text-black hover:bg-slate-200 shadow-md'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Share Via Quick Channels */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Share Via
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={shareTwitter}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>X / Twitter</span>
              </button>

              <button
                type="button"
                onClick={shareLinkedIn}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={shareWhatsApp}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Footer Preview Link */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <span>Preview live public portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>More Options</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareProfileModal;

