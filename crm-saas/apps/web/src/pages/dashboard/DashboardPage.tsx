import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useClients } from '../../features/clients/hooks/useClients';
import { useLeads } from '../../features/leads/hooks/useLeads';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: clientsData, isLoading: isLoadingClients } = useClients();
  const { data: leadsData, isLoading: isLoadingLeads } = useLeads();

  const totalClients = clientsData?.data?.length || 0;
  const activeLeads = leadsData?.data?.filter(l => l.status !== 'lost')?.length || 0;
  const newLeads = leadsData?.data?.filter(l => l.status === 'new')?.length || 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Minimalistic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#0f172a] tracking-tight flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h2>
          <p className="text-[#64748b] text-[15px] mt-1">
            Here's what's happening with your CRM today.
          </p>
        </div>
      </div>

      {/* Clean SaaS Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Card 1: Active Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_16px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-500 text-[12px] uppercase tracking-widest">Active Pipeline</h3>
              <div className="flex items-end gap-3">
                <p className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {isLoadingLeads ? <span className="text-gray-300 animate-pulse text-2xl">--</span> : activeLeads}
                </p>
                <span className="text-sm font-medium text-slate-400 mb-1">Leads</span>
              </div>
            </div>
            <div className="p-2.5 bg-blue-50/80 text-blue-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[13px]">
            <span className="text-blue-600 font-semibold flex items-center bg-blue-50 px-1.5 py-0.5 rounded-md">
              Real-time
            </span>
            <span className="text-slate-400 font-medium tracking-tight">Across all stages</span>
          </div>
        </div>

        {/* Card 2: New Config */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_16px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-500 text-[12px] uppercase tracking-widest">New Leads</h3>
              <div className="flex items-end gap-3">
                <p className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {isLoadingLeads ? <span className="text-gray-300 animate-pulse text-2xl">--</span> : newLeads}
                </p>
                <span className="text-sm font-medium text-slate-400 mb-1">Incoming</span>
              </div>
            </div>
            <div className="p-2.5 bg-amber-50/80 text-amber-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[13px]">
            <span className="text-amber-600 font-semibold flex items-center bg-amber-50 px-1.5 py-0.5 rounded-md">
              <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Requires Action
            </span>
            <span className="text-slate-400 font-medium tracking-tight">Awaiting contact</span>
          </div>
        </div>

        {/* Card 3: Total Clients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_16px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-500 text-[12px] uppercase tracking-widest">Total Clients</h3>
              <div className="flex items-end gap-3">
                <p className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {isLoadingClients ? <span className="text-gray-300 animate-pulse text-2xl">--</span> : totalClients}
                </p>
                <span className="text-sm font-medium text-slate-400 mb-1">Companies</span>
              </div>
            </div>
            <div className="p-2.5 bg-emerald-50/80 text-emerald-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[13px]">
            <span className="text-emerald-600 font-semibold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Verified
            </span>
            <span className="text-slate-400 font-medium tracking-tight">Successfully onboarded</span>
          </div>
        </div>
      </div>

      {/* Premium Dummy Chart Area */}
      <div className="mt-2 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] min-h-[340px] flex flex-col justify-center items-center text-center relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100/50 to-transparent"></div>

        <div className="w-20 h-20 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] rounded-full flex items-center justify-center mb-6 z-10 border border-slate-100 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
        </div>
        <h3 className="text-slate-900 font-bold text-[18px] mb-2 z-10">Activity Overview</h3>
        <p className="text-slate-500 text-[15px] max-w-sm mb-6 z-10 leading-relaxed">Connect your analytics accounts to see beautiful charts of your recurring revenue and deal flow over time.</p>
        <button className="z-10 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:border-slate-300 hover:shadow-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Connect Analytics
        </button>
      </div>
    </div>
  );
};