"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  gradientColors: string;
  delay: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  gradientColors,
  delay,
  loading,
}) => (
  <div
    className="relative flex-1 min-w-[160px] h-[110px] rounded-[14px] flex items-center justify-between px-5 py-4
               shadow-[8px_8px_24px_#111,-8px_-8px_24px_#222] overflow-hidden shrink-0"
  >
    {/* Glassy background */}
    <div className="absolute inset-[3px] bg-black/70 backdrop-blur-[24px] rounded-[10px] outline-1 outline-gray-700 z-10" />

    {/* Animated gradient blob */}
    <div
      className={`absolute top-1/2 left-1/2 w-[80px] h-[80px] rounded-full opacity-80
                  filter blur-[8px] z-0 animate-blob bg-gradient-to-r ${gradientColors}`}
      style={{ animationDelay: delay }}
    />

    {/* Content */}
    <div className="relative z-20 flex items-center justify-between w-full gap-2">
      <div className="min-w-0">
        <h3 className="text-white text-sm font-bold leading-tight truncate">{title}</h3>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5 truncate">{subtitle}</p>}
      </div>
      <div className="text-white text-xl font-bold shrink-0">
        {loading ? (
          <span className="inline-block w-8 h-5 bg-white/10 rounded animate-pulse" />
        ) : (
          value ?? "—"
        )}
      </div>
    </div>
  </div>
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
  totalBadges,
  topSkill,
  topSkillStars,
  connectedPlatforms,
  totalCertificates,
  totalQuestions,
  totalActiveDays,
  loading = false,
}) => {
  const stats = [
    {
      title: "Total Badges",
      value: totalBadges ?? 0,
      gradientColors: "from-purple-500 via-purple-600 to-purple-700",
      delay: "0s",
    },
    {
      title: "Top Skill",
      subtitle: topSkill || "—",
      value: topSkillStars != null ? `${topSkillStars}★` : topSkill ? "✓" : "—",
      gradientColors: "from-yellow-500 via-orange-500 to-red-500",
      delay: "0.4s",
    },
    {
      title: "Platforms",
      subtitle: "Connected",
      value: connectedPlatforms ?? 0,
      gradientColors: "from-pink-500 via-rose-500 to-red-600",
      delay: "0.8s",
    },
    {
      title: "Certifications",
      subtitle: "Earned",
      value: totalCertificates ?? 0,
      gradientColors: "from-green-500 via-emerald-500 to-teal-600",
      delay: "1.2s",
    },
    {
      title: "Total Questions",
      subtitle: "Solved",
      value: totalQuestions ?? 0,
      gradientColors: "from-blue-500 via-cyan-500 to-sky-600",
      delay: "1.6s",
    },
    {
      title: "Active Days",
      subtitle: "All time",
      value: totalActiveDays ?? 0,
      gradientColors: "from-indigo-500 via-violet-500 to-purple-600",
      delay: "2s",
    },
  ];

  return (
    <div className="mb-8">
      {/* Single scrollable row — all 6 cards always in one line */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-none">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            gradientColors={stat.gradientColors}
            delay={stat.delay}
            loading={loading}
          />
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%   { transform: translate(-100%, -100%); }
          25%  { transform: translate(0%,   -100%); }
          50%  { transform: translate(0%,    0%);   }
          75%  { transform: translate(-100%, 0%);   }
          100% { transform: translate(-100%, -100%);}
        }
        .animate-blob { animation: blob 5s linear infinite; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default GradientBlobCard;
