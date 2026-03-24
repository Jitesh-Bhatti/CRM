import React, { useState } from 'react';
import { useCreateClient } from '../hooks/useCreateClient';
import type { CreateClientPayload } from '../types';

export const CreateClientForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateClientPayload>({
    company_name: '',
    primary_contact_name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
  });

  const { mutate: createClient, isPending, isError, error } = useCreateClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient(formData, {
      onSuccess: () => {
        // Reset form on success
        setFormData({
          company_name: '', primary_contact_name: '', email: '', phone: '', address: '', country: '',
        });
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Add New Client</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
          <input
            type="text" name="company_name" required value={formData.company_name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Stark Industries"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
          <input
            type="text" name="primary_contact_name" value={formData.primary_contact_name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tony Stark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="tony@stark.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+1-800-IRONMAN"
          />
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-600 mt-2">{error?.message || 'Failed to create client.'}</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isPending ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};