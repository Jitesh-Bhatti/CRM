import React from 'react';
import { useContacts } from '../hooks/useContacts';
import { useDeleteContact } from '../hooks/useDeleteContact';

interface Props {
  clientId: string;
}

export const ContactList: React.FC<Props> = ({ clientId }) => {
  const { data, isLoading, isError, error } = useContacts(clientId);
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact(clientId);

  if (isLoading) return <div className="p-4 text-gray-500">Loading contacts...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {error?.message}</div>;

  const contacts = data?.data || [];

  if (contacts.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No contacts found for this client yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
          {contact.is_primary && (
            <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Primary
            </span>
          )}
          <h4 className="text-lg font-semibold text-gray-900">{contact.name}</h4>
          <p className="text-sm text-gray-500 mb-3">{contact.job_title || 'No Title'}</p>
          
          <div className="space-y-1 text-sm text-gray-600">
            {contact.email && <p>✉️ {contact.email}</p>}
            {contact.phone && <p>📞 {contact.phone}</p>}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => {
                if (window.confirm('Remove this contact?')) deleteContact(contact.id);
              }}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};