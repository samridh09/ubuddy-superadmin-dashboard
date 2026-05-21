'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import {
  PageWrapper, PageHeader, FilterBox, SecondaryButton,
  DataTable, Table, THead, TBody, Th, Td, Tr, ToggleSwitch
} from '@/app/wireframe/ui/components/ui';

const MOCK_ADMIN_NAMES: Record<string, string> = {
  '1': 'SAMRIDH SATNALIKA',
  '2': 'ANISHA GUPTA',
  '3': 'ROHAN MEHTA',
  '4': 'PRIYA SHARMA',
  '5': 'VIKRAM SINGH',
};

const DEFAULT_MODULES = [
  { id: '1', module: 'Dashboard', isAssigned: false },
  { id: '2', module: 'School Management', isAssigned: true },
  { id: '3', module: 'Configuration Admin', isAssigned: true },
  { id: '4', module: 'Manage Modules', isAssigned: true },
  { id: '5', module: 'Manage Sessions', isAssigned: true },
  { id: '6', module: 'Result Portal', isAssigned: false },
  { id: '7', module: 'Assign Module', isAssigned: true },
  { id: '8', module: 'Student Management', isAssigned: false },
];

function PermissionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get('adminId') ?? '1';
  const adminName = MOCK_ADMIN_NAMES[adminId] ?? 'CONFIGURATION ADMIN';

  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [draft, setDraft] = useState(DEFAULT_MODULES);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const enterEdit = () => { setDraft(modules); setEditing(true); };
  const cancelEdit = () => { setDraft(modules); setEditing(false); };

  const toggle = (id: string) => {
    setDraft(prev => prev.map(m => m.id === id ? { ...m, isAssigned: !m.isAssigned } : m));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setModules(draft);
      setSaving(false);
      setEditing(false);
    }, 600);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Configuration Admin | Permissions"
        showBack
        onBack={() => router.push('/wireframes/ui/configuration-admin')}
      />

      <FilterBox>
        <div className="space-y-1 flex-1 min-w-[240px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">
            Modules assigned for
          </label>
          <div className="flex items-center gap-2.5 py-1">
            <span className="text-[15px] font-semibold tracking-tight text-blue-900">{adminName}</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest rounded border border-gray-100">
              Configuration Admin
            </span>
          </div>
        </div>
        {!editing && (
          <SecondaryButton onClick={enterEdit}>
            <Pencil size={14} />
            Edit Modules
          </SecondaryButton>
        )}
        {editing && (
          <div className="text-[11px] font-bold text-blue-500 uppercase tracking-widest self-center">
            {draft.filter(m => m.isAssigned).length} / {draft.length} assigned
          </div>
        )}
      </FilterBox>

      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[80px]" className="pl-10">S. No.</Th>
            <Th width="w-[400px]">Module</Th>
            <Th align="center" width="w-[160px]">{editing ? 'Assigned' : 'Status'}</Th>
          </THead>
          <TBody>
            {(editing ? draft : modules).map((item, index) => (
              <Tr key={item.id} index={index}>
                <Td className="pl-10">
                  <span className="text-[13px] font-medium text-gray-400">{index + 1}</span>
                </Td>
                <Td>
                  <span className="text-[13px] font-semibold text-blue-900 tracking-tight">{item.module}</span>
                </Td>
                <Td align="center">
                  {editing ? (
                    <ToggleSwitch 
                      checked={item.isAssigned} 
                      onChange={() => toggle(item.id)} 
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-left-2 duration-400">
                      <span className={`text-[13px] font-bold tracking-tight uppercase ${item.isAssigned ? 'text-blue-900' : 'text-gray-300'}`}>
                        {item.isAssigned ? 'Assigned' : 'Unassigned'}
                      </span>
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </DataTable>

      {/* Floating save/cancel */}
      {editing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={cancelEdit}
            className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </PageWrapper>
  );
}

export default function ConfigurationAdminPermissionsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading Access Controls...</div>}>
      <PermissionsContent />
    </Suspense>
  );
}
