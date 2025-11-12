import React, { useState } from 'react';
import { 
  User, 
  Send, 
  MessageSquare, 
  Calendar,
  Settings,
  ChevronUp
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'messages', icon: Send, label: 'Messages' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-black flex flex-col items-center py-4 z-50 border-r border-gray-800">
      {/* Logo/Brand at top */}
      <div className="mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-800 bg-opacity-50 border border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                }
              `}
              title={item.label}
            >
              <IconComponent 
                className={`
                  w-5 h-5 transition-colors duration-300
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
            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group
            ${activeItem === 'settings' 
              ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25' 
              : 'bg-gray-800 bg-opacity-50 border border-gray-700 hover:bg-gray-700 hover:border-gray-600'
            }
          `}
          title="Settings"
        >
          <Settings 
            className={`
              w-5 h-5 transition-colors duration-300
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
