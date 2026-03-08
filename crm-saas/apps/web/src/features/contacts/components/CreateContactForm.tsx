import React, { useState } from 'react';
import { useCreateContact } from '../hooks/useCreateContact';
import type { CreateContactPayload } from '../types';

interface Props {
  clientId: string;
  onSuccess?: () => void;
}

export const CreateContactForm: React.FC<Props> = ({ clientId, onSuccess }) => {
  const [formData, setFormData] = useState<CreateContactPayload>({
    name: '',
    email: '',
    phone: '',
    designation: '',
    job_title: '',
    is_primary: false,
  });

  const { mutate: createContact, isPending, isError, error } = useCreateContact(clientId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', phone: '', designation: '', job_title: '', is_primary: false });
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Add New Contact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Pepper Potts"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="pepper@stark.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+1-555-0001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text" name="job_title" value={formData.job_title} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="CEO"
          />
        </div>
      </div>

      <div className="flex items-center mt-2">
        <input
          type="checkbox" name="is_primary" id="is_primary" checked={formData.is_primary} onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-900">
          Make this the Primary Contact
        </label>
      </div>

      {isError && (
        <p className="text-sm text-red-600 mt-2">{error?.message || 'Failed to create contact.'}</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit" disabled={isPending}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isPending ? 'Saving...' : 'Save Contact'}
        </button>
      </div>
    </form>
  );
};