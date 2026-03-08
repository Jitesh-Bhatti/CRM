import React, { useState } from 'react';
import { useCreateLead } from '../hooks/useCreateLead';
import type { CreateLeadPayload } from '../types';

export const CreateLeadForm: React.FC<{ onSuccess?: () => void; onCancel?: () => void }> = ({ onSuccess, onCancel }) => {
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

  const inputClasses = "w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium placeholder:text-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.01)]";
  const labelClasses = "block text-[13px] font-semibold text-slate-700 mb-1.5 ml-0.5 tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.08)] relative overflow-hidden">

      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center text-xl shadow-[0_2px_8px_-2px_rgba(59,130,246,0.12)] border border-blue-100/50">
          🎯
        </div>
        <div>
          <h3 className="text-[22px] font-extrabold text-[#0f172a] tracking-tight">Add New Lead</h3>
          <p className="text-[14px] font-medium text-slate-500 mt-0.5">Enter the prospective client's details below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className={labelClasses}>Lead Name <span className="text-rose-500">*</span></label>
          <input
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className={inputClasses}
            placeholder="Bruce Wayne"
          />
        </div>
        <div>
          <label className={labelClasses}>Company <span className="text-rose-500">*</span></label>
          <input
            type="text" name="company" required value={formData.company} onChange={handleChange}
            className={inputClasses}
            placeholder="Wayne Enterprises"
          />
        </div>
        <div>
          <label className={labelClasses}>Email Address <span className="text-rose-500">*</span></label>
          <input
            type="email" name="email" required value={formData.email} onChange={handleChange}
            className={inputClasses}
            placeholder="bruce@wayneenterprises.com"
          />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input
            type="text" name="phone" value={formData.phone} onChange={handleChange}
            className={inputClasses}
            placeholder="+1-555-BATMAN"
          />
        </div>
        <div>
          <label className={labelClasses}>Source</label>
          <input
            type="text" name="source" value={formData.source} onChange={handleChange}
            className={inputClasses}
            placeholder="Website Contact Form"
          />
        </div>
        <div>
          <label className={labelClasses}>Initial Status</label>
          <div className="relative">
            <select
              name="status" value={formData.status} onChange={handleChange}
              className={`${inputClasses} appearance-none cursor-pointer`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-medium text-rose-600 flex items-center gap-2 mt-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error?.message || 'Failed to create lead.'}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4 pt-5 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit" disabled={isPending}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#1d4ed8] text-white font-semibold py-2.5 px-8 rounded-xl shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_16px_rgba(29,78,216,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 min-w-[160px]"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Lead</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};