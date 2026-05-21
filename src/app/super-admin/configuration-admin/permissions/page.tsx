'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pencil, Check, X, Loader2 } from 'lucide-react';

import {
  PageWrapper,
  PageHeader,
  FilterBox,
  SecondaryButton,
  DataTable,
  Table,
  THead,
  TBody,
  Th,
  Td,
  Tr,
  ToggleSwitch,
} from '@/app/wireframe/ui/components/ui';
import { getConfigAdminById } from '@/lib/services/config-admin-service';
import { DEFAULT_MODULE_ASSIGNMENTS } from '@/constants/config-admin';

function PermissionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get('adminId');

  const [adminName, setAdminName] = useState('CONFIGURATION ADMIN');
  const [modules, setModules] = useState(DEFAULT_MODULE_ASSIGNMENTS);
  const [draft, setDraft] = useState(DEFAULT_MODULE_ASSIGNMENTS);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    getConfigAdminById(adminId)
      .then((admin) => {
        setAdminName(admin.full_name || admin.username);
        // If the API provided permissions, we would map them here.
        // For now, we continue with existing logic for modules.
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [adminId]);

  const enterEdit = () => { setDraft(modules); setEditing(true); };
  const cancelEdit = () => { setDraft(modules); setEditing(false); };

  const toggle = (id: string) => {
    setDraft((prev) => prev.map((m) => m.id === id ? { ...m, isAssigned: !m.isAssigned } : m));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setModules(draft);
      setSaving(false);
      setEditing(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
        Loading Access Controls...
      </div>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Configuration Admin | Permissions"
        showBack
        onBack={() => router.push('/super-admin/configuration-admin')}
      />

      <FilterBox>
        <div className="flex-1 min-w-[240px] space-y-1">
          <label className="px-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-gray-400">
            Modules assigned for
          </label>
          <div className="flex items-center gap-2.5 py-1">
            <span className="text-[15px] font-semibold tracking-tight text-blue-900">{adminName}</span>
            <span className="ml-1 rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
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
          <div className="self-center text-[11px] font-bold uppercase tracking-widest text-blue-500">
            {draft.filter((m) => m.isAssigned).length} / {draft.length} assigned
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
                  <span className="text-[13px] font-semibold tracking-tight text-blue-900">{item.module}</span>
                </Td>
                <Td align="center">
                  {editing ? (
                    <ToggleSwitch
                      checked={item.isAssigned}
                      onChange={() => toggle(item.id)}
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-left-2 duration-400">
                      <span className={`text-[13px] font-bold uppercase tracking-tight ${item.isAssigned ? 'text-blue-900' : 'text-gray-300'}`}>
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

      {/* Floating save/cancel bar */}
      {editing && (
        <div className="fixed bottom-8 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={cancelEdit}
            className="flex items-center gap-2 rounded-xl bg-gray-50 px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-100 active:scale-95"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
          Loading Access Controls...
        </div>
      }
    >
      <PermissionsContent />
    </Suspense>
  );
}
