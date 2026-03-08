import React, { useState } from 'react';
import { useCreateProject } from '../hooks/useCreateProject';
import { useClients } from '../../clients/hooks/useClients';
import type { CreateProjectPayload } from '../types';

interface Props {
  onSuccess?: () => void;
}

export const CreateProjectForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateProjectPayload>({
    client_id: '',
    name: '',
    project_type: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning',
    budget: 0,
  });

  // Fetch clients to populate the dropdown
  const { data: clientsData } = useClients();
  const clients = clientsData?.data || [];

  const { mutate: createProject, isPending, isError, error } = useCreateProject();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'budget' ? parseFloat(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject(formData, {
      onSuccess: () => {
        setFormData({ client_id: '', name: '', project_type: '', description: '', start_date: '', end_date: '', status: 'planning', budget: 0 });
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Create New Project</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
          <select
            name="client_id" required value={formData.client_id} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="" disabled>-- Choose a Client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.company_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Website Redesign 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
          <input
            type="text" name="project_type" value={formData.project_type} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Web Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status" value={formData.status} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
          <input
            type="number" name="budget" min="0" step="0.01" value={formData.budget} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date" name="start_date" value={formData.start_date} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date" name="end_date" value={formData.end_date} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" rows={3} value={formData.description} onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Brief overview of the project scope..."
        />
      </div>

      {isError && <p className="text-sm text-red-600">{error?.message || 'Failed to create project.'}</p>}

      <div className="flex justify-end mt-2">
        <button
          type="submit" disabled={isPending}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 font-medium"
        >
          {isPending ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
};