import React, { useState } from 'react';
import { useRegisterOrganization } from '../hooks/useRegisterOrganization';

export const RegisterOrganizationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    organization_name: '',
    owner_name: '',
    owner_email: '',
    password: '',
  });
  
  const { mutate: register, isPending, isError, error } = useRegisterOrganization();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
        <input
          type="text"
          name="organization_name"
          required
          value={formData.organization_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Acme Corp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          name="owner_name"
          required
          value={formData.owner_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
        <input
          type="email"
          name="owner_email"
          required
          value={formData.owner_email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john@acmecorp.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          {error?.message || 'Registration failed. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
      >
        {isPending ? 'Creating Account...' : 'Create Organization'}
      </button>
    </form>
  );
};