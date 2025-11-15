import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets.js';

import { 
  User, 
  Plus, 
  MessageSquare, 
  Calendar,
  Settings,
} from 'lucide-react';

const Sidebar = () => {

  const navigate = useNavigate();


  const [activeItem, setActiveItem] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'addPlatform', icon: Plus, label: 'Add Platform' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-black flex flex-col items-center py-4 z-50 border-r border-gray-800">
      {/* Logo/Brand at top */}
      <div className="mb-6">
        <a href='/dashboard'><img src={assets.websiteLogo} alt="Logo" className="w-10 h-10 rounded-2xl" /></a>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() =>{
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

      {/* Settings at bottom */}
      <div className="mt-auto mb-4">
        <button
          onClick={() => setActiveItem('settings')}
          className={`
            relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden
            ${activeItem === 'settings' 
              ? 'shadow-[8px_8px_20px_#111,-8px_-8px_20px_#222] border border-gray-600/50' 
              : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/60 hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]'
            }
          `}
          title="Settings"
        >
          {/* Glass morphism background for active state */}
          {activeItem === 'settings' && (
            <div className="absolute inset-[2px] bg-black/60 backdrop-blur-[12px] rounded-[14px] border border-gray-600/30"></div>
          )}
          <Settings 
            className={`
              relative z-10 w-5 h-5 transition-colors duration-300
              ${activeItem === 'settings' ? 'text-white' : 'text-gray-300 group-hover:text-white'}
            `} 
          />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Settings
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
