import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

const Graph = () => {
  const weekData = [
    { day: 'M', value: 12 },
    { day: 'T', value: 19 },
    { day: 'W', value: 15 },
    { day: 'T', value: 25 },
    { day: 'F', value: 22 },
    { day: 'S', value: 30 },
    { day: 'S', value: 28 },
  ];

  const skillData = [
    { day: 'M', value: 8 },
    { day: 'T', value: 14 },
    { day: 'W', value: 11 },
    { day: 'T', value: 18 },
    { day: 'F', value: 24 },
    { day: 'S', value: 29 },
    { day: 'S', value: 35 },
  ];

  const maxValue = 40;
  const achievements = [
    {
      icon: '☁️',
      title: 'AWS Certified Cloud',
      subtitle: 'Practitioner',
      date: 'Nov 12, 2024',
    },
    {
      icon: '🎯',
      title: 'Mongo Skill Level',
      subtitle: 'Intermediate',
      date: 'Sep 28, 2024',
    },
  ];

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Progression Tracker</h3>
          <span className="text-sm text-gray-400">14 Days W</span>
        </div>

        {/* Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* First Graph - Pink */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Weekly Progress</span>
            </div>
            <div className="relative h-32">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#pinkGradient)"
                  stroke="none"
                  points={weekData
                    .map((d, i) => {
                      const x = (i / (weekData.length - 1)) * 100;
                      const y = 100 - (d.value / maxValue) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(' ') + ` 100%,100% 0%,100%`}
                />
                <polyline
                  fill="none"
                  stroke="rgb(236, 72, 153)"
                  strokeWidth="2"
                  points={weekData
                    .map((d, i) => {
                      const x = (i / (weekData.length - 1)) * 100;
                      const y = 100 - (d.value / maxValue) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(' ')}
                />
                {weekData.map((d, i) => {
                  const x = (i / (weekData.length - 1)) * 100;
                  const y = 100 - (d.value / maxValue) * 100;
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill="rgb(236, 72, 153)"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-2">
              {weekData.map((d, i) => (
                <span key={i} className="text-xs text-gray-500">
                  {d.day}
                </span>
              ))}
            </div>
          </div>

          {/* Second Graph - Cyan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Skill Development</span>
            </div>
            <div className="relative h-32">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#cyanGradient)"
                  stroke="none"
                  points={skillData
                    .map((d, i) => {
                      const x = (i / (skillData.length - 1)) * 100;
                      const y = 100 - (d.value / maxValue) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(' ') + ` 100%,100% 0%,100%`}
                />
                <polyline
                  fill="none"
                  stroke="rgb(34, 211, 238)"
                  strokeWidth="2"
                  points={skillData
                    .map((d, i) => {
                      const x = (i / (skillData.length - 1)) * 100;
                      const y = 100 - (d.value / maxValue) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(' ')}
                />
                {skillData.map((d, i) => {
                  const x = (i / (skillData.length - 1)) * 100;
                  const y = 100 - (d.value / maxValue) * 100;
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill="rgb(34, 211, 238)"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-2">
              {skillData.map((d, i) => (
                <span key={i} className="text-xs text-gray-500">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 hover:bg-gray-800/70 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-semibold">{achievement.title}</h4>
                <p className="text-gray-400 text-xs">{achievement.subtitle}</p>
                <p className="text-gray-500 text-xs mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graph;
