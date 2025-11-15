"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  gradientColors: string;
  delay: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, gradientColors, delay }) => {
  return (
    <div className="relative w-[280px] h-[120px] rounded-[14px] flex items-center justify-between p-6
                    shadow-[10px_10px_30px_#111,-10px_-10px_30px_#222]
                    overflow-hidden">

      {/* Glassy Background */}
      <div className="absolute inset-[3px] bg-black/70 backdrop-blur-[24px]
                      rounded-[10px] outline-1 outline-gray-700 z-10"></div>

      {/* Animated Gradient Blob */}
      <div className={`absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full opacity-80
                      filter blur-[8px] z-0 animate-blob 
                      bg-gradient-to-r ${gradientColors}`}
           style={{ animationDelay: delay }}></div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-between w-full">
        {/* Icon and Text */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-white text-lg font-bold">{title}</h3>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>
        </div>
        
        {/* Value */}
        <div className="text-white text-2xl font-bold">
          {value}
        </div>
      </div>
    </div>
  );
};

const GradientBlobCard: React.FC = () => {
  const stats = [
    {
      title: 'Total Badges',
      value: '87',
      gradientColors: 'from-purple-500 via-purple-600 to-purple-700',
      delay: '0s'
    },
    {
      title: 'Top Skill',
      subtitle: 'Python',
      value: '5',
      gradientColors: 'from-yellow-500 via-orange-500 to-red-500',
      delay: '1s'
    },
    {
      title: 'Platforms',
      subtitle: 'Connected',
      value: '6',
      gradientColors: 'from-pink-500 via-rose-500 to-red-600',
      delay: '2s'
    },
    {
      title: 'Certifications',
      subtitle: 'Earned',
      value: '12',
      gradientColors: 'from-green-500 via-emerald-500 to-teal-600',
      delay: '3s'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            gradientColors={stat.gradientColors}
            delay={stat.delay}
          />
        ))}
      </div>

      {/* Inline keyframes animation */}
      <style>
        {`
          @keyframes blob {
            0% {
              transform: translate(-100%, -100%);
            }
            25% {
              transform: translate(0%, -100%);
            }
            50% {
              transform: translate(0%, 0%);
            }
            75% {
              transform: translate(-100%, 0%);
            }
            100% {
              transform: translate(-100%, -100%);
            }
          }

          .animate-blob {
            animation: blob 5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default GradientBlobCard;
