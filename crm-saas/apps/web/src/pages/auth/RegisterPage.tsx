import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterOrganizationForm } from '../../features/auth/components/RegisterOrganizationForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
          <p className="text-sm text-gray-500 mt-2">Set up your SaaS organization</p>
        </div>

        {/* The form handles the actual API call and redirecting to '/' */}
        <RegisterOrganizationForm />
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};