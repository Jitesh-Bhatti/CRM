import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClient } from '../../features/clients/hooks/useClient';
import { ContactList } from '../../features/contacts/components/ContactList';
import { CreateContactForm } from '../../features/contacts/components/CreateContactForm';

export const ClientDetailsPage: React.FC = () => {
  // Grab the :id variable from the URL
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading, isError } = useClient(id!);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <div className="p-6 text-gray-500">Loading client details...</div>;
  if (isError || !data) return <div className="p-6 text-red-500">Client not found.</div>;

  const client = data.data;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Back button & Header */}
      <div>
        <Link to="/clients" className="text-blue-600 hover:underline text-sm mb-4 inline-block transition-colors">
          &larr; Back to Clients
        </Link>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{client.company_name}</h2>
          <p className="text-gray-500 mt-1">{client.address || 'No address provided'}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div><span className="font-semibold text-gray-900">Primary Contact:</span> {client.primary_contact_name || '-'}</div>
            <div><span className="font-semibold text-gray-900">Email:</span> {client.email || '-'}</div>
            <div><span className="font-semibold text-gray-900">Phone:</span> {client.phone || '-'}</div>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Client Contacts</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {showForm ? 'Close Form' : '+ New Contact'}
          </button>
        </div>

        {/* Conditionally render the creation form */}
        {showForm && (
          <div className="mb-6 transition-all">
            <CreateContactForm clientId={id!} onSuccess={() => setShowForm(false)} />
          </div>
        )}

        {/* The Contact Grid */}
        <ContactList clientId={id!} />
      </div>
    </div>
  );
};