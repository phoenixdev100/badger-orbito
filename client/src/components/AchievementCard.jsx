import React from 'react';

const AchievementCard = ({ title, description, icon, count, color, badgeImage }) => {
  return (
    <div className="relative group w-full h-full min-h-[180px] rounded-xl overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Card content */}
      <div className="relative h-full bg-black border border-gray-800 rounded-xl p-6 flex flex-col shadow-lg">
        {/* Top section with icon and count */}
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} bg-opacity-20 backdrop-blur-sm overflow-hidden`}>
            {badgeImage ? (
              <img
                src={badgeImage}
                alt={title}
                className="w-full h-full object-contain"
              />
            ) : (
              icon
            )}
          </div>
          {count && (
            <div className="px-2 py-1 bg-black/50 text-xs font-medium text-gray-300 rounded-md">
              {count}
            </div>
          )}
        </div>
        
        {/* Title and description */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        
        {/* Glowing border elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-transparent via-purple-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-transparent via-purple-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
