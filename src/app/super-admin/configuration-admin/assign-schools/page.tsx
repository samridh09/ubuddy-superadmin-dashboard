'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pencil, Check, X, Loader2, School as SchoolIcon } from 'lucide-react';

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
import { getConfigAdminById, updateConfigAdmin } from '@/lib/services/config-admin-service';
import { getAllSchools } from '@/lib/services/school-service';
import { toast } from 'react-toastify';

function AssignSchoolsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminId = searchParams.get('adminId');

  const [adminName, setAdminName] = useState('CONFIGURATION ADMIN');
  const [schools, setSchools] = useState<{ id: string; name: string; code: string; isAssigned: boolean }[]>([]);
  const [draft, setDraft] = useState<{ id: string; name: string; code: string; isAssigned: boolean }[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getConfigAdminById(adminId),
      getAllSchools()
    ])
      .then(([admin, allSchools]) => {
        setAdminName(admin.full_name || admin.username);
        
        const assignedIds = new Set(admin.assignedSchools?.map(s => s.id) || []);
        
        const schoolData = allSchools.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          isAssigned: assignedIds.has(s.id)
        }));
        
        setSchools(schoolData);
        setDraft(schoolData);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load data');
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  const enterEdit = () => { setDraft(schools); setEditing(true); };
  const cancelEdit = () => { setDraft(schools); setEditing(false); };

  const toggle = (id: string) => {
    setDraft((prev) => prev.map((s) => s.id === id ? { ...s, isAssigned: !s.isAssigned } : s));
  };

  const handleSave = async () => {
    if (!adminId) return;
    setSaving(true);
    try {
      const assigned_school_ids = draft.filter(s => s.isAssigned).map(s => s.id);
      await updateConfigAdmin(adminId, { assigned_school_ids });
      setSchools(draft);
      setEditing(false);
      toast.success('Schools assigned successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
        Loading School Assignments...
      </div>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Configuration Admin | Assign Schools"
        showBack
        onBack={() => router.push('/super-admin/configuration-admin')}
      />

      <FilterBox>
        <div className="flex-1 min-w-[240px] space-y-1">
          <label className="px-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-gray-400">
            Schools assigned for
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
            Edit Schools
          </SecondaryButton>
        )}
        {editing && (
          <div className="self-center text-[11px] font-bold uppercase tracking-widest text-blue-500">
            {draft.filter((s) => s.isAssigned).length} / {draft.length} assigned
          </div>
        )}
      </FilterBox>

      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[80px]" className="pl-10">S. No.</Th>
            <Th width="w-[400px]">School Name</Th>
            <Th width="w-[120px]">Code</Th>
            <Th align="center" width="w-[160px]">{editing ? 'Assigned' : 'Status'}</Th>
          </THead>
          <TBody>
            {(editing ? draft : schools).map((item, index) => (
              <Tr key={item.id} index={index}>
                <Td className="pl-10">
                  <span className="text-[13px] font-medium text-gray-400">{index + 1}</span>
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <SchoolIcon size={16} />
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight text-blue-900">{item.name}</span>
                  </div>
                </Td>
                <Td>
                  <span className="text-[13px] font-bold text-gray-600 uppercase">{item.code}</span>
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
        <div className="fixed bottom-8 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-xl">
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

export default function AssignSchoolsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
          Loading School Assignments...
        </div>
      }
    >
      <AssignSchoolsContent />
    </Suspense>
  );
}
