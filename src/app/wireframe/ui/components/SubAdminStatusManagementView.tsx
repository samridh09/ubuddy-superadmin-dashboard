'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search, Save, X, MoreHorizontal, UserCheck, UserMinus, UserX, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubAdminStatusEntry, MOCK_SUB_ADMIN_STATUS_DATA } from '@/mock/sub-admin.mock';

export const SubAdminStatusManagementView = () => {
  const router = useRouter();
  const [data, setData] = useState(MOCK_SUB_ADMIN_STATUS_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateStatus = (id: number, newStatus: SubAdminStatusEntry['status']) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setEditingId(null);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const colors: Record<string, string> = {
        Active: 'bg-blue-50 text-blue-600 border-blue-100',
        Inactive: 'bg-amber-50 text-amber-600 border-amber-100',
        Terminated: 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return (
        <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${colors[normalizedStatus] ?? 'bg-gray-50 text-gray-400 border-gray-100'}`}>
            {status}
        </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out space-y-8 pb-40">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-900 hover:border-gray-200 transition-all duration-200 active:scale-95 shadow-none shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-[22px] font-bold text-blue-900 tracking-tight">Sub Admin Management | Bulk Status Control</h2>
        </div>
      </div>

      {/* 2. Card with Table */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-visible animate-in zoom-in-95 duration-500 delay-150">
        
        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-5 p-7 border-b border-gray-100">
            <div className="space-y-1 w-[200px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Role Type</label>
                <select className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all duration-300">
                    <option>All Roles</option>
                    <option>Cashier</option>
                    <option>Accountant</option>
                </select>
            </div>
            <div className="space-y-1 w-[200px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Current Status</label>
                <select className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all duration-300">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>
            <div className="flex-1" />
            <div className="space-y-1 w-[300px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Search Sub Admin</label>
                <div className="relative group/search">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-blue-500 transition-colors duration-300" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all duration-300 placeholder-gray-200"
                    />
                </div>
            </div>
        </div>

        {/* Status Table */}
        <div className="overflow-visible">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th className="w-[80px] px-8 py-5 pl-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">S. No.</th>
                        <th className="w-[200px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                        <th className="w-[180px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</th>
                        <th className="w-[120px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                        <th className="w-[150px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                        <th className="w-[150px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-12">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, index) => (
                        <tr key={row.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                            <td className="px-8 py-5 pl-10 text-[13px] font-semibold text-gray-400">{index + 1}</td>
                            <td className="px-8 py-5 text-[13px] font-bold text-blue-900">{row.name}</td>
                            <td className="px-8 py-5 text-[13px] font-semibold text-gray-500">{row.username}</td>
                            <td className="px-8 py-5 text-[13px] font-semibold text-gray-500 uppercase tracking-tight">{row.employeeId}</td>
                            <td className="px-8 py-5 text-[13px] font-semibold text-gray-500">{row.role}</td>
                            <td className="px-8 py-5">
                                <div className="flex justify-center">
                                    <StatusBadge status={row.status} />
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right pr-12 relative overflow-visible">
                                <button 
                                    onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 ${
                                        editingId === row.id 
                                        ? 'bg-blue-600 border-blue-600 text-white' 
                                        : 'bg-white border-gray-100 text-blue-900 hover:border-blue-400'
                                    }`}
                                >
                                    Change
                                </button>
                                
                                {/* Status Modal (Inline Dropdown logic as per wireframe note) */}
                                {editingId === row.id && (
                                    <div className="absolute right-12 top-[calc(100%+4px)] w-[200px] bg-blue-600 rounded-2xl p-2 z-[200] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-2 border-b border-white/5 mb-1 px-3">
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Select New Status</p>
                                        </div>
                                        <button 
                                            onClick={() => updateStatus(row.id, 'Active')}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-bold text-white hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCheck size={14} className="text-blue-400" />
                                                Active
                                            </div>
                                            {row.status === 'Active' && <Check size={12} strokeWidth={4} className="text-blue-400" />}
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(row.id, 'Inactive')}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-bold text-white hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserMinus size={14} className="text-amber-400" />
                                                Inactive
                                            </div>
                                            {row.status === 'Inactive' && <Check size={12} strokeWidth={4} className="text-amber-400" />}
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(row.id, 'Terminated')}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-bold text-white hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserX size={14} className="text-rose-400" />
                                                Terminate
                                            </div>
                                            {row.status === 'Terminated' && <Check size={12} strokeWidth={4} className="text-rose-400" />}
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* 4. PREMIUM FLOATING ACTION BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-8 duration-500 ease-out">
        <div className="bg-blue-600 border border-white/5 px-2 py-2 rounded-[22px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex items-center gap-2">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 px-8 py-2.5 text-[13px] font-bold rounded-[16px] text-white/50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-white hover:bg-white/10 active:scale-95"
            >
                <X size={16} strokeWidth={2.5} />
                Cancel
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1" />
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-3 px-10 py-2.5 text-[14px] font-bold rounded-[16px] bg-white text-blue-900 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)] active:scale-[0.96] active:bg-gray-50/50"
            >
                <Save size={18} strokeWidth={2.5} />
                Submit Changes
            </button>
        </div>
      </div>
    </div>
  );
};
