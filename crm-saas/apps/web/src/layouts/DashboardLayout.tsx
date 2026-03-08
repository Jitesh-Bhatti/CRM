import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardLayout: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Overview', path: '/', icon: '📊' },
    { name: 'Clients', path: '/clients', icon: '🏢' },
    { name: 'Leads', path: '/leads', icon: '🎯' },
  ];

  return (
    <div className="flex bg-[#f8fafc] h-screen font-sans overflow-hidden text-gray-900">

      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar - Premium Dark Theme (Matching RegisterPage) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 lg:static transform transition-all duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(15,23,42,0.15)] relative overflow-hidden
          ${isSidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0 lg:w-[84px]'}`}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1d4ed8 100%)',
        }}
      >
        {/* Subtle Background Effects mimicking RegisterPage */}
        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-white/5 pointer-events-none blur-2xl"></div>

        {/* Brand Header */}
        <div className={`h-[72px] flex items-center border-b border-white/10 transition-all duration-300 relative z-10 ${isSidebarOpen ? 'px-6 justify-between' : 'justify-center px-0'}`}>
          <div className="flex items-center gap-3 overflow-hidden ml-1">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] flex items-center justify-center text-[18px] shadow-[0_4px_12px_rgba(96,165,250,0.3)] shrink-0">
              <span className="text-white relative top-[1px]">⚡</span>
            </div>
            <div className={`flex items-center overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100 w-24' : 'opacity-0 w-0'}`}>
              <span className="text-[20px] font-bold tracking-tight text-white">
                CRM<span className="text-[#60a5fa] font-medium tracking-normal">Pro</span>
              </span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden p-1.5 text-blue-200 hover:text-white transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>✕</button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto relative z-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path ||
              (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center h-12 rounded-xl transition-all duration-200 group
                  ${!isSidebarOpen ? 'justify-center w-12 mx-auto' : 'px-3 gap-3.5 w-full'}
                  ${isActive
                    ? 'bg-white/10 text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10'
                    : 'text-[#94a3b8] hover:bg-white/5 hover:text-white border border-transparent'}
                `}
              >
                <div className="flex items-center justify-center w-6 shrink-0">
                  <span className={`text-[20px] transition-transform duration-200 ${isActive ? 'scale-110 grayscale-0' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}`}>
                    {link.icon}
                  </span>
                </div>

                <span className={`text-[15px] whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                  {link.name}
                </span>

                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#0f172a] border border-white/10 text-[#f8fafc] text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-[#0f172a] border-l border-b border-white/10 rotate-45"></div>
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm flex flex-col gap-2 transition-all duration-300 relative z-10 ${!isSidebarOpen ? 'items-center px-2' : ''}`}>
          <div className={`flex items-center gap-3 py-2 rounded-xl transition-all duration-300 ${!isSidebarOpen ? 'justify-center w-full px-0' : 'px-3 hover:bg-white/5 border border-transparent hover:border-white/5 cursor-pointer'}`}>
            <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-[#60a5fa] to-[#3b82f6] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-300 whitespace-nowrap ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
              <p className="text-[14px] font-semibold truncate text-[#f8fafc]">{user?.name || 'User'}</p>
              <p className="text-[12px] text-[#94a3b8] truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`relative flex items-center h-10 rounded-xl text-sm font-medium text-[#94a3b8] hover:text-[#fca5a5] hover:bg-red-500/10 transition-colors group
              ${!isSidebarOpen ? 'justify-center w-12 mx-auto' : 'px-3 gap-3.5 w-full'}`}
          >
            <div className="flex items-center justify-center w-6 shrink-0">
              <span className="text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">🚪</span>
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
              Sign Out
            </span>

            {/* Tooltip for collapsed state */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#0f172a] border border-white/10 text-[#f8fafc] text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-[#0f172a] border-l border-b border-white/10 rotate-45"></div>
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Top Header - Glassmorphism */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="h-[72px] px-6 flex items-center justify-between max-w-[1600px] mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">Workspace</span>
                <span className="text-slate-300 mx-0.5">/</span>
                <span className="text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">{location.pathname === '/' ? 'Overview' : location.pathname.substring(1).split('/')[0].charAt(0).toUpperCase() + location.pathname.substring(1).split('/')[0].slice(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-[13px] font-medium text-slate-500 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span className="mr-8">Quick search...</span>
                <kbd className="font-sans bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 border border-slate-200 text-[11px] font-semibold">⌘ K</kbd>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-5 sm:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};