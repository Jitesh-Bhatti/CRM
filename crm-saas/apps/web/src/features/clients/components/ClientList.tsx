import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { useClients } from '../hooks/useClients';
import { useDeleteClient } from '../hooks/useDeleteClient';

export const ClientList: React.FC = () => {
  const { data, isLoading, isError, error } = useClients();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  if (isLoading) return <div className="p-4 text-gray-500">Loading clients...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {error?.message}</div>;

  const clients = data?.data || [];

  if (clients.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No clients found. Create your first client to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.company_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.primary_contact_name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                
                {/* 2. Add the View link here! */}
                <Link 
                  to={`/clients/${client.id}`}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  View Details
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this client?')) {
                      deleteClient(client.id);
                    }
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