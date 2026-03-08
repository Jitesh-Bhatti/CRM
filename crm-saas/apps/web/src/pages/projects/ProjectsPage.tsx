import React, { useState } from 'react';
import { ProjectList } from '../../features/projects/components/ProjectList';
import { CreateProjectForm } from '../../features/projects/components/CreateProjectForm';

export const ProjectsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Track and manage deliverables for your clients.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm"
        >
          {showForm ? 'Close Form' : '+ New Project'}
        </button>
      </div>

      {/* Conditionally Render the Form */}
      {showForm && (
        <div className="transition-all">
          <CreateProjectForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* The Main Project Table */}
      <div className="mt-2">
        <ProjectList />
      </div>
    </div>
  );
};