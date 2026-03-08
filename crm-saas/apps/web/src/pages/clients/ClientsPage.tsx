import React, { useState } from 'react';
import { ClientList } from '../../features/clients/components/ClientList';
import { CreateClientForm } from '../../features/clients/components/CreateClientForm';

export const ClientsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-white/40">
        <div>
          <h2 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">
            Clients
          </h2>
          <p className="text-[#64748b] mt-1 text-[15px] max-w-2xl">
            Manage your business contacts, organizations, and communication history securely.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#1d4ed8] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_16px_rgba(29,78,216,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          New Client
        </button>
      </div>

      {/* Conditionally render the creation form in a Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[4px] transition-opacity" onClick={() => setShowForm(false)}></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-full overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CreateClientForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* The Data Table */}
      <div className="bg-transparent">
        <ClientList />
      </div>
    </div>
  );
};