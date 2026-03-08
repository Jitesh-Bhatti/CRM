import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { useDeleteClient } from '../hooks/useDeleteClient';

export const ClientList: React.FC = () => {
  const { data, isLoading, isError, error } = useClients();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  if (isLoading) return (
    <div className="p-12 flex justify-center items-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      Loading clients...
    </div>
  );
  if (isError) return (
    <div className="p-6 text-red-600 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
      <span className="text-xl">⚠️</span> {error?.message}
    </div>
  );

  const clients = data?.data || [];

  if (clients.length === 0) {
    return (
      <div className="py-20 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4">
          🏢
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No clients yet</h3>
        <p className="text-gray-500 max-w-sm">Get started by creating your first client contact to manage your relationships.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client.id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs shadow-sm">
                      {client.company_name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{client.company_name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {client.primary_contact_name || <span className="text-gray-400 italic">Not set</span>}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="hover:text-blue-600 transition-colors">{client.email}</a>
                  ) : <span className="text-gray-400 italic">Not set</span>}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  {client.phone || <span className="text-gray-400 italic">Not set</span>}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      to={`/clients/${client.id}`}
                      className="px-3 py-1.5 text-blue-600 bg-blue-50 text-xs rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this client?')) {
                          deleteClient(client.id);
                        }
                      }}
                      disabled={isDeleting}
                      className="px-3 py-1.5 text-red-600 bg-red-50 text-xs rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};