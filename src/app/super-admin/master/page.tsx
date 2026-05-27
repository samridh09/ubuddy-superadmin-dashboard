'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, X, BookOpen, Calendar, AlertCircle } from 'lucide-react';
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
  EmptyRow,
  SNoTh,
  Pagination,
} from '../../wireframe/ui/components/ui';
import {
  fetchGlobalSubjects,
  createGlobalSubject,
  updateGlobalSubject,
  deleteGlobalSubject,
  type GlobalSubject,
} from '@/lib/services/global-subjects-service';
import {
  fetchGlobalTerms,
  createGlobalTerm,
  updateGlobalTerm,
  deleteGlobalTerm,
  type GlobalTerm,
} from '@/lib/services/global-terms-service';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'terms',    label: 'Terms',    icon: Calendar  },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Modal types ──────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit';   id: string; name: string }
  | { type: 'delete'; id: string; name: string };


// ─── Shared modal shell ───────────────────────────────────────────────────────

function Modal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] w-full max-w-[400px] mx-4 border border-gray-100 animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-50">
          <h3 className="text-[15px] font-bold text-black tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black transition-all duration-200 active:scale-95"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-8 pb-8 pt-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Subjects panel (API-connected) ──────────────────────────────────────────

function SubjectsPanel() {
  const [subjects, setSubjects]   = useState<GlobalSubject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<ModalState>({ type: 'none' });
  const [formValue, setFormValue] = useState('');
  const [saving, setSaving]       = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [page, setPage]           = useState(1);
  const limit = 10;

  // ── Load ──
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGlobalSubjects();
      setSubjects(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived ──
  const filtered = useMemo(
    () => subjects.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [subjects, search],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated  = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page]);

  // ── Modal helpers ──
  const openCreate = ()                                   => { setFormValue(''); setApiError(null); setModal({ type: 'create' }); };
  const openEdit   = (s: GlobalSubject)                   => { setFormValue(s.name); setApiError(null); setModal({ type: 'edit', id: s.id, name: s.name }); };
  const openDelete = (s: GlobalSubject)                   => { setApiError(null); setModal({ type: 'delete', id: s.id, name: s.name }); };
  const closeModal = ()                                   => { setModal({ type: 'none' }); setApiError(null); };

  // ── Save (create / edit) ──
  const handleSave = async () => {
    const name = formValue.trim();
    if (!name) return;
    setSaving(true);
    setApiError(null);
    try {
      if (modal.type === 'create') {
        const created = await createGlobalSubject(name);
        setSubjects((p) => [created, ...p]);
      } else if (modal.type === 'edit') {
        const updated = await updateGlobalSubject(modal.id, name);
        setSubjects((p) => p.map((s) => s.id === updated.id ? updated : s));
      }
      closeModal();
    } catch (e: any) {
      setApiError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    setSaving(true);
    setApiError(null);
    try {
      await deleteGlobalSubject(modal.id);
      setSubjects((p) => p.filter((s) => s.id !== modal.id));
      closeModal();
    } catch (e: any) {
      setApiError(e.message || 'Failed to delete subject');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──
  return (
    <>
      {/* Toolbar card */}
      <FilterBox>
        <div className="relative group/search w-full max-w-[340px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-gray-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search Subjects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-all duration-200 placeholder-gray-300"
          />
        </div>
        <div className="ml-auto">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            <Plus size={15} />
            Create Subject
          </button>
        </div>
      </FilterBox>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-semibold text-red-600 animate-in fade-in duration-300">
          <AlertCircle size={16} />
          {error}
          <button onClick={load} className="ml-auto text-red-400 hover:text-red-600 underline text-[12px]">Retry</button>
        </div>
      )}

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <SNoTh />
            <Th>Subject Name</Th>
            <Th align="center" width="w-[200px]">Action</Th>
            <Th className="w-full" />
          </THead>
          <TBody>
            {loading ? (
              /* Skeleton rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="pl-12 py-10"><div className="h-4 w-6 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-8 py-10"><div className="h-4 w-40 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-8 py-10"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse mx-auto" /></td>
                  <td />
                </tr>
              ))
            ) : paginated.length > 0 ? (
              paginated.map((subject, index) => (
                <Tr key={subject.id} index={index}>
                  <Td isFirst className="py-10">{(page - 1) * limit + index + 1}</Td>
                  <Td className="py-10">
                    <span className="text-[14px] font-semibold text-black">{subject.name}</span>
                  </Td>
                  <Td align="center" className="py-10">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(subject)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 active:scale-95 transition-all duration-200"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(subject)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 active:scale-95 transition-all duration-200"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </Td>
                  <Td className="py-10" />
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={4} message="No subjects found." />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
      </DataTable>

      {/* ── Create Modal ── */}
      {modal.type === 'create' && (
        <Modal title="Create Subject" onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject Name</label>
              <input
                autoFocus
                type="text"
                placeholder="Your Subject...."
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300"
              />
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500">{apiError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formValue.trim() || saving}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === 'edit' && (
        <Modal title="Edit Subject" onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject Name</label>
              <input
                autoFocus
                type="text"
                placeholder="Your Subject...."
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300"
              />
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500">{apiError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formValue.trim() || saving}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === 'delete' && (
        <Modal title="Delete Subject" onClose={closeModal}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h4 className="text-[20px] font-black text-black tracking-tight">{modal.name}</h4>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                Are you sure you want to delete this subject?
                <span className="block mt-1.5 text-amber-500 font-bold">
                  Subjects can only be deleted when not assigned to any class &amp; session.
                </span>
              </p>
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500 text-center">{apiError}</p>}
            <div className="flex items-center gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Terms panel (API-connected) ─────────────────────────────────────────────

function TermsPanel() {
  const [terms, setTerms]         = useState<GlobalTerm[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<ModalState>({ type: 'none' });
  const [formValue, setFormValue] = useState('');
  const [saving, setSaving]       = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [page, setPage]           = useState(1);
  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGlobalTerms();
      setTerms(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered   = useMemo(() => terms.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())), [terms, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated  = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page]);

  const openCreate = () => { setFormValue(''); setApiError(null); setModal({ type: 'create' }); };
  const openEdit   = (t: GlobalTerm) => { setFormValue(t.name); setApiError(null); setModal({ type: 'edit', id: t.id, name: t.name }); };
  const openDelete = (t: GlobalTerm) => { setApiError(null); setModal({ type: 'delete', id: t.id, name: t.name }); };
  const closeModal = () => { setModal({ type: 'none' }); setApiError(null); };

  const handleSave = async () => {
    const name = formValue.trim();
    if (!name) return;
    setSaving(true);
    setApiError(null);
    try {
      if (modal.type === 'create') {
        const created = await createGlobalTerm(name);
        setTerms((p) => [created, ...p]);
      } else if (modal.type === 'edit') {
        const updated = await updateGlobalTerm(modal.id, name);
        setTerms((p) => p.map((t) => t.id === updated.id ? updated : t));
      }
      closeModal();
    } catch (e: any) {
      setApiError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    setSaving(true);
    setApiError(null);
    try {
      await deleteGlobalTerm(modal.id);
      setTerms((p) => p.filter((t) => t.id !== modal.id));
      closeModal();
    } catch (e: any) {
      setApiError(e.message || 'Failed to delete term');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FilterBox>
        <div className="relative group/search w-full max-w-[340px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-gray-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search Terms..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-all duration-200 placeholder-gray-300"
          />
        </div>
        <div className="ml-auto">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            <Plus size={15} />
            Create Term
          </button>
        </div>
      </FilterBox>

      {error && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-semibold text-red-600 animate-in fade-in duration-300">
          <AlertCircle size={16} />
          {error}
          <button onClick={load} className="ml-auto text-red-400 hover:text-red-600 underline text-[12px]">Retry</button>
        </div>
      )}

      <DataTable>
        <Table>
          <THead>
            <SNoTh />
            <Th>Term Name</Th>
            <Th align="center" width="w-[200px]">Action</Th>
            <Th className="w-full" />
          </THead>
          <TBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="pl-12 py-10"><div className="h-4 w-6 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-8 py-10"><div className="h-4 w-40 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-8 py-10"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse mx-auto" /></td>
                  <td />
                </tr>
              ))
            ) : paginated.length > 0 ? (
              paginated.map((term, index) => (
                <Tr key={term.id} index={index}>
                  <Td isFirst className="py-10">{(page - 1) * limit + index + 1}</Td>
                  <Td className="py-10"><span className="text-[14px] font-semibold text-black">{term.name}</span></Td>
                  <Td align="center" className="py-10">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(term)} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 active:scale-95 transition-all duration-200">
                        <Pencil size={13} />Edit
                      </button>
                      <button onClick={() => openDelete(term)} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 active:scale-95 transition-all duration-200">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </Td>
                  <Td className="py-10" />
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={4} message="No terms found." />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
      </DataTable>

      {/* ── Create Modal ── */}
      {modal.type === 'create' && (
        <Modal title="Create Term" onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Term Name</label>
              <input autoFocus type="text" placeholder="Your Term...." value={formValue}
                onChange={(e) => setFormValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300" />
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500">{apiError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">Cancel</button>
              <button onClick={handleSave} disabled={!formValue.trim() || saving} className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === 'edit' && (
        <Modal title="Edit Term" onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Term Name</label>
              <input autoFocus type="text" placeholder="Your Term...." value={formValue}
                onChange={(e) => setFormValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300" />
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500">{apiError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">Cancel</button>
              <button onClick={handleSave} disabled={!formValue.trim() || saving} className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === 'delete' && (
        <Modal title="Delete Term" onClose={closeModal}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h4 className="text-[20px] font-black text-black tracking-tight">{modal.name}</h4>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">Are you sure you want to delete this term?</p>
            </div>
            {apiError && <p className="text-[11px] font-semibold text-red-500 text-center">{apiError}</p>}
            <div className="flex items-center gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200">Cancel</button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 text-[13px] font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState<TabId>('subjects');

  return (
    <PageWrapper>
      <PageHeader title="Master" subtitle="Manage global subjects & terms" />

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1.5 bg-white border border-gray-100 rounded-2xl w-fit animate-in fade-in slide-in-from-top-2 duration-300">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 ${
              activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
        {activeTab === 'subjects' ? <SubjectsPanel /> : <TermsPanel />}
      </div>
    </PageWrapper>
  );
}
