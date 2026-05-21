'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Save, X, Plus, Check } from 'lucide-react';
import {
  PageWrapper, PageHeader, FilterBox, SecondaryButton,
  DataTable, Table, THead, TBody, Th, Td, Tr,
} from './ui';
import { API_ENDPOINTS } from '@/lib/api';
import apiClient from '@/lib/axios';
import { SubAdminEditPermissionEntry, SubAdminEditPermissionsViewProps } from '@/types';

function buildModulePermissions(entries: SubAdminEditPermissionEntry[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const entry of entries) {
    if (!entry.isAssigned) continue;
    const actions = ['READ'];
    if (entry.permissions.add)    actions.push('WRITE');
    if (entry.permissions.edit)   actions.push('UPDATE');
    if (entry.permissions.delete) actions.push('DELETE');
    if (entry.permissions.export) actions.push('EXPORT');
    result[entry.moduleKey] = actions;
  }
  return result;
}

export const SubAdminEditPermissionsView: React.FC<SubAdminEditPermissionsViewProps> = ({
  adminName, initialData, adminId, schoolId
}) => {
  const router = useRouter();
  const [data, setData] = useState<SubAdminEditPermissionEntry[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  const profileParam = adminId ? `?adminId=${adminId}` : '';

  const handleSave = async () => {
    if (!adminId || !schoolId) { router.back(); return; }
    setSaving(true);
    const form = new FormData();
    form.append('module_permissions', JSON.stringify(buildModulePermissions(data)));
    await apiClient.put(API_ENDPOINTS.schoolAdmins.byId(schoolId, adminId), form).catch(() => {});
    setSaving(false);
    router.push(`/dashboard/schooladmin/sub-admin/permissions${profileParam}`);
  };

  const toggleAssigned = (id: number) => {
    setData(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, isAssigned: !item.isAssigned };
        }
        return item;
    }));
  };

  const togglePermission = (id: number, key: keyof SubAdminEditPermissionEntry['permissions']) => {
    setData(prev => prev.map(item => {
        if (item.id === id) {
            return {
                ...item,
                permissions: { ...item.permissions, [key]: !item.permissions[key] }
            };
        }
        return item;
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesAssigned = showOnlyAssigned ? item.isAssigned : true;
      return matchesAssigned;
    });
  }, [data, showOnlyAssigned]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out space-y-8 pb-40">
      <PageHeader
        title="Sub Admin Permission | Edit Permissions"
        showBack
        onBack={() => router.back()}
      />

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">PERMISSIONS ASSIGNED FOR</div>
                <div className="flex items-center gap-3">
                    <h1 className="text-[18px] font-bold text-blue-900 uppercase tracking-tight">{adminName}</h1>
                    <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-300 text-[9px] font-black uppercase tracking-tighter border border-gray-100/50">SUB-ADMIN</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer group px-4 py-2 hover:bg-gray-50 rounded-xl transition-all" onClick={() => setShowOnlyAssigned(!showOnlyAssigned)}>
                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${showOnlyAssigned ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200'}`}>
                        {showOnlyAssigned && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span className="text-[12px] font-bold text-gray-500">View Assigned Only</span>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-blue-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                    <Plus size={16} strokeWidth={2.5} />
                    Add module
                </button>
            </div>
        </div>

        <div className="p-0 relative">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                    <th className="w-[80px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-10">S. No.</th>
                    <th className="w-[280px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Module</th>
                    <th className="w-[140px] px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Assigned</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Add</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Edit</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Delete</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Export</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {filteredData.map((item, index) => (
                    <tr key={item.id} className={`group hover:bg-gray-50/50 transition-all duration-300 ${!item.isAssigned ? 'opacity-40' : ''}`}>
                    <td className="px-8 py-5 pl-10 text-[13px] font-semibold text-gray-400">{index + 1}</td>
                    <td className="px-8 py-5">
                        <span className={`text-[13px] font-bold transition-colors ${item.isAssigned ? 'text-blue-900' : 'text-gray-400'}`}>{item.module}</span>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex justify-center">
                            <button 
                                onClick={() => toggleAssigned(item.id)}
                                className={`relative w-11 h-6 rounded-full transition-all duration-500 ease-out flex items-center px-0.5 border-2 ${
                                    item.isAssigned 
                                    ? 'bg-blue-600 border-blue-600' 
                                    : 'bg-gray-100 border-gray-200'
                                }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-500 transform ${item.isAssigned ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </td>
                    
                    {(['add', 'edit', 'delete', 'export'] as const).map((key) => (
                        <td key={key} className="px-8 py-5 text-center">
                            <div className="flex justify-center">
                                {item.isAssigned ? (
                                    <button 
                                        onClick={() => togglePermission(item.id, key)}
                                        className={`w-6 h-6 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                                            item.permissions[key]
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10'
                                                : 'bg-white border-gray-200 text-transparent hover:border-gray-400'
                                        }`}
                                    >
                                        <Check size={12} strokeWidth={4} />
                                    </button>
                                ) : (
                                    <span className="text-gray-200 text-[14px]">---</span>
                                )}
                            </div>
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
        <div className="bg-blue-900 border border-white/5 px-2 py-2 rounded-[22px] shadow-2xl flex items-center gap-2">
            <button
                onClick={() => router.push(`/dashboard/schooladmin/sub-admin/permissions${profileParam}`)}
                className="flex items-center gap-2 px-8 py-2.5 text-[13px] font-bold rounded-[16px] text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
                <X size={16} strokeWidth={2.5} />
                Cancel
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-10 py-2.5 text-[14px] font-bold rounded-[16px] bg-white text-blue-900 hover:shadow-lg active:scale-95 disabled:opacity-60 transition-all"
            >
                <Save size={18} strokeWidth={2.5} />
                {saving ? 'Saving...' : 'Save permissions'}
            </button>
        </div>
      </div>
    </div>
  );
};
