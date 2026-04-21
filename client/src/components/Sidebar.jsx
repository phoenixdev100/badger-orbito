import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import assets from '../assets/assets.js';
import AnimatedProfileCard from './info-card';

import {
  Home,
  User,
  Plus,
  MessageSquare,
  Calendar,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('profile');
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileCard, setShowProfileCard] = useState(false);

  // Platform data with their display names and logos
  const platformData = {
    leetcode: { name: 'LeetCode', logo: assets.leetcodeImage },
    codechef: { name: 'CodeChef', logo: assets.codechefImage },
    credly: { name: 'Credly', logo: assets.credlyImage },
    codestudio: { name: 'CodeStudio', logo: assets.codestudioImage },
    codolio: { name: 'Codolio', logo: assets.codolioImage },
  };

  // Fetch user's connected platforms
  useEffect(() => {
    const fetchUserPlatforms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/platforms/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.success && response.data.platforms) {
          const connected = [];
          for (const [platform, data] of Object.entries(response.data.platforms)) {
            if (data.verified && platformData[platform]) {
              connected.push({
                id: platform,
                name: platformData[platform].name,
                logo: platformData[platform].logo,
                username: data.username
              });
            }
          }
          setConnectedPlatforms(connected);
        }
      } catch (error) {
        console.error('Error fetching user platforms:', error);
        toast.error('Failed to load connected platforms');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlatforms();
  }, []);

  const menuItems = [
    { id: 'addPlatform', icon: Plus, label: 'Add Platform' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-black flex flex-col items-center py-4 z-50 border-r border-gray-800">
      {/* Logo/Brand at top */}
      <div className="mb-4">
        <a href='/'><img src={assets.websiteLogo} alt="Logo" className="w-10 h-10 rounded-2xl" /></a>
      </div>

      {/* Home Button below logo */}
      <div className="mb-6">
        <button
          onClick={() => {
            setActiveItem('dashboard');
            navigate('/dashboard');
          }}
          className={`
            relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden
            bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/60 hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]
          `}
          title="Home"
        >
          <Home className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
          <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Home
          </div>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {/* Connected Platforms */}
        {!loading && connectedPlatforms.length > 0 && (
          <div className="w-full px-2 mb-4">
            <div className="space-y-2">
              {connectedPlatforms.map((platform) => (
                <div key={platform.id} className="relative">
                  <button
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      transition-all duration-300 overflow-hidden
                      bg-gray-800/30 border border-gray-700/50
                      hover:bg-gray-700/40 hover:border-gray-600/60
                      hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]
                    `}
                  >
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id)
                navigate(`/${item.id}`)
              }}
              className={`
                relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden
                ${isActive
                  ? 'shadow-[8px_8px_20px_#111,-8px_-8px_20px_#222] border border-gray-600/50'
                  : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/60 hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]'
                }
              `}
              title={item.label}
            >
              {/* Glass morphism background for active state */}
              {isActive && (
                <div className="absolute inset-[2px] bg-black/60 backdrop-blur-[12px] rounded-[14px] border border-gray-600/30"></div>
              )}
              <IconComponent
                className={`
                  relative z-10 w-5 h-5 transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                `}
              />

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Profile at bottom */}
      <div className="mt-auto mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveItem('profile');
            setShowProfileCard((prev) => !prev);
          }}
          className={`
            relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden
            ${activeItem === 'profile'
              ? 'shadow-[8px_8px_20px_#111,-8px_-8px_20px_#222] border border-gray-600/50'
              : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/60 hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]'
            }
          `}
          title="Profile"
        >
          {activeItem === 'profile' && (
            <div className="absolute inset-[2px] bg-black/60 backdrop-blur-[12px] rounded-[14px] border border-gray-600/30"></div>
          )}
          <User
            className={`
              relative z-10 w-5 h-5 transition-colors duration-300
              ${activeItem === 'profile' ? 'text-white' : 'text-gray-300 group-hover:text-white'}
            `}
          />
          <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Profile
          </div>
        </button>
      </div>

      {/* Bottom-left profile dialog */}
      {showProfileCard && (
        <div
          className="fixed left-24 bottom-4 z-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileCard(false);
            }
          }}
        >
          <AnimatedProfileCard onClose={() => setShowProfileCard(false)} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
