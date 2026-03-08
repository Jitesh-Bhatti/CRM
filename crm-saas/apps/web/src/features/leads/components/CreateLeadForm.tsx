import React, { useState } from 'react';
import { useCreateLead } from '../hooks/useCreateLead';
import type { CreateLeadPayload } from '../types';

export const CreateLeadForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateLeadPayload>({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'new', // Default status
    source: '',
  });

  const { mutate: createLead, isPending, isError, error } = useCreateLead();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', company: '', phone: '', status: 'new', source: '' });
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Add New Lead</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Name *</label>
          <input
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Bruce Wayne"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text" name="company" required value={formData.company} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Wayne Enterprises"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="bruce@wayneenterprises.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+1-555-BATMAN"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text" name="source" value={formData.source} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Website Contact Form"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
          <select
            name="status" value={formData.status} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-600 mt-2">{error?.message || 'Failed to create lead.'}</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit" disabled={isPending}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isPending ? 'Saving...' : 'Save Lead'}
        </button>
      </div>
    </form>
  );
};