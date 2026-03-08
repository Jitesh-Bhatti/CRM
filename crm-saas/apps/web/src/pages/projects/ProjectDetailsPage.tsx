import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../../features/projects/hooks/useProject';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProject(id!);

  if (isLoading) return <div className="p-8 text-gray-500 text-lg">Loading project details...</div>;
  if (isError || !data?.data) return <div className="p-8 text-red-500 text-lg">Project not found.</div>;

  const project = data.data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link to="/projects" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Projects</Link>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">{project.name}</h1>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full tracking-wider">
          {project.status}
        </span>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Project Overview</h3>
          <p className="mb-2"><span className="font-semibold text-gray-600">Type:</span> {project.project_type || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold text-gray-600">Budget:</span> ${Number(project.budget || 0).toLocaleString()}</p>
          <div className="mt-4">
            <span className="font-semibold text-gray-600 block mb-1">Description:</span>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{project.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Project Members</h3>
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Team assignment module coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};