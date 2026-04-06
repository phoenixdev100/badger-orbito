import React from 'react';
import AchievementCard from './AchievementCard';
import { Code, Star, Award, Trophy, Cpu, Activity } from 'lucide-react';

// Map platform names to icons & colors
const PLATFORM_META = {
  leetcode:     { icon: <Code className="w-6 h-6 text-orange-400" />,  color: 'bg-orange-500' },
  codechef:     { icon: <Star className="w-6 h-6 text-purple-400" />,  color: 'bg-purple-500' },
  codestudio:   { icon: <Cpu  className="w-6 h-6 text-red-400" />,     color: 'bg-red-500'    },
  hackerrank:   { icon: <Award className="w-6 h-6 text-green-400" />,  color: 'bg-green-500'  },
  geeksforgeeks:{ icon: <Code className="w-6 h-6 text-green-400" />,   color: 'bg-green-600'  },
  codeforces:   { icon: <Activity className="w-6 h-6 text-blue-400" />,color: 'bg-blue-500'   },
  atcoder:      { icon: <Trophy className="w-6 h-6 text-gray-400" />,  color: 'bg-gray-500'   },
};

const defaultIcon = <Trophy className="w-6 h-6 text-slate-400" />;

const FeaturedAchievements = ({ achievements = [] }) => {
  // If no achievements passed, show empty state
  if (achievements.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Featured Achievements</h2>
        </div>
        <div className="text-slate-500 text-sm">
          Connect and verify your platforms to see featured achievements here.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Featured Achievements</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
