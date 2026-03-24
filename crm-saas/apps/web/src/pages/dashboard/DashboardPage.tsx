import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const DashboardPage: React.FC = () => {
  // Grab the logged-in user's data from our global state
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome back, {user?.name || 'User'}!
      </h2>
      <p className="text-gray-600 mb-8">
        This is your central CRM dashboard. From here, you will be able to manage your clients, projects, tasks, and team.
      </p>
      
      {/* Placeholder Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 border border-gray-100 rounded-lg bg-gray-50 flex flex-col justify-center">
          <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wider">Active Projects</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        
        <div className="p-5 border border-gray-100 rounded-lg bg-gray-50 flex flex-col justify-center">
          <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wider">Pending Tasks</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
        </div>
        
        <div className="p-5 border border-gray-100 rounded-lg bg-gray-50 flex flex-col justify-center">
          <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wider">Total Clients</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
};