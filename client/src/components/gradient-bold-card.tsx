"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Code2, Flame, Layers, ShieldCheck, Sparkles, Trophy } from "lucide-react";

interface BentoStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  tag?: string;
  loading?: boolean;
}

const BentoStatCard: React.FC<BentoStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  accentColor,
  tag,
  loading,
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
    className="relative group rounded-2xl bg-[#0c0d12]/90 border border-white/10 hover:border-white/20 p-5 md:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
  >
    {/* Subtle ambient hover glow */}
    <div
      className={`pointer-events-none absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
    />

    {/* Top Row: Icon + Tag */}
    <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
      >
        {icon}
      </div>

      {tag && (
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border border-white/10"
          style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
        >
          {tag}
        </span>
      )}
    </div>

    {/* Content */}
    <div className="relative z-10">
      <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
        {title}
      </p>

      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
        {loading ? (
          <span className="inline-block w-20 h-8 bg-white/10 rounded animate-pulse" />
        ) : (
          value ?? 0
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
        {subtitle}
      </p>
    </div>
  </motion.div>
);

interface GradientBlobCardProps {
  totalBadges?: number;
  topSkill?: string | null;
  topSkillStars?: number | null;
  connectedPlatforms?: number;
  totalCertificates?: number;
  totalQuestions?: number;
  totalActiveDays?: number;
  loading?: boolean;
}

const GradientBlobCard: React.FC<GradientBlobCardProps> = ({
  totalBadges = 0,
  topSkill,
  topSkillStars,
  connectedPlatforms = 0,
  totalCertificates = 0,
  totalQuestions = 0,
  totalActiveDays = 0,
  loading = false,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Problems Solved */}
        <BentoStatCard
          title="Problems Solved"
          value={totalQuestions.toLocaleString()}
          subtitle="Across coding platforms"
          icon={<Code2 className="w-5 h-5" />}
          gradient="from-cyan-500 to-blue-600"
          accentColor="#06b6d4"
          tag="Global"
          loading={loading}
        />

        {/* Card 2: Total Badges */}
        <BentoStatCard
          title="Verified Badges"
          value={totalBadges}
          subtitle={
            topSkill
              ? `Top: ${topSkill} ${topSkillStars != null ? `(${topSkillStars}★)` : ""}`
              : "Coding badges & honors"
          }
          icon={<Trophy className="w-5 h-5" />}
          gradient="from-amber-500 to-orange-600"
          accentColor="#f59e0b"
          tag={topSkill ? "Skill Verified" : "Awards"}
          loading={loading}
        />

        {/* Card 3: Certifications */}
        <BentoStatCard
          title="Certifications"
          value={totalCertificates}
          subtitle={`${connectedPlatforms} verified ${connectedPlatforms === 1 ? "platform" : "platforms"}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          gradient="from-emerald-500 to-teal-600"
          accentColor="#10b981"
          tag="Verified"
          loading={loading}
        />

        {/* Card 4: Coding Momentum */}
        <BentoStatCard
          title="Active Momentum"
          value={totalActiveDays > 0 ? `${totalActiveDays} days` : "Active"}
          subtitle="Consistent problem solver"
          icon={<Flame className="w-5 h-5" />}
          gradient="from-fuchsia-500 to-indigo-600"
          accentColor="#d946ef"
          tag="Streak"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default GradientBlobCard;
