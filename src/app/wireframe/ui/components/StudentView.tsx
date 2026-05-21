'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, UserCheck, UserMinus, UserX, Check, Eye, Download, X, Printer, FileSpreadsheet, FileText } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { formatMobileNumber } from '@/lib/utils/staff-formatting';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  SecondaryButton, DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow, StatusBadge, Pagination, SNoTh
} from './ui';
import {
  StudentStatus, StudentDirectoryRecord,
  STUDENT_DIRECTORY_DATA, STUDENT_STATUS_DATA, STUDENT_PROMOTE_DATA,
  STUDENT_EX_DATA, STUDENT_EXPORT_FIELDS,
} from '@/mock/student.mock';
import { StudentExportModalProps, StudentViewProps, StudentViewMode } from '@/types';
import { StudentRecord } from "@/types/components/StudentView";

function exportStudentsCSV(data: StudentRecord[], fieldIds: string[]) {
  const header = fieldIds.map(f => STUDENT_EXPORT_FIELDS.find(x => x.id === f)?.label ?? f).join(',');
  const rows = data.map(s =>
    fieldIds.map(f => {
      const val = String(s[f as keyof StudentRecord] ?? '');
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `student-export-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function exportStudentsPDF(data: StudentRecord[], fieldIds: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { jsPDF } = require('jspdf');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16); doc.setTextColor(15, 23, 42);
  doc.text('Student Directory Export', 40, 30);
  doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleString()} | Total: ${data.length}`, 40, 42);
  const headers = fieldIds.map(f => STUDENT_EXPORT_FIELDS.find(x => x.id === f)?.label ?? f);
  const rows = data.map((s, i) => [i + 1, ...fieldIds.map(f => String(s[f as keyof StudentRecord] ?? ''))]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    head: [['#', ...headers]], body: rows, startY: 50,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 50, left: 40, right: 40, bottom: 40 },
  });
  doc.save(`student-export-${Date.now()}.pdf`);
}

function openStudentPrintView(data: StudentRecord[], fieldIds: string[]) {
  const win = window.open('', '_blank');
  if (!win) return;
  const headers = fieldIds.map(f => STUDENT_EXPORT_FIELDS.find(x => x.id === f)?.label ?? f);
  const headerHtml = ['#', ...headers].map(h => `<th>${h}</th>`).join('');
  const bodyHtml = data.map((s, i) =>
    `<tr>${[i + 1, ...fieldIds.map(f => String(s[f as keyof StudentRecord] ?? ''))].map(c => `<td>${c}</td>`).join('')}</tr>`
  ).join('');
  win.document.write(`<html><head><title>Student Export</title><style>
    body{font-family:Arial,sans-serif;margin:16px;color:#0f172a}
    h2{margin:0 0 8px;font-size:18px}.meta{margin-bottom:12px;font-size:12px;color:#475569}
    table{border-collapse:collapse;width:100%;font-size:12px}
    th{background:#0f172a;color:#fff;padding:8px 12px;text-align:left}
    td{padding:7px 12px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even) td{background:#f8fafc}
    @media print{body{margin:0}}
  </style></head><body>
    <h2>Student Directory Export</h2>
    <div class="meta">Generated on ${new Date().toLocaleString()} | Rows: ${data.length}</div>
    <table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>
    <script>window.onload=()=>window.print()<\/script>
  </body></html>`);
  win.document.close();
}

const StudentExportModal: React.FC<StudentExportModalProps> = ({
  isOpen, isExiting, selectedFields, isExporting,
  onClose, onExport, onFieldToggle, onSelectAll, onClearAll,
}) => {
  if (!isOpen) return null;
  const selectedCount = STUDENT_EXPORT_FIELDS.filter(f => selectedFields[f.id]).length;
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${isExiting ? 'animate-fadeOut' : 'animate-fadeIn'}`}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-2xl w-full max-w-xl flex flex-col overflow-hidden ${isExiting ? 'animate-zoomOut' : 'animate-zoomIn'}`}>
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold text-neutral-900">Export Student Data</h3>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-neutral-700">Fields to export</h4>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 font-medium">{selectedCount} selected</span>
              <div className="flex gap-2">
                <button onClick={onSelectAll} className="h-8 px-3 text-xs border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-all">Select All</button>
                <button onClick={onClearAll} className="h-8 px-3 text-xs border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-all">Clear</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STUDENT_EXPORT_FIELDS.map(field => (
              <div
                key={field.id}
                onClick={() => onFieldToggle(field.id, !selectedFields[field.id])}
                className={`flex items-center gap-3 p-2.5 border rounded-lg transition-all cursor-pointer hover:border-neutral-400 ${selectedFields[field.id] ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50/50 opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${selectedFields[field.id] ? 'bg-[#0F172A] border-[#0F172A]' : 'border-neutral-300 bg-white'}`}>
                  {selectedFields[field.id] && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={`text-[13px] font-medium truncate ${selectedFields[field.id] ? 'text-neutral-900' : 'text-neutral-400'}`}>{field.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 justify-end p-6 border-t border-neutral-100 bg-neutral-50/30 shrink-0">
          <button onClick={onClose} disabled={isExporting} className="px-5 h-10 text-[13px] font-bold text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-50">Cancel</button>
          <button onClick={() => onExport('print')} disabled={isExporting} className="flex items-center gap-2 px-5 h-10 text-[13px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all disabled:opacity-50">
            <Printer size={15} />{isExporting ? 'Preparing...' : 'Print'}
          </button>
          <button onClick={() => onExport('excel')} disabled={isExporting} className="flex items-center gap-2 px-5 h-10 text-[13px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-50">
            <FileSpreadsheet size={15} />{isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
          <button onClick={() => onExport('pdf')} disabled={isExporting} className="flex items-center gap-2 px-5 h-10 text-[13px] font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all disabled:opacity-50">
            <FileText size={15} />{isExporting ? 'Preparing...' : 'Export to PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusChip = ({ status }: { status: string }) => {
  const c: Record<string, string> = {
    Active:     'bg-blue-50 text-blue-600 border-blue-100',
    Inactive:   'bg-amber-50 text-amber-600 border-amber-100',
    Terminated: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  return (
    <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${c[status] ?? 'bg-gray-50 text-black border-gray-100'}`}>
      {status}
    </span>
  );
};

export const StudentView: React.FC<StudentViewProps> = ({
  query, statusFilter, page, limit, updateFilters, handleSort, SortIcon,
}) => {
  const router = useRouter();

  const [mode, setMode] = useState<StudentViewMode>('directory');
  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  const headerMoreRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const editingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) {
        setOpenHeaderMore(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
      if (editingMenuRef.current && !editingMenuRef.current.contains(event.target as Node)) {
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status management
  const [smData, setSmData] = useState(STUDENT_STATUS_DATA);
  const [smSearch, setSmSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Promote/Detain
  const [proData, setProData] = useState(STUDENT_PROMOTE_DATA);
  const [proSearch, setProSearch] = useState('');

  // Export
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExportModalExiting, setIsExportModalExiting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFields, setExportFields] = useState<Record<string, boolean>>(
    Object.fromEntries(STUDENT_EXPORT_FIELDS.map(f => [f.id, true]))
  );

  const handleCloseExportModal = () => {
    setIsExportModalExiting(true);
    setTimeout(() => { setShowExportModal(false); setIsExportModalExiting(false); }, 200);
  };

  const handleExport = (format: 'print' | 'pdf' | 'excel') => {
    const activeFields = STUDENT_EXPORT_FIELDS.map(f => f.id).filter(id => exportFields[id]);
    if (!activeFields.length) return;
    setIsExporting(true);
    try {
      if (format === 'excel') exportStudentsCSV(filteredDirectory, activeFields);
      else if (format === 'pdf') exportStudentsPDF(filteredDirectory, activeFields);
      else openStudentPrintView(filteredDirectory, activeFields);
      handleCloseExportModal();
    } finally {
      setIsExporting(false);
    }
  };

  // Terminate
  const [termSearch, setTermSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [terminatingStudent, setTerminatingStudent] = useState<typeof STUDENT_STATUS_DATA[0] | null>(null);
  const [termRemarks, setTermRemarks] = useState('');
  const [termError, setTermError] = useState('');

  // Ex
  const [exSearch, setExSearch] = useState('');

  const moreOptions: { label: string; action: () => void; danger?: boolean }[] = [
    { label: 'Add Student',      action: () => { setOpenHeaderMore(false); router.push('/wireframe/ui/student/add'); } },
    { label: 'Assign Section',   action: () => { setOpenHeaderMore(false); setMode('assign_section'); } },
    { label: 'Assign Roll No.',  action: () => { setOpenHeaderMore(false); setMode('assign_roll'); } },
    { label: 'Assign Subjects',  action: () => { setOpenHeaderMore(false); setMode('assign_subjects'); } },
    { label: 'Active-Inactive',  action: () => { setOpenHeaderMore(false); setMode('active_inactive'); } },
    { label: 'Promote / Detain', action: () => { setOpenHeaderMore(false); setMode('promote'); } },
    { label: 'Terminate',        action: () => { setOpenHeaderMore(false); setMode('terminate'); }, danger: true },
    { label: 'Ex Student',       action: () => { setOpenHeaderMore(false); setMode('ex'); } },
  ];

  const titles: Record<StudentViewMode, string> = {
    directory:       'Student Management',
    assign_section:  'Student Management | Assign Section',
    assign_roll:     'Student Management | Assign Roll No.',
    assign_subjects: 'Student Management | Assign Subjects',
    active_inactive: 'Student Management | Active / Inactive',
    edit:            'Student Management | Edit Profile',
    promote:         'Student Management | Promote / Detain',
    terminate:       'Student Management | Terminate',
    ex:              'Ex Student Management',
  };

  const filteredDirectory = useMemo(() => STUDENT_DIRECTORY_DATA.filter(r => {
    const q = query.toLowerCase();
    return (r.name.toLowerCase().includes(q) || r.rollNo.toLowerCase().includes(q))
      && (statusFilter === 'All' || r.status === statusFilter);
  }), [query, statusFilter]);

  const filteredSm = useMemo(() =>
    smData.filter(r => r.name.toLowerCase().includes(smSearch.toLowerCase()) || r.rollNo.toLowerCase().includes(smSearch.toLowerCase())),
    [smData, smSearch]);

  const filteredPro = useMemo(() =>
    proData.filter(r => r.name.toLowerCase().includes(proSearch.toLowerCase()) || r.rollNo.toLowerCase().includes(proSearch.toLowerCase())),
    [proData, proSearch]);

  const filteredTerm = useMemo(() =>
    STUDENT_STATUS_DATA.filter(r => r.name.toLowerCase().includes(termSearch.toLowerCase()) || r.rollNo.toLowerCase().includes(termSearch.toLowerCase())),
    [termSearch]);

  const filteredEx = useMemo(() =>
    STUDENT_EX_DATA.filter(r => r.name.toLowerCase().includes(exSearch.toLowerCase())),
    [exSearch]);

  const paginate = (data: any[]) => data.slice((page - 1) * limit, page * limit);
  const getTotalPages = (data: any[]) => Math.max(1, Math.ceil(data.length / limit));

  const paginatedDirectory = paginate(filteredDirectory);
  const paginatedSm = paginate(filteredSm);
  const paginatedPro = paginate(filteredPro);
  const paginatedTerm = paginate(filteredTerm);
  const paginatedEx = paginate(filteredEx);

  const updateStatus = (id: number, s: StudentStatus) => {
    setSmData(prev => prev.map(r => r.id === id ? { ...r, status: s } : r));
    setEditingId(null);
  };

  const updateDecision = (id: number, d: 'Promote' | 'Detain') => {
    setProData(prev => prev.map(r => r.id === id ? { ...r, decision: d } : r));
  };

  const onConfirmTermination = () => {
    if (!termRemarks.trim()) { setTermError('Remarks required'); return; }
    setMode('directory');
    setConfirmOpen(false);
    setTerminatingStudent(null);
    setTermRemarks('');
    setTermError('');
  };

  const SimpleSearchBox = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
    <div className="space-y-1 w-[300px]">
      <label className="text-[10px] font-bold text-black uppercase tracking-[0.05em] px-0.5">Search Student</label>
      <div className="relative group/search">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-blue-500 transition-colors" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-black focus:outline-none focus:border-blue-500 transition-all placeholder-gray-200" />
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <PageHeader
        title={titles[mode]}
        actions={
          <div className="flex items-center gap-3">
            {mode !== 'directory' && (
              <button
                onClick={() => setMode('directory')}
                className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold rounded-xl bg-white border-2 border-gray-100 text-black hover:border-gray-300 active:scale-95 transition-all"
              >
                ← Back to Directory
              </button>
            )}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-5 h-11 text-[13px] font-bold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
            >
              <Download size={16} />
              Export
            </button>
            <div className="relative" ref={headerMoreRef}>
              <SecondaryButton
                onClick={() => setOpenHeaderMore(!openHeaderMore)}
                className="pr-4"
              >
                More
                <ChevronDown size={15} strokeWidth={2.5} className={`transition-transform duration-300 ${openHeaderMore ? 'rotate-180' : ''}`} />
              </SecondaryButton>
              {openHeaderMore && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[210px] bg-white border border-gray-100 rounded-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
                  <div className="py-2">
                    {moreOptions.map((opt, i) => (
                      <React.Fragment key={opt.label}>
                        {i === 7 && <div className="h-px bg-gray-100 mx-3 my-1" />}
                        <button
                          onClick={opt.action}
                          className={`w-full text-left px-5 py-2.5 text-[12px] font-bold hover:bg-neutral-50 transition-colors uppercase tracking-wide active:bg-neutral-100 ${opt.danger ? 'text-red-500' : 'text-gray-700'}`}
                        >
                          {opt.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* ── DIRECTORY ─────────────────────────────────────────────────────── */}
      {mode === 'directory' && (
        <>
          <FilterBox>
            <div className="w-[200px]">
              <CustomSelect
                label="Status"
                value={statusFilter}
                options={['All', 'Active', 'Inactive']}
                onChange={val => updateFilters('status', val)}
                isSmall
              />
            </div>
            <div className="flex-1" />
            <SearchInput
              label="Search Student"
              placeholder="student name, scholar number"
              value={query}
              onChange={val => updateFilters('query', val)}
            />
          </FilterBox>

          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[200px]" sortKey="name"          onSort={handleSort}>Student Name       <SortIcon columnKey="name" /></Th>
                <Th width="w-[100px]" sortKey="class"         onSort={handleSort}>Class              <SortIcon columnKey="class" /></Th>
                <Th width="w-[100px]" sortKey="section"       onSort={handleSort}>Section            <SortIcon columnKey="section" /></Th>
                <Th width="w-[140px]" sortKey="rollNo"        onSort={handleSort}>Roll No.           <SortIcon columnKey="rollNo" /></Th>
                <Th width="w-[100px]" sortKey="gender"        onSort={handleSort}>Gender             <SortIcon columnKey="gender" /></Th>
                <Th                   sortKey="contactNumber" onSort={handleSort}>Contact Number     <SortIcon columnKey="contactNumber" /></Th>
                <Th width="w-[200px]" sortKey="status"        onSort={handleSort} align="center">Profile Status <SortIcon columnKey="status" /></Th>
                <Th width="w-[240px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedDirectory.length > 0 ? paginatedDirectory.map((row, index) => (
                  <Tr key={row.id} index={index} className={openActionId === row.id ? 'relative z-50' : ''}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-semibold text-black tracking-tight">{row.name}</span></Td>
                    <Td>{row.class}</Td>
                    <Td>{row.section}</Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.gender}</Td>
                    <Td>{formatMobileNumber(row.contactNumber)}</Td>
                    <Td align="center"><StatusBadge status={row.status} /></Td>
                    <Td align="right" className="pr-12">
                      <button className="inline-flex items-center gap-2 px-6 py-2 w-[160px] justify-center text-[12px] font-bold text-black bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95 group">
                        <Eye size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-black" />
                        View Profile
                      </button>
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={7} message="No students matched your search." />
                )}
              </TBody>
            </Table>
            <Pagination 
              currentPage={page} 
              totalPages={getTotalPages(filteredDirectory)} 
              total={filteredDirectory.length}
              onPageChange={p => updateFilters('page', String(p))} 
            />
          </DataTable>
        </>
      )}

      {/* ── ASSIGN SECTION ────────────────────────────────────────────────── */}
      {mode === 'assign_section' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={smSearch} onChange={setSmSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[140px]">Current Class</Th>
                <Th>Assign Section</Th>
                <Th width="w-[140px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedSm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td>
                      <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] font-bold text-black focus:outline-none focus:border-blue-500 transition-all">
                        <option>10-A</option>
                        <option>10-B</option>
                        <option>9-A</option>
                        <option>9-B</option>
                      </select>
                    </Td>
                    <Td align="right" className="pr-10">
                      <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all">
                        Assign
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredSm)} total={filteredSm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── ASSIGN ROLL NO. ───────────────────────────────────────────────── */}
      {mode === 'assign_roll' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={smSearch} onChange={setSmSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Current Roll No.</Th>
                <Th width="w-[120px]">Class</Th>
                <Th>New Roll No.</Th>
                <Th width="w-[140px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedSm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td>
                      <input
                        type="text"
                        defaultValue={row.rollNo}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] font-bold text-black focus:outline-none focus:border-blue-500 transition-all w-[120px]"
                      />
                    </Td>
                    <Td align="right" className="pr-10">
                      <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all">
                        Save
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredSm)} total={filteredSm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── ASSIGN SUBJECTS ───────────────────────────────────────────────── */}
      {mode === 'assign_subjects' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={smSearch} onChange={setSmSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[120px]">Class</Th>
                <Th>Subjects Assigned</Th>
                <Th width="w-[160px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedSm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {['Math', 'Science', 'English'].map(s => (
                          <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wide">{s}</span>
                        ))}
                      </div>
                    </Td>
                    <Td align="right" className="pr-10">
                      <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-white border-gray-200 text-black hover:border-blue-400 active:scale-95 transition-all">
                        Manage
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredSm)} total={filteredSm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── ACTIVE / INACTIVE ─────────────────────────────────────────────── */}
      {mode === 'active_inactive' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={smSearch} onChange={setSmSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[120px]">Class</Th>
                <Th width="w-[140px]" align="center">Status</Th>
                <Th width="w-[140px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedSm.map((row, index) => (
                  <Tr key={row.id} index={index} className={editingId === row.id ? 'relative z-50' : ''}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td align="center"><StatusChip status={row.status} /></Td>
                    <Td align="right" className="relative overflow-visible pr-10">
                      <button
                        onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 ${editingId === row.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-black hover:border-blue-400'}`}
                      >
                        Change
                      </button>
                      {editingId === row.id && (
                        <div ref={editingMenuRef} className="absolute right-8 top-[calc(100%+4px)] w-[200px] bg-blue-600 rounded-2xl p-2 z-[200] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-1">Select New Status</p>
                          {(['Active', 'Inactive'] as const).map((s, i) => {
                            const icons = [
                              <UserCheck key={0} size={14} className="text-blue-300" />,
                              <UserMinus key={1} size={14} className="text-amber-400" />,
                            ];
                            return (
                              <button key={s} onClick={() => updateStatus(row.id, s)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-bold text-white hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2">{icons[i]}{s}</div>
                                {row.status === s && <Check size={12} strokeWidth={4} className="text-white/60" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredSm)} total={filteredSm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── EDIT PROFILE ──────────────────────────────────────────────────── */}
      {mode === 'edit' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={smSearch} onChange={setSmSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[120px]">Class</Th>
                <Th width="w-[140px]" align="center">Status</Th>
                <Th width="w-[160px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedSm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td align="center"><StatusChip status={row.status} /></Td>
                    <Td align="right" className="pr-10">
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl border-2 bg-white border-gray-100 text-black hover:border-blue-400 hover:bg-blue-50/50 active:scale-95 transition-all">
                        Edit Profile
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredSm)} total={filteredSm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── PROMOTE / DETAIN ──────────────────────────────────────────────── */}
      {mode === 'promote' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={proSearch} onChange={setProSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[200px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[140px]">Current Class</Th>
                <Th width="w-[120px]" align="center">Result</Th>
                <Th width="w-[200px]" align="center">Decision</Th>
                <Th width="w-[140px]" align="right">Action</Th>
              </THead>
              <TBody>
                {paginatedPro.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.currentClass}</Td>
                    <Td align="center">
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${row.result === 'Pass' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {row.result}
                      </span>
                    </Td>
                    <Td align="center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateDecision(row.id, 'Promote')}
                          className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 ${row.decision === 'Promote' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-100 text-black hover:border-emerald-300'}`}
                        >
                          Promote
                        </button>
                        <button
                          onClick={() => updateDecision(row.id, 'Detain')}
                          className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 ${row.decision === 'Detain' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-100 text-black hover:border-amber-300'}`}
                        >
                          Detain
                        </button>
                      </div>
                    </Td>
                    <Td align="right" className="pr-10">
                      <button
                        disabled={!row.decision}
                        className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredPro)} total={filteredPro.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}

      {/* ── TERMINATE ─────────────────────────────────────────────────────── */}
      {mode === 'terminate' && (
        <>
          <FilterBox>
            <SimpleSearchBox value={termSearch} onChange={setTermSearch} placeholder="Search by name or roll no..." />
          </FilterBox>
          <DataTable>
            <Table fixed>
              <THead>
                <SNoTh />
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[140px]">Roll No.</Th>
                <Th width="w-[120px]">Class</Th>
                <Th width="w-[140px]" align="center">Status</Th>
                <Th width="w-[180px]" align="right" className="pr-10">Action</Th>
              </THead>
              <TBody>
                {paginatedTerm.length > 0 ? paginatedTerm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-bold tracking-tight text-black">{row.name}</span></Td>
                    <Td>{row.rollNo}</Td>
                    <Td>{row.class}</Td>
                    <Td align="center"><StatusChip status={row.status} /></Td>
                    <Td align="right" className="pr-10">
                      {row.status === 'Inactive' ? (
                        <button
                          onClick={() => { setTerminatingStudent(row); setConfirmOpen(true); }}
                          className="text-red-500 text-[12px] font-bold uppercase tracking-widest hover:underline active:scale-95 transition-all"
                        >
                          Terminate
                        </button>
                      ) : (
                        <span className="text-gray-300 text-[11px] font-bold uppercase tracking-widest">
                          Make inactive first
                        </span>
                      )}
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={6} message="No students matched your search." />
                )}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredTerm)} total={filteredTerm.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>

          {confirmOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-950/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[32px] p-10 w-[420px] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
                  <UserX size={40} strokeWidth={2} />
                </div>
                <div className="w-full text-left space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-black uppercase tracking-[0.05em] px-0.5 flex justify-between">
                    <span>Termination Remarks *</span>
                    {termError && <span className="text-red-500 normal-case italic font-normal tracking-normal">{termError}</span>}
                  </label>
                  <textarea
                    value={termRemarks}
                    onChange={e => { setTermRemarks(e.target.value); if (e.target.value) setTermError(''); }}
                    placeholder="Enter reason for termination..."
                    className={`w-full h-28 bg-gray-50 border ${termError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 text-[13px] font-medium text-black focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none`}
                  />
                  <p className="text-[11px] text-black font-medium italic">Terminating: <span className="text-black font-bold not-italic">{terminatingStudent?.name}</span></p>
                </div>
                <div className="flex flex-col w-full gap-3">
                  <button onClick={onConfirmTermination} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all">
                    Yes, Terminate
                  </button>
                  <button onClick={() => { setConfirmOpen(false); setTerminatingStudent(null); setTermRemarks(''); setTermError(''); }} className="w-full py-4 bg-gray-50 text-black rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EX STUDENT ────────────────────────────────────────────────────── */}
      {mode === 'ex' && (
        <>
          <FilterBox>
            <SearchInput
              label="Search Ex Student"
              placeholder="type student name....."
              value={exSearch}
              onChange={setExSearch}
              width="w-full max-w-[340px]"
            />
          </FilterBox>
          <DataTable>
            <Table>
              <THead>
                <SNoTh />
                <Th width="w-[200px]">Name</Th>
                <Th>Admitted On</Th>
                <Th>Terminated On</Th>
                <Th>Terminated By</Th>
                <Th width="w-[220px]" align="right">Actions</Th>
              </THead>
              <TBody>
                {paginatedEx.length > 0 ? paginatedEx.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst>{(page - 1) * limit + index + 1}</Td>
                    <Td><span className="text-[13px] font-semibold text-black tracking-tight">{row.name}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-black">{row.admittedOn}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-red-500">{row.terminatedOn}</span></Td>
                    <Td>{row.terminatedBy}</Td>
                    <Td align="right" className="pr-10">
                      <button
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] font-bold text-black uppercase tracking-widest bg-white border-2 border-gray-100 rounded-xl hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all active:scale-95 whitespace-nowrap group/btn"
                      >
                        <Eye size={14} className="text-gray-300 group-hover/btn:text-blue-600 transition-colors" />
                        View Profile
                      </button>
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={6} message="No ex-students found." />
                )}
              </TBody>
            </Table>
            <Pagination currentPage={page} totalPages={getTotalPages(filteredEx)} total={filteredEx.length} onPageChange={p => updateFilters('page', String(p))} />
          </DataTable>
        </>
      )}
      <StudentExportModal
        isOpen={showExportModal}
        isExiting={isExportModalExiting}
        selectedFields={exportFields}
        isExporting={isExporting}
        onClose={handleCloseExportModal}
        onExport={handleExport}
        onFieldToggle={(id, checked) => setExportFields(prev => ({ ...prev, [id]: checked }))}
        onSelectAll={() => setExportFields(Object.fromEntries(STUDENT_EXPORT_FIELDS.map(f => [f.id, true])))}
        onClearAll={() => setExportFields(Object.fromEntries(STUDENT_EXPORT_FIELDS.map(f => [f.id, false])))}
      />
    </PageWrapper>
  );
};
