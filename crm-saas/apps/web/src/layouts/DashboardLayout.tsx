import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardLayout: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 text-xl font-bold border-b border-gray-800 tracking-wide">
          CRM SaaS
        </div>
        
     {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/" className="block py-2.5 px-4 rounded-md transition duration-200 hover:bg-gray-800 text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link to="/clients" className="block py-2.5 px-4 rounded-md transition duration-200 hover:bg-gray-800 text-gray-300 hover:text-white">
            Clients
          </Link>
          {/* Add the new Leads link here! */}
          <Link to="/leads" className="block py-2.5 px-4 rounded-md transition duration-200 hover:bg-gray-800 text-gray-300 hover:text-white">
            Leads Board
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 p-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
            {/* Future: Global Search, Notification Bell could go here */}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};