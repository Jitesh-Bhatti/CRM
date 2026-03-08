import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';


export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar />

      {/* Main Content Area filling the rest of the screen */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto h-full">
          {/* Outlet is where the current page gets rendered! */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};