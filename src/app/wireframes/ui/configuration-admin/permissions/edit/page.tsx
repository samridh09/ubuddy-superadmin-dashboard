'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import {
  PageWrapper, PageHeader, FilterBox,
  DataTable, Table, THead, TBody, Th, Td, Tr,
} from '@/app/wireframe/ui/components/ui';

const MOCK_ADMIN_NAMES: Record<string, string> = {
  '1': 'SAMRIDH SATNALIKA',
  '2': 'ANISHA GUPTA',
  '3': 'ROHAN MEHTA',
  '4': 'PRIYA SHARMA',
  '5': 'VIKRAM SINGH',
};

const INITIAL_MODULES = [
  { id: '1', module: 'Dashboard', isAssigned: false },
  { id: '2', module: 'School Management', isAssigned: true },
  { id: '3', module: 'Configuration Admin', isAssigned: true },
  { id: '4', module: 'Manage Modules', isAssigned: true },
  { id: '5', module: 'Manage Sessions', isAssigned: true },
  { id: '6', module: 'Result Portal', isAssigned: false },
  { id: '7', module: 'Assign Module', isAssigned: true },
  { id: '8', module: 'Student Management', isAssigned: false },
];

function EditModulesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get('adminId') ?? '1';
  const adminName = MOCK_ADMIN_NAMES[adminId] ?? 'CONFIGURATION ADMIN';

  const [modules, setModules] = useState(INITIAL_MODULES);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, isAssigned: !m.isAssigned } : m));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push(`/wireframes/ui/configuration-admin/permissions?adminId=${adminId}`), 800);
    }, 700);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Configuration Admin | Edit Modules"
        showBack
        onBack={() => router.push(`/wireframes/ui/configuration-admin/permissions?adminId=${adminId}`)}
        actions={
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        }
      />

      <FilterBox>
        <div className="space-y-1 flex-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">
            Editing modules for
          </label>
          <div className="flex items-center gap-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[15px] font-semibold tracking-tight text-blue-900">{adminName}</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest rounded border border-gray-100">
              Configuration Admin
            </span>
          </div>
        </div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest self-center">
          {modules.filter(m => m.isAssigned).length} / {modules.length} assigned
        </div>
      </FilterBox>

      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[80px]" className="pl-10">S. No.</Th>
            <Th width="w-[400px]">Module</Th>
            <Th align="center" width="w-[160px]">Assigned</Th>
          </THead>
          <TBody>
            {modules.map((item, index) => (
              <Tr key={item.id} index={index}>
                <Td className="pl-10">
                  <span className="text-[13px] font-medium text-gray-400">{index + 1}</span>
                </Td>
                <Td>
                  <span className="text-[13px] font-semibold text-blue-900 tracking-tight">{item.module}</span>
                </Td>
                <Td align="center">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`w-10 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${item.isAssigned ? 'bg-blue-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${item.isAssigned ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'}`} />
                  </button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );
}

export default function ConfigurationAdminEditModulesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading...</div>}>
      <EditModulesContent />
    </Suspense>
  );
}
