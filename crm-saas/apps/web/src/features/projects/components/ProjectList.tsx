import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useDeleteProject } from '../hooks/useDeleteProject';

export const ProjectList: React.FC = () => {
  const { data, isLoading, isError, error } = useProjects();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  if (isLoading) return <div className="p-4 text-gray-500">Loading projects...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {error?.message}</div>;

  const projects = data?.data || [];

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-500">No projects found. Start by creating one!</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Planning</span>;
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>;
      case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Completed</span>;
      case 'on_hold': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">On Hold</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.project_type || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(project.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.budget ? `$${Number(project.budget).toLocaleString()}` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                  Manage
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete project "${project.name}"?`)) deleteProject(project.id);
                  }}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-900 disabled:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};