'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, UserCheck, UserMinus, UserX, Check, X, Eye, Loader2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  SecondaryButton, DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow, StatusBadge, CapacityBadge, ErrorBanner,
} from './ui';
import { API_ENDPOINTS } from '@/lib/api';
import apiClient from '@/lib/axios';

import {
  SubAdminMode,
  SubAdminDisplayStatus,
  SubAdminApiStatus,
  SubAdminRecord,
  SubAdminDirectoryRow,
  SubAdminStatusRow,
  SubAdminViewProps,
} from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDisplayStatus(s: SubAdminApiStatus | string | undefined): SubAdminDisplayStatus {
  if (s === 'ACTIVE')     return 'Active';
  if (s === 'INACTIVE')   return 'Inactive';
  if (s === 'TERMINATED') return 'Terminated';
  return 'Active';
}

function toApiStatus(s: SubAdminDisplayStatus): SubAdminApiStatus {
  if (s === 'Active')   return 'ACTIVE';
  if (s === 'Inactive') return 'INACTIVE';
  return 'TERMINATED';
}

function formatRole(role: string): string {
  if (role === 'SCHOOL_ADMIN')     return 'School Admin';
  if (role === 'SCHOOL_SUB_ADMIN') return 'Sub Admin';
  return role;
}

function formatPhone(val: string | null): string {
  if (!val) return '—';
  const d = val.replace(/\D/g, '');
  if (d.length !== 10) return val;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatLoginTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  let h      = d.getHours();
  const min  = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${dd}/${mm}/${yyyy} ${h}:${min}${ampm}`;
}

function calculateDuration(loginIso: string | null, logoutIso: string | null): string {
  if (!loginIso) return '—';
  const loginDate = new Date(loginIso);
  const logoutDate = logoutIso ? new Date(logoutIso) : null;
  
  if (!logoutDate || logoutDate.getTime() < loginDate.getTime()) {
    return 'In Progress';
  }

  const diffMs = logoutDate.getTime() - loginDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.length > 0 ? parts.join(' ') : '< 1m';
}

function toDirectoryRow(a: SubAdminRecord): SubAdminDirectoryRow {
  return {
    id:         a.id,
    name:       (a.profile?.name ?? a.username ?? '').toUpperCase(),
    contact:    a.profile?.mobileNumber ?? '—',
    status:     toDisplayStatus(a.status),
    lastLogin:  formatLoginTime(a.last_login),
    lastLogout: formatLoginTime(a.last_logout),
    duration:   calculateDuration(a.last_login, a.last_logout),
    _raw:       a,
  };
}

function toStatusRow(a: SubAdminRecord): SubAdminStatusRow {
  return {
    id:         a.id,
    name:       (a.profile?.name ?? a.username ?? '').toUpperCase(),
    username:   a.username ?? '—',
    employeeId: (a.id ?? '').slice(0, 8).toUpperCase(),
    role:       formatRole(a.role ?? ''),
    status:     toDisplayStatus(a.status),
    _raw:       a,
  };
}

async function patchAdminStatus(schoolId: string, adminId: string, status: SubAdminApiStatus): Promise<SubAdminRecord> {
  const { data: json } = await apiClient.patch(API_ENDPOINTS.schoolAdmins.status(schoolId, adminId), { status });
  if (!json.success) throw new Error(json.message || 'Failed to update status');
  return json.data as SubAdminRecord;
}


const StatusChip = ({ status }: { status: string }) => {
  const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const c: Record<string, string> = {
    Active:     'bg-emerald-50 text-emerald-600 border-emerald-100',
    Inactive:   'bg-amber-50 text-amber-600 border-amber-100',
    Terminated: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  return (
    <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${c[normalizedStatus] ?? 'bg-gray-50 text-gray-400 border-gray-100'}`}>
      {status}
    </span>
  );
};

export const SubAdminView: React.FC<SubAdminViewProps> = ({
  query, statusFilter, updateFilters, handleSort, SortIcon,
}) => {
  const router = useRouter();

  const [mode, setMode]                   = useState<SubAdminMode>('directory');
  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [openActionId, setOpenActionId]   = useState<string | null>(null);

  const headerMoreRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) {
        setOpenHeaderMore(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── API data ─────────────────────────────────────────────────────────────
  const [apiAdmins, setApiAdmins]         = useState<SubAdminRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [fetchError, setFetchError]       = useState('');

  useEffect(() => {
    const schoolId = typeof window !== 'undefined' ? localStorage.getItem('schoolId') : null;
    if (!schoolId) { setLoadingAdmins(false); setFetchError('School ID not found. Please log in again.'); return; }
    apiClient.get(API_ENDPOINTS.schoolAdmins.base(schoolId))
      .then(({ data: json }) => {
        if (json.success) setApiAdmins((json.data?.data || json.data) as SubAdminRecord[]);
        else setFetchError(json.message || 'Failed to load sub-admins.');
      })
      .catch((err: any) => setFetchError(err.message || 'Network error. Check connection and try again.'))
      .finally(() => setLoadingAdmins(false));
  }, []);

  const directoryRows = useMemo(() => apiAdmins.map(toDirectoryRow), [apiAdmins]);
  const statusRows    = useMemo(() => apiAdmins.map(toStatusRow),    [apiAdmins]);

  const updateAdminInState = useCallback((updated: SubAdminRecord) => {
    setApiAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
  }, []);

  // ─── Status mode state ────────────────────────────────────────────────────
  const [smSearch, setSmSearch]     = useState('');
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [smApiError, setSmApiError] = useState('');

  const updateStatus = async (id: string, s: SubAdminDisplayStatus) => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) { setSmApiError('School ID not found. Please log in again.'); return; }
    setEditingId(null);
    setUpdatingId(id);
    setSmApiError('');
    try {
      const updated = await patchAdminStatus(schoolId, id, toApiStatus(s));
      updateAdminInState(updated);
    } catch (err: unknown) {
      setSmApiError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Terminate mode state ─────────────────────────────────────────────────
  const [termSearch, setTermSearch]               = useState('');
  const [confirmOpen, setConfirmOpen]             = useState(false);
  const [termRemarks, setTermRemarks]             = useState('');
  const [terminatingAdmin, setTerminatingAdmin]   = useState<SubAdminStatusRow | null>(null);
  const [termError, setTermError]                 = useState('');
  const [termLoading, setTermLoading]             = useState(false);

  const onConfirmTermination = async () => {
    if (!termRemarks.trim()) { setTermError('Remarks are required.'); return; }
    if (!terminatingAdmin)   return;
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) { setTermError('School ID not found. Please log in again.'); return; }
    setTermLoading(true);
    setTermError('');
    try {
      const updated = await patchAdminStatus(schoolId, terminatingAdmin.id, 'TERMINATED');
      updateAdminInState(updated);
      setConfirmOpen(false);
      setTerminatingAdmin(null);
      setTermRemarks('');
    } catch (err: unknown) {
      setTermError(err instanceof Error ? err.message : 'Termination failed. Please try again.');
    } finally {
      setTermLoading(false);
    }
  };

  const closeTerminateModal = () => {
    if (termLoading) return;
    setConfirmOpen(false);
    setTerminatingAdmin(null);
    setTermRemarks('');
    setTermError('');
  };

  // ─── Ex mode state ────────────────────────────────────────────────────────
  const [exSearch, setExSearch] = useState('');

  // ─── Header More dropdown ─────────────────────────────────────────────────
  const moreOptions: { label: string; action: () => void }[] = [
    { label: 'New Sub Admin',    action: () => { setOpenHeaderMore(false); router.push('/dashboard/schooladmin/sub-admin/create'); } },
    { label: 'Active / Inactive', action: () => { setOpenHeaderMore(false); setMode('status'); } },
    { label: 'Terminate',        action: () => { setOpenHeaderMore(false); setMode('terminate'); } },
    { label: 'Ex Sub-Admin',     action: () => { setOpenHeaderMore(false); setMode('ex'); } },
  ];

  const titles: Record<SubAdminMode, string> = {
    directory: 'Sub-Admin Management',
    status:    'Sub Admin Management | Active / Inactive',
    terminate: 'Sub Admin Management | Terminate',
    ex:        'Ex Sub-Admin Management',
  };

  const filteredDirectory = useMemo(() => directoryRows.filter(r => {
    if (r.status === 'Terminated') return false;
    const q = query.toLowerCase();
    return (r.name.toLowerCase().includes(q) || r.contact.toLowerCase().includes(q))
      && (statusFilter === 'All' || r.status === statusFilter);
  }), [directoryRows, query, statusFilter]);

  const filteredSm = useMemo(() =>
    statusRows.filter(r =>
      r.status !== 'Terminated' && (
        r.name.toLowerCase().includes(smSearch.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(smSearch.toLowerCase())
      )
    ), [statusRows, smSearch]);

  // Only INACTIVE admins can be terminated
  const filteredTerm = useMemo(() =>
    statusRows.filter(r =>
      r.status === 'Inactive' && (
        r.name.toLowerCase().includes(termSearch.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(termSearch.toLowerCase())
      )
    ), [statusRows, termSearch]);

  const filteredEx = useMemo(() =>
    apiAdmins
      .filter(a => a.status === 'TERMINATED')
      .map(a => ({
        id:           a.id,
        name:         (a.profile?.name ?? a.username ?? '').toUpperCase(),
        createdOn:    a.profile?.createdAt ? formatLoginTime(a.profile.createdAt) : '—',
        createdBy:    '—',
        terminatedOn: '—',
        terminatedBy: '—',
      }))
      .filter(r => r.name.toLowerCase().includes(exSearch.toLowerCase())),
    [apiAdmins, exSearch]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <PageHeader
        title={titles[mode]}
        actions={
          <div className="flex items-center gap-3">
            {mode === 'directory' && <CapacityBadge used={apiAdmins.length} total={apiAdmins.length} />}
            {mode !== 'directory' && (
              <button
                onClick={() => setMode('directory')}
                className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold rounded-xl bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-300 active:scale-95 transition-all"
              >
                ← Back to Directory
              </button>
            )}
            <div className="relative" ref={headerMoreRef}>
              <SecondaryButton
                onClick={() => setOpenHeaderMore(!openHeaderMore)}
                className="pr-4"
              >
                More
                <ChevronDown size={15} strokeWidth={2.5} className={`transition-transform duration-300 ${openHeaderMore ? 'rotate-180' : ''}`} />
              </SecondaryButton>
              {openHeaderMore && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-gray-100 rounded-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
                  <div className="py-2">
                    {moreOptions.map((opt, i) => (
                      <React.Fragment key={opt.label}>
                        {i > 0 && <div className="h-px bg-gray-50 mx-3" />}
                        <button
                          onClick={opt.action}
                          className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors uppercase tracking-wide active:bg-neutral-100"
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
              label="Search Sub Admin"
              placeholder="type sub admin name....."
              value={query}
              onChange={val => updateFilters('query', val)}
            />
          </FilterBox>

          {fetchError && <ErrorBanner message={fetchError} onDismiss={() => setFetchError('')} />}

          <DataTable>
            <Table className="whitespace-nowrap">
              <THead>
                <Th width="w-[80px]"  sortKey="id"         onSort={handleSort} isFirst>S. No.        <SortIcon columnKey="id" /></Th>
                <Th width="w-[220px]" sortKey="name"       onSort={handleSort}>Name               <SortIcon columnKey="name" /></Th>
                <Th width="w-[160px]" sortKey="contact"    onSort={handleSort}>Contact            <SortIcon columnKey="contact" /></Th>
                <Th width="w-[120px]" sortKey="status"     onSort={handleSort} align="center">Status <SortIcon columnKey="status" /></Th>
                <Th width="w-[160px]" sortKey="lastLogin"  onSort={handleSort}>Last Login          <SortIcon columnKey="lastLogin" /></Th>
                <Th width="w-[160px]" sortKey="lastLogout" onSort={handleSort}>Last Logout         <SortIcon columnKey="lastLogout" /></Th>
                <Th width="w-[120px]" sortKey="duration"   onSort={handleSort}>Duration            <SortIcon columnKey="duration" /></Th>
                <Th width="w-[120px]" align="right">Actions</Th>
              </THead>
              <TBody>
                {loadingAdmins ? (
                  <tr><td colSpan={8} className="px-8 py-16 text-center text-[12px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Loading...</td></tr>
                ) : filteredDirectory.length > 0 ? filteredDirectory.map((row, index) => (
                  <Tr key={row.id} index={index} className={openActionId === row.id ? 'relative z-50' : ''}>
                    <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{index + 1}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-black tracking-tight">{row.name}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-600">{formatPhone(row.contact)}</span></Td>
                    <Td align="center"><StatusBadge status={row.status} /></Td>
                    <Td><span className="text-[12px] font-semibold text-gray-600">{row.lastLogin}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-gray-400">{row.lastLogout}</span></Td>
                    <Td>
                      <span className={`text-[12px] font-semibold ${row.duration !== '—' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {row.duration}
                      </span>
                    </Td>
                    <Td align="right" className="relative overflow-visible pr-10">
                      <button
                        onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                        className={`inline-flex items-center justify-between w-[110px] px-5 py-2 text-[12px] font-bold rounded-xl border-2 transition-all duration-300 active:scale-95 cursor-pointer ${openActionId === row.id ? 'bg-white text-gray-700 border-gray-300' : 'bg-white text-blue-900 border-gray-100 hover:border-gray-200'}`}
                      >
                        More
                        <ChevronDown size={13} className={`transition-transform duration-300 ${openActionId === row.id ? 'rotate-180 text-gray-500' : 'text-gray-300'}`} />
                      </button>
                      {openActionId === row.id && (
                        <div ref={actionMenuRef} className={`absolute right-0 ${index >= filteredDirectory.length - 2 ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} w-[180px] bg-white border border-gray-100 rounded-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl`}>
                          <div className="py-2">
                            <button onClick={() => { setOpenActionId(null); router.push(`/dashboard/schooladmin/sub-admin/profile?adminId=${row.id}`); }} className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors uppercase tracking-wide">View Profile</button>
                            {row.status !== 'Terminated' && (
                              <>
                                <div className="h-px bg-gray-50 mx-3" />
                                <button onClick={() => { setOpenActionId(null); router.push(`/dashboard/schooladmin/sub-admin/permissions?adminId=${row.id}`); }} className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors uppercase tracking-wide">Permissions</button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={8} message="No sub-admins matched your search." />
                )}
              </TBody>
            </Table>
          </DataTable>
        </>
      )}

      {/* ── STATUS MANAGEMENT (Active / Inactive only) ────────────────────── */}
      {mode === 'status' && (
        <>
          <FilterBox>
            <div className="space-y-1 w-[300px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Search Sub Admin</label>
              <div className="relative group/search">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-blue-500 transition-colors" />
                <input type="text" value={smSearch} onChange={e => setSmSearch(e.target.value)} placeholder="Search by name or ID..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-200" />
              </div>
            </div>
          </FilterBox>

          {smApiError && <ErrorBanner message={smApiError} onDismiss={() => setSmApiError('')} />}

          <DataTable>
            <Table className="whitespace-nowrap">
              <THead>
                <Th width="w-[60px]"  isFirst>S. No.</Th>
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[160px]">Username</Th>
                <Th width="w-[180px]">Role</Th>
                <Th width="w-[140px]" align="center">Status</Th>
                <Th align="right">Action</Th>
              </THead>
              <TBody>
                {loadingAdmins ? (
                  <tr><td colSpan={6} className="px-8 py-16 text-center text-[12px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Loading...</td></tr>
                ) : filteredSm.length > 0 ? filteredSm.map((row, index) => (
                  <Tr key={row.id} index={index} className={editingId === row.id ? 'relative z-50' : ''}>
                    <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{index + 1}</span></Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-500">{row.username}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-500">{row.role}</span></Td>
                    <Td align="center">
                      {updatingId === row.id
                        ? <div className="flex justify-center"><Loader2 size={16} className="animate-spin text-blue-400" /></div>
                        : <StatusChip status={row.status} />
                      }
                    </Td>
                    <Td align="right" className="relative overflow-visible pr-10">
                      <button
                        disabled={updatingId === row.id}
                        onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${editingId === row.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-blue-900 hover:border-blue-400'}`}
                      >
                        Change
                      </button>
                      {editingId === row.id && (
                        <div ref={statusMenuRef} className="absolute right-8 top-[calc(100%+4px)] w-[190px] bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-2 border-b border-gray-50">Select Status</p>
                          <div className="py-1.5">
                            <button onClick={() => updateStatus(row.id, 'Active')} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group/opt">
                              <div className="flex items-center gap-2.5">
                                <UserCheck size={14} className="text-blue-400 group-hover/opt:text-blue-500" />
                                Active
                              </div>
                              {row.status === 'Active' && <Check size={12} strokeWidth={4} className="text-blue-500" />}
                            </button>
                            <div className="h-px bg-gray-50 mx-3" />
                            <button onClick={() => updateStatus(row.id, 'Inactive')} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors group/opt">
                              <div className="flex items-center gap-2.5">
                                <UserMinus size={14} className="text-amber-400 group-hover/opt:text-amber-500" />
                                Inactive
                              </div>
                              {row.status === 'Inactive' && <Check size={12} strokeWidth={4} className="text-amber-500" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={6} message="No sub-admins found." />
                )}
              </TBody>
            </Table>
          </DataTable>
        </>
      )}

      {/* ── TERMINATE (inactive only) ─────────────────────────────────────── */}
      {mode === 'terminate' && (
        <>
          <FilterBox>
            <div className="space-y-1 w-[300px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">Search Inactive Sub Admin</label>
              <div className="relative group/search">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-blue-500 transition-colors" />
                <input type="text" value={termSearch} onChange={e => setTermSearch(e.target.value)} placeholder="Search by name or ID..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-blue-900 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-200" />
              </div>
            </div>
            <div className="px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-bold text-amber-600 uppercase tracking-widest self-end">
              Only inactive sub-admins can be terminated
            </div>
          </FilterBox>

          <DataTable>
            <Table className="whitespace-nowrap">
              <THead>
                <Th width="w-[60px]"  isFirst>S. No.</Th>
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[160px]">Username</Th>
                <Th width="w-[120px]">ID</Th>
                <Th>Role</Th>
                <Th width="w-[120px]" align="center">Status</Th>
                <Th width="w-[160px]" align="right" className="pr-10">Action</Th>
              </THead>
              <TBody>
                {loadingAdmins ? (
                  <tr><td colSpan={7} className="px-8 py-16 text-center text-[12px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Loading...</td></tr>
                ) : filteredTerm.length > 0 ? filteredTerm.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{index + 1}</span></Td>
                    <Td><span className="text-[13px] font-bold text-black">{row.name}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-500">{row.username}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-500 uppercase tracking-tight">{row.employeeId}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-gray-500">{row.role}</span></Td>
                    <Td align="center"><StatusChip status={row.status} /></Td>
                    <Td align="right" className="pr-10">
                      <button
                        onClick={() => { setTerminatingAdmin(row); setConfirmOpen(true); }}
                        className="text-red-500 text-[12px] font-bold uppercase tracking-widest hover:underline active:scale-95 transition-all"
                      >
                        Terminate
                      </button>
                    </Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={7} message="No inactive sub-admins found. Make a sub-admin inactive first." />
                )}
              </TBody>
            </Table>
          </DataTable>

          {/* Termination confirm modal */}
          {confirmOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-950/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[32px] p-10 w-[420px] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
                  <UserX size={40} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-6 tracking-tight">Confirm Termination</h3>
                <div className="w-full text-left space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5 flex justify-between">
                    <span>Termination Remarks *</span>
                    {termError && <span className="text-red-500 normal-case italic font-normal tracking-normal">{termError}</span>}
                  </label>
                  <textarea
                    value={termRemarks}
                    onChange={e => { setTermRemarks(e.target.value); if (e.target.value) setTermError(''); }}
                    placeholder="Enter reason for termination..."
                    disabled={termLoading}
                    className={`w-full h-28 bg-gray-50 border ${termError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 text-[13px] font-medium text-blue-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none disabled:opacity-60`}
                  />
                  <p className="text-[11px] text-gray-400 font-medium italic">
                    Terminating: <span className="text-blue-900 font-bold not-italic">{terminatingAdmin?.name}</span>
                  </p>
                </div>
                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={onConfirmTermination}
                    disabled={termLoading}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {termLoading
                      ? <><Loader2 size={16} className="animate-spin" />Terminating...</>
                      : 'Yes, Terminate'
                    }
                  </button>
                  <button
                    onClick={closeTerminateModal}
                    disabled={termLoading}
                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EX SUB-ADMIN ──────────────────────────────────────────────────── */}
      {mode === 'ex' && (
        <>
          <FilterBox>
            <SearchInput
              label="Search Ex Sub Admin"
              placeholder="type sub admin name....."
              value={exSearch}
              onChange={setExSearch}
              width="w-full max-w-[340px]"
            />
          </FilterBox>

          <DataTable>
            <Table className="whitespace-nowrap !w-auto">
              <THead>
                <Th width="w-[80px]" isFirst>S. No.</Th>
                <Th width="w-[220px]">Name</Th>
                <Th width="w-[180px]">Created on</Th>
                <Th width="w-[180px]">Created by</Th>
                <Th width="w-[180px]">Terminated On</Th>
                <Th width="w-[180px]">Terminated by</Th>
              </THead>
              <TBody>
                {filteredEx.length > 0 ? filteredEx.map((row, index) => (
                  <Tr key={row.id} index={index}>
                    <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{index + 1}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-black tracking-tight">{row.name}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-gray-600">{row.createdOn}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-blue-900">{row.createdBy}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-red-500">{row.terminatedOn}</span></Td>
                    <Td><span className="text-[13px] font-semibold text-blue-900">{row.terminatedBy}</span></Td>
                  </Tr>
                )) : (
                  <EmptyRow colSpan={6} message="No ex sub-admins found." />
                )}
              </TBody>
            </Table>
          </DataTable>
        </>
      )}
    </PageWrapper>
  );
};
