import React, { useState } from 'react';
import { LeadKanbanBoard } from '../../features/leads/components/LeadKanbanBoard';
import { CreateLeadForm } from '../../features/leads/components/CreateLeadForm';

export const LeadsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads Pipeline</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and move prospective clients through your sales funnel. Drag and drop cards to update their status.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
        >
          {showForm ? 'Close Form' : '+ New Lead'}
        </button>
      </div>

      {/* Conditionally render the creation form */}
      {showForm && (
        <div className="mb-2 transition-all">
          <CreateLeadForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* The Kanban Board */}
      <LeadKanbanBoard />
    </div>
  );
};