import React from 'react';
import { Trophy, TrendingUp, Link2, Calendar, Award } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Trophy,
      label: 'Total Badges',
      value: '87',
      secondaryValue: '87',
      gradient: 'from-purple-500 to-purple-700',
      borderGradient: 'border-purple-500',
    },
    {
      icon: TrendingUp,
      label: 'Top Skill',
      subtitle: 'Python',
      value: '5',
      gradient: 'from-yellow-500 to-orange-500',
      borderGradient: 'border-yellow-500',
    },
    {
      icon: Link2,
      label: 'Platforms',
      subtitle: 'Connected',
      value: '6',
      gradient: 'from-pink-500 to-rose-600',
      borderGradient: 'border-pink-500',
    },
    {
      icon: Calendar,
      label: 'Badges This',
      subtitle: 'Bus Month',
      value: '5',
      gradient: 'from-cyan-500 to-blue-600',
      borderGradient: 'border-cyan-500',
    },
    {
      icon: Award,
      label: 'Certifications',
      subtitle: 'Earned',
      value: '12',
      gradient: 'from-green-500 to-emerald-600',
      borderGradient: 'border-green-500',
    },
  ];

  return (
    <div className="mb-8">
      
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`relative rounded-full border-2 ${stat.borderGradient} bg-black/40 backdrop-blur-sm px-6 py-3 hover:scale-105 transition-transform duration-300 flex items-center gap-4 min-w-[220px]`}
            >
              {/* Icon with gradient background */}
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              {/* Label and subtitle */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">{stat.label}</p>
                {stat.subtitle && (
                  <p className="text-gray-400 text-xs leading-tight">{stat.subtitle}</p>
                )}
              </div>
              
              {/* Value */}
              <div className="text-gray-400 text-lg font-bold flex-shrink-0">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
