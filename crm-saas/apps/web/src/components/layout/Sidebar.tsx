import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../config/navigation';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col h-full shadow-xl">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-wide border-b border-gray-800">
        CRM SaaS
      </div>

      {/* Dynamic Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          // Check if exactly active, or if a child route is active (like /clients/123)
          const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gray-800 text-blue-500' // Matches your screenshot's active state
                  : 'text-blue-500/70 hover:bg-gray-800/50 hover:text-blue-400'
              }`}
            >
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer (Matching your screenshot) */}
      <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
        <div className="flex items-center mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            J
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-400 truncate">john@acmecorp.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 bg-black/20 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors border border-gray-800"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};