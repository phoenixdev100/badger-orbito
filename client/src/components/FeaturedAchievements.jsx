import React, { useState } from 'react';
import AchievementCard from './AchievementCard';
import { Trophy, Award, Code, Star, Plus } from 'lucide-react';

const FeaturedAchievements = ({ featuredBadgeImages = [] }) => {
  // Sample achievement data - in a real app, this would come from props or a store
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'LeetCode Master',
      description: 'Solved 100+ problems',
      icon: <Code className="w-6 h-6 text-blue-400" />,
      count: '102',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'CodeChef 4 Star',
      description: 'Rating 1800+',
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      count: '4★',
      color: 'bg-yellow-500',
    },
    {
      id: 3,
      title: 'Certified Developer',
      description: 'Full Stack Certification',
      icon: <Award className="w-6 h-6 text-purple-400" />,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Top Performer',
      description: 'Hackathon Winner',
      icon: <Trophy className="w-6 h-6 text-green-400" />,
      color: 'bg-green-500',
    },
  ]);

  const achievementsWithImages = achievements.map((achievement, index) => ({
    ...achievement,
    badgeImage: featuredBadgeImages[index] || null,
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Featured Achievements</h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievementsWithImages.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            count={achievement.count}
            color={achievement.color}
            badgeImage={achievement.badgeImage}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedAchievements;
