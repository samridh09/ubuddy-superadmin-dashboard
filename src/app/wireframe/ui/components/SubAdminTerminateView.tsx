'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search, X, UserX, AlertTriangle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SubAdminTerminateEntry, MOCK_SUB_ADMIN_TERMINATE_DATA } from '@/mock/sub-admin.mock';

export const SubAdminTerminateView = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const filtered = MOCK_SUB_ADMIN_TERMINATE_DATA.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(r => r.id));
  };

  const handleSubmit = () => {
    setConfirmed(false);
    router.push('/dashboard/schooladmin/sub-admin');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out space-y-8 pb-40">

      {/* Header */}
      <div className="flex items-center gap-4 px-1">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-900 hover:border-gray-200 transition-all duration-200 active:scale-95 shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h2 className="text-[22px] font-bold text-blue-900 tracking-tight">Sub Admin Management | Terminate</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Select sub-admins to permanently terminate</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-visible">

        {/* Filter bar */}
        <div className="flex items-end gap-5 p-7 border-b border-gray-100">
          <div className="space-y-1 flex-1 max-w-[340px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Search Sub Admin</label>
            <div className="relative group/search">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-blue-500 transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-200"
              />
            </div>
          </div>
          {selected.length > 0 && (
            <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-[12px] font-bold text-red-600 animate-in fade-in duration-200">
              {selected.length} selected for termination
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="w-[60px] px-8 py-5 pl-10">
                  <button
                    onClick={toggleAll}
                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      selected.length === filtered.length && filtered.length > 0
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-white border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {selected.length === filtered.length && filtered.length > 0 && <Check size={11} strokeWidth={4} />}
                  </button>
                </th>
                <th className="w-[60px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">S. No.</th>
                <th className="w-[220px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="w-[160px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</th>
                <th className="w-[130px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="w-[130px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, index) => {
                const isSelected = selected.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    onClick={() => toggle(row.id)}
                    className={`cursor-pointer transition-all duration-200 ${isSelected ? 'bg-red-50/60' : 'hover:bg-gray-50/50'}`}
                  >
                    <td className="px-8 py-5 pl-10">
                      <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                        isSelected ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4} />}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[13px] font-semibold text-gray-400">{index + 1}</td>
                    <td className={`px-8 py-5 text-[13px] font-bold tracking-tight ${isSelected ? 'text-red-600' : 'text-blue-900'}`}>{row.name}</td>
                    <td className="px-8 py-5 text-[13px] font-semibold text-gray-500">{row.username}</td>
                    <td className="px-8 py-5 text-[13px] font-semibold text-gray-500 uppercase tracking-tight">{row.employeeId}</td>
                    <td className="px-8 py-5 text-[13px] font-semibold text-gray-500">{row.role}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${
                        row.status === 'Active'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-[14px] font-bold text-gray-400 uppercase tracking-widest">
                    No sub-admins matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating action bar — only shown when selection > 0 */}
      {selected.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-8 duration-500 ease-out">
          <div className="bg-red-600 border border-white/5 px-2 py-2 rounded-[22px] shadow-[0_25px_60px_-15px_rgba(220,38,38,0.5)] flex items-center gap-2">
            <button
              onClick={() => setSelected([])}
              className="flex items-center gap-2 px-8 py-2.5 text-[13px] font-bold rounded-[16px] text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <X size={16} strokeWidth={2.5} />
              Cancel
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1" />
            <button
              onClick={() => setConfirmed(true)}
              className="flex items-center gap-3 px-10 py-2.5 text-[14px] font-bold rounded-[16px] bg-white text-red-600 hover:bg-red-50 transition-all active:scale-[0.96]"
            >
              <UserX size={18} strokeWidth={2.5} />
              Terminate {selected.length} Sub-Admin{selected.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <Dialog open={confirmed} onOpenChange={setConfirmed}>
        <DialogContent showCloseButton={false} className="max-w-[400px] p-10">
          <DialogHeader className="items-start text-left">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-[17px] font-black text-blue-900 tracking-tight">
              Confirm Termination
            </DialogTitle>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              This action cannot be undone
            </p>
          </DialogHeader>

          <p className="text-[13px] font-semibold text-gray-500 leading-relaxed mt-2">
            You are about to permanently terminate{' '}
            <span className="text-red-600 font-bold">
              {selected.length} sub-admin{selected.length > 1 ? 's' : ''}
            </span>.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setConfirmed(false)}
              className="flex-1 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-[13px] hover:bg-gray-100 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold text-[13px] hover:bg-red-600 active:scale-95 transition-all"
            >
              Terminate
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
