import React from 'react';
import { useLeads } from '../hooks/useLeads';
import { useUpdateLead } from '../hooks/useUpdateLead';
import { useDeleteLead } from '../hooks/useDeleteLead';
import type { Lead } from '../types';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-500', dot: 'bg-blue-500 shadow-blue-500/50' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-500', dot: 'bg-amber-500 shadow-amber-500/50' },
  { id: 'qualified', title: 'Qualified', color: 'bg-emerald-500', dot: 'bg-emerald-500 shadow-emerald-500/50' },
  { id: 'lost', title: 'Lost', color: 'bg-slate-400', dot: 'bg-slate-400 shadow-slate-400/50' },
];

export const LeadKanbanBoard: React.FC = () => {
  const { data, isLoading, isError } = useLeads();
  const { mutate: updateLead } = useUpdateLead();
  const { mutate: deleteLead } = useDeleteLead();

  if (isLoading) return (
    <div className="p-12 flex justify-center items-center text-slate-500 h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      Loading pipeline...
    </div>
  );
  if (isError) return (
    <div className="p-6 text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
      <span className="text-xl">⚠️</span> Failed to load leads pipeline.
    </div>
  );

  const leads = data?.data || [];

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow dropping
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      updateLead({ id: leadId, payload: { status: newStatus } });
    }
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 h-full min-h-[500px] snap-x pt-2">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
          className="flex flex-col flex-shrink-0 w-[340px] bg-slate-100/50 rounded-2xl border border-slate-200/60 snap-center"
        >
          {/* Column Header */}
          <div className="px-4 py-3 border-b border-slate-200/80 flex justify-between items-center rounded-t-2xl bg-white/40">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${column.dot} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}></div>
              <h3 className="font-bold text-slate-800 text-[15px]">{column.title}</h3>
            </div>
            <span className="bg-white text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md shadow-sm border border-slate-200">
              {leads.filter((l) => l.status === column.id).length}
            </span>
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
                  onDragEnd={handleDragEnd}
                  className="group bg-white p-4 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-[0_8px_16px_-4px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${column.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[15px] pr-6">{lead.name}</h4>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this lead?')) deleteLead(lead.id);
                      }}
                      className="absolute top-3 right-3 w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Delete Lead"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[11px] font-semibold mb-3 border border-slate-100 tracking-wide uppercase">
                    {lead.company}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100/80 text-[13px] text-slate-500 font-medium">
                    {lead.email && (
                      <div className="flex items-center gap-2 truncate hover:text-blue-600 transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};