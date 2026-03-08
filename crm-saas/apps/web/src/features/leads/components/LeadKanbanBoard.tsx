import React from 'react';
import { useLeads } from '../hooks/useLeads';
import { useUpdateLead } from '../hooks/useUpdateLead';
import { useDeleteLead } from '../hooks/useDeleteLead';
import type { Lead } from '../types';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'contacted', title: 'Contacted', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { id: 'qualified', title: 'Qualified', color: 'bg-green-50 border-green-200 text-green-800' },
  { id: 'lost', title: 'Lost', color: 'bg-red-50 border-red-200 text-red-800' },
];

export const LeadKanbanBoard: React.FC = () => {
  const { data, isLoading, isError } = useLeads();
  const { mutate: updateLead } = useUpdateLead();
  const { mutate: deleteLead } = useDeleteLead();

  if (isLoading) return <div className="p-4 text-gray-500">Loading Kanban board...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load leads.</div>;

  const leads = data?.data || [];

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      updateLead({ id: leadId, payload: { status: newStatus } });
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
      {COLUMNS.map((column) => (
        <div 
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
          className="flex flex-col flex-shrink-0 w-80 bg-gray-100 rounded-lg border border-gray-200"
        >
          {/* Column Header */}
          <div className={`px-4 py-3 border-b rounded-t-lg font-semibold text-sm uppercase tracking-wide ${column.color}`}>
            {column.title} ({leads.filter((l) => l.status === column.id).length})
          </div>

          {/* Cards Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {leads
              .filter((lead) => lead.status === column.id)
              .map((lead: Lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{lead.name}</h4>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this lead?')) deleteLead(lead.id);
                      }}
                      className="text-gray-400 hover:text-red-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    {lead.email && <span className="truncate">✉️ {lead.email}</span>}
                    {lead.phone && <span>📞 {lead.phone}</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};