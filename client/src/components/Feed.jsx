import React from 'react';
import { Activity, Trophy } from 'lucide-react';

const Feed = () => {
  const feedItems = [
    {
      date: 'July 25, 2024',
      icon: '🎯',
      iconBg: 'bg-orange-500',
      title: 'AWS Pentool',
      description: 'Oscar Badger Wins',
      achievedDate: '11 w Jay, 2023',
      platform: '@ Pallo',
    },
    {
      date: 'July 25, 2024',
      icon: 'aws',
      iconBg: 'bg-white',
      title: 'AWS Certified Cloud',
      description: 'Oscars and braxtlerons',
      achievedDate: '11w asc, 2023',
      platform: '@ Pallo',
    },
    {
      date: 'July 25, 2024',
      icon: '🔥',
      iconBg: 'bg-red-600',
      title: "Master'er Colfer",
      description: 'Placer chart Maleverso!!',
      achievedDate: '11w o0, 2023',
      platform: '@ Pallo',
    },
    {
      date: 'July 25, 2024',
      icon: '⭐',
      iconBg: 'bg-blue-600',
      title: 'HackerRank Erplov',
      description: 'Placer tinesh hackerod',
      achievedDate: '11w, 2023',
      platform: '@ Pallo',
    },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Achievement Feed</h3>
          <span className="text-xs text-gray-500">24 Pass N</span>
        </div>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-700"></div>

          <div className="space-y-8">
            {feedItems.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 w-5 h-5 rounded-full bg-gray-700 border-2 border-[#1a1a1a] flex-shrink-0 mt-1"></div>

                <div className="flex-1 pb-4">
                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-3">{item.date}</div>

                  {/* Achievement card */}
                  <div className="bg-[#242424] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                        {item.icon === 'aws' ? (
                          <span className="text-black font-bold text-sm">aws</span>
                        ) : (
                          item.icon
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-base mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{item.achievedDate}</span>
                          <span className="text-xs text-gray-500">{item.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
