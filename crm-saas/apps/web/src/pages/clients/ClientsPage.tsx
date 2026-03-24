import React, { useState } from 'react';
import { ClientList } from '../../features/clients/components/ClientList';
import { CreateClientForm } from '../../features/clients/components/CreateClientForm';

export const ClientsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your business contacts and organizations.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          {showForm ? 'Close Form' : '+ New Client'}
        </button>
      </div>

      {/* Conditionally render the creation form */}
      {showForm && (
        <div className="mb-4 transition-all">
          <CreateClientForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* The Data Table */}
      <ClientList />
    </div>
  );
};