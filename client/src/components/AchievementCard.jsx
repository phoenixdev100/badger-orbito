import React from 'react';
import { motion } from 'framer-motion';

const AchievementCard = ({ title, description, icon, count, color, badgeImage }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative group w-full h-full min-h-[190px] rounded-2xl bg-[#0c0d12]/90 border border-white/10 hover:border-white/25 p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between transition-colors overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500" />

      {/* Top Row: Icon + Count */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20 border border-white/10 overflow-hidden shadow-inner p-2`}>
          {badgeImage ? (
            <img
              src={badgeImage}
              alt={title}
              className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            icon
          )}
        </div>

        {count && (
          <span className="px-2.5 py-1 bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-full tracking-wide font-mono">
            {count}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="relative z-10 mt-4">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
