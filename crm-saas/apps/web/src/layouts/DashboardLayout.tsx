import React from 'react';
import { Outlet } from 'react-router-dom';
// 1. FORCE EXACT MATCH WITH CAPITAL B
import { Sidebar } from './SideBar'; 

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar />

      {/* Main Content Area filling the rest of the screen */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};