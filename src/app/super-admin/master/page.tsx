'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, X, BookOpen, Calendar } from 'lucide-react';
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject {
  id: string;
  name: string;
}

interface Term {
  id: string;
  name: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'English' },
  { id: '3', name: 'Hindi' },
  { id: '4', name: 'Physics' },
  { id: '5', name: 'Chemistry' },
  { id: '6', name: 'Biology' },
  { id: '7', name: 'Social Science' },
  { id: '8', name: 'Computer Science' },
];

const INITIAL_TERMS: Term[] = [
  { id: '1', name: 'Annual Exam' },
  { id: '2', name: 'Mid Term Exam' },
  { id: '3', name: 'Half Yearly Exam' },
  { id: '4', name: 'Unit Test 1' },
  { id: '5', name: 'Unit Test 2' },
  { id: '6', name: 'Monthly Test' },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'terms',   label: 'Terms',    icon: Calendar  },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Modal types ──────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit';   id: string; name: string }
  | { type: 'delete'; id: string; name: string };

// ─── Shared inline modal ──────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
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

// ─── Generic CRUD panel (used for both Subjects & Terms) ──────────────────────

interface CrudPanelProps {
  entityLabel: string; // "Subject" | "Term"
  items: Array<{ id: string; name: string }>;
  onAdd: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

function CrudPanel({ entityLabel, items, onAdd, onEdit, onDelete }: CrudPanelProps) {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [formValue, setFormValue] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page]);

  const openCreate = () => { setFormValue(''); setModal({ type: 'create' }); };
  const openEdit   = (item: { id: string; name: string }) => { setFormValue(item.name); setModal({ type: 'edit', id: item.id, name: item.name }); };
  const openDelete = (item: { id: string; name: string }) => { setModal({ type: 'delete', id: item.id, name: item.name }); };
  const closeModal = () => setModal({ type: 'none' });

  const handleSave = () => {
    const trimmed = formValue.trim();
    if (!trimmed) return;
    if (modal.type === 'create') { onAdd(trimmed); }
    if (modal.type === 'edit')   { onEdit(modal.id, trimmed); }
    closeModal();
  };

  return (
    <>
      {/* Toolbar card */}
      <FilterBox>
        {/* Search */}
        <div className="relative group/search w-full max-w-[340px]">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-gray-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder={`Search ${entityLabel}s...`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-all duration-200 placeholder-gray-300"
          />
        </div>

        {/* Create button — pushed to the right */}
        <div className="ml-auto">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            <Plus size={15} />
            Create {entityLabel}
          </button>
        </div>
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <SNoTh />
            <Th>{entityLabel} Name</Th>
            <Th align="center" width="w-[180px]">Action</Th>
            <Th className="w-full" />
          </THead>
          <TBody>
            {paginated.length > 0 ? (
              paginated.map((item, index) => (
                <Tr key={item.id} index={index}>
                  <Td isFirst className="py-10">{(page - 1) * limit + index + 1}</Td>
                  <Td className="py-10">
                    <span className="text-[14px] font-semibold text-black">{item.name}</span>
                  </Td>
                  <Td align="center" className="py-10">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 active:scale-95 transition-all duration-200"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => openDelete(item)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 active:scale-95 transition-all duration-200"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </Td>
                  <Td />
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={4} message={`No ${entityLabel.toLowerCase()}s found.`} />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
      </DataTable>

      {/* ── Create Modal ── */}
      {modal.type === 'create' && (
        <Modal title={`Create ${entityLabel}`} onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {entityLabel} Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder={`Your ${entityLabel}....`}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formValue.trim()}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === 'edit' && (
        <Modal title={`Edit ${entityLabel}`} onClose={closeModal}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {entityLabel} Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder={`Your ${entityLabel}....`}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-400 transition-all duration-200 placeholder-gray-300"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formValue.trim()}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === 'delete' && (
        <Modal title={`Delete ${entityLabel}`} onClose={closeModal}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h4 className="text-[20px] font-black text-black tracking-tight">{modal.name}</h4>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                Are you sure you want to delete this {entityLabel.toLowerCase()}?
                {entityLabel === 'Subject' && (
                  <span className="block mt-1 text-amber-500 font-bold">
                    Subjects can only be deleted when not assigned to any class &amp; session.
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(modal.id); closeModal(); }}
                className="flex-1 py-2.5 text-[13px] font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-200"
              >
                Delete
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
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [terms,    setTerms]    = useState<Term[]>(INITIAL_TERMS);

  // Subjects CRUD
  const addSubject    = (name: string)             => setSubjects((p) => [...p, { id: Date.now().toString(), name }]);
  const editSubject   = (id: string, name: string) => setSubjects((p) => p.map((s) => s.id === id ? { ...s, name } : s));
  const deleteSubject = (id: string)               => setSubjects((p) => p.filter((s) => s.id !== id));

  // Terms CRUD
  const addTerm    = (name: string)             => setTerms((p) => [...p, { id: Date.now().toString(), name }]);
  const editTerm   = (id: string, name: string) => setTerms((p) => p.map((t) => t.id === id ? { ...t, name } : t));
  const deleteTerm = (id: string)               => setTerms((p) => p.filter((t) => t.id !== id));

  return (
    <PageWrapper>
      <PageHeader
        title="Master"
        subtitle="Manage global subjects & terms"
      />

      {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1.5 bg-white border border-gray-100 rounded-2xl w-fit animate-in fade-in slide-in-from-top-2 duration-300">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={15} />
            {label}
            {/* Count pill */}
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all duration-200 ${
                activeTab === id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {id === 'subjects' ? subjects.length : terms.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Panel ───────────────────────────────────────────────────────────── */}
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'subjects' ? (
          <CrudPanel
            entityLabel="Subject"
            items={subjects}
            onAdd={addSubject}
            onEdit={editSubject}
            onDelete={deleteSubject}
          />
        ) : (
          <CrudPanel
            entityLabel="Term"
            items={terms}
            onAdd={addTerm}
            onEdit={editTerm}
            onDelete={deleteTerm}
          />
        )}
      </div>
    </PageWrapper>
  );
}
