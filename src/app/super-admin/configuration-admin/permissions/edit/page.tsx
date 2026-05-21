'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

import {
  PageWrapper,
  PageHeader,
  FilterBox,
  DataTable,
  Table,
  THead,
  TBody,
  Th,
  Td,
  Tr,
} from '@/app/wireframe/ui/components/ui';
import { MOCK_ADMIN_NAMES } from '@/mock/config-admin.mock';
import { DEFAULT_MODULE_ASSIGNMENTS } from '@/constants/config-admin';

function EditModulesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get('adminId') ?? '1';
  const adminName = MOCK_ADMIN_NAMES[adminId] ?? 'CONFIGURATION ADMIN';

  const [modules, setModules] = useState(DEFAULT_MODULE_ASSIGNMENTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, isAssigned: !m.isAssigned } : m));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push(`/super-admin/configuration-admin/permissions?adminId=${adminId}`), 800);
    }, 700);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Configuration Admin | Edit Modules"
        showBack
        onBack={() => router.push(`/super-admin/configuration-admin/permissions?adminId=${adminId}`)}
        actions={
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        }
      />

      <FilterBox>
        <div className="flex-1 space-y-1">
          <label className="px-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-gray-400">
            Editing modules for
          </label>
          <div className="flex items-center gap-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[15px] font-semibold tracking-tight text-blue-900">{adminName}</span>
            <span className="ml-1 rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Configuration Admin
            </span>
          </div>
        </div>
        <div className="self-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {modules.filter((m) => m.isAssigned).length} / {modules.length} assigned
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
                  <span className="text-[13px] font-semibold tracking-tight text-blue-900">{item.module}</span>
                </Td>
                <Td align="center">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`relative h-6 w-10 rounded-full transition-all duration-300 focus:outline-none ${item.isAssigned ? 'bg-blue-500' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${item.isAssigned ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'}`}
                    />
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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
          Loading...
        </div>
      }
    >
      <EditModulesContent />
    </Suspense>
  );
}
