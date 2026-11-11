import React from 'react';
import AchievementCard from './AchievementCard';
import { Code, Star, Award, Trophy, Cpu, Activity, Sparkles } from 'lucide-react';

const PLATFORM_META = {
  leetcode:      { icon: <Code className="w-5 h-5 text-orange-400" />,     color: 'bg-orange-500' },
  codechef:      { icon: <Star className="w-5 h-5 text-purple-400" />,     color: 'bg-purple-500' },
  codestudio:    { icon: <Cpu className="w-5 h-5 text-red-400" />,        color: 'bg-red-500' },
  hackerrank:    { icon: <Award className="w-5 h-5 text-green-400" />,     color: 'bg-green-500' },
  geeksforgeeks: { icon: <Code className="w-5 h-5 text-emerald-400" />,   color: 'bg-emerald-600' },
  codeforces:    { icon: <Activity className="w-5 h-5 text-blue-400" />,   color: 'bg-blue-500' },
  atcoder:       { icon: <Trophy className="w-5 h-5 text-slate-400" />,    color: 'bg-slate-500' },
};

const defaultIcon = <Trophy className="w-5 h-5 text-slate-400" />;

const FeaturedAchievements = ({ achievements = [] }) => {
  if (achievements.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Featured Milestones</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Spotlight
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top highlights automatically aggregated from your verified accounts.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/60 p-8 text-center text-slate-400 text-sm">
          Connect and verify platforms in the sidebar to showcase your key milestones here.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Featured Milestones</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Spotlight
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Top performance metrics verified across your connected coding hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {achievements.slice(0, 4).map((achievement, i) => {
          const meta = PLATFORM_META[achievement.platform] || {
            icon: defaultIcon,
            color: 'bg-slate-500',
          };
          return (
            <AchievementCard
              key={achievement.id || i}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon || meta.icon}
              count={achievement.count}
              color={achievement.color || meta.color}
              badgeImage={achievement.badgeImage || null}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedAchievements;
