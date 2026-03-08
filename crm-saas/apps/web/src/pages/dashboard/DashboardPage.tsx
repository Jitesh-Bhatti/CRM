import React from 'react';
import { useClients } from '../../features/clients/hooks/useClients';
import { useProjects } from '../../features/projects/hooks/useProjects';

export const DashboardPage: React.FC = () => {
  // Fetch real data from your API
  const { data: clientsData, isLoading: loadingClients } = useClients();
  const { data: projectsData, isLoading: loadingProjects } = useProjects();

  // Calculate the metrics securely (fallback to 0 if data isn't loaded yet)
  const totalClients = clientsData?.data?.length || 0;
  const activeProjects = projectsData?.data?.filter(p => p.status === 'active').length || 0;
  
  // Since we don't have a Tasks module yet, let's show Total Projects for the presentation
  const totalProjects = projectsData?.data?.length || 0; 

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, User!</h1>
        <p className="text-gray-500 text-lg">
          This is your central CRM dashboard. From here, you will be able to manage your clients, projects, tasks, and team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Active Projects Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Active Projects</h3>
          <p className="text-5xl font-bold text-blue-600">
            {loadingProjects ? '...' : activeProjects}
          </p>
        </div>

        {/* Total Projects (Replaced Pending Tasks for the presentation) */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Total Projects</h3>
          <p className="text-5xl font-bold text-orange-500">
            {loadingProjects ? '...' : totalProjects}
          </p>
        </div>

        {/* Total Clients Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Total Clients</h3>
          <p className="text-5xl font-bold text-green-500">
            {loadingClients ? '...' : totalClients}
          </p>
        </div>
      </div>
    </div>
  );
};