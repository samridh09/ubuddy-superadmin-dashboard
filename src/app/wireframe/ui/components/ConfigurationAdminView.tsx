'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { ChevronDown, UserCheck, UserMinus, UserX, Check, Loader2, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { formatMobileNumber } from '@/lib/utils/staff-formatting';
import { getAllConfigAdmins, updateConfigAdminStatus, terminateConfigAdmin } from '@/lib/services/config-admin-service';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  SecondaryButton, PrimaryButton, DangerButton,
  DropdownMenu, DropdownMenuItem, DropdownMenuDivider,
  DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow, StatusBadge, SNoTh,
} from './ui';
import { ConfigAdminMode, ConfigAdminStatus, ConfigAdminRecord } from '@/types';
import { MOCK_ADMINS } from '@/mock/config-admin.mock';
import { formatDateTime, mapStatus } from '@/lib/utils/config-admin-formatting';


export const ConfigurationAdminView: React.FC<{ wireframe?: boolean }> = ({ wireframe = false }) => {
  const router = useRouter();
  const base = useBasePath();

  const [mode, setMode] = useState<ConfigAdminMode>('directory');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [admins, setAdmins] = useState<ConfigAdminRecord[]>(wireframe ? MOCK_ADMINS : []);
  const [loading, setLoading] = useState(!wireframe);
  const [error, setError] = useState<string | null>(null);
  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const headerMoreRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wireframe) return;
    getAllConfigAdmins()
      .then(data => {
        setAdmins(data.map(a => ({
          id: a.id,
          username: a.username,
          name: a.full_name || a.username,
          contact: a.mobile_number || '',
          role: 'Config Admin',
          status: mapStatus(a.status),
          lastLogin: formatDateTime(a.last_login),
          lastLogout: formatDateTime(a.last_logout),
          duration: a.duration || '—',
          createdOn: formatDateTime(a.created_at),
          createdBy: '—',
        })));
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load admins'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) setOpenHeaderMore(false);
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) setOpenActionId(null);
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) setEditingId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortConfig || sortConfig.key !== columnKey) return <ChevronsUpDown size={12} className="ml-1.5 opacity-30 text-black" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={12} className="ml-1.5 text-blue-500" />
      : <ArrowDown size={12} className="ml-1.5 text-blue-500" />;
  };

  const updateStatus = (id: string, s: ConfigAdminStatus) => {
    setUpdatingId(id);
    setEditingId(null);
    if (wireframe) {
      setTimeout(() => {
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: s } : a));
        setUpdatingId(null);
      }, 600);
      return;
    }
    const apiStatus = s === 'Active' ? 'ACTIVE' : 'INACTIVE';
    updateConfigAdminStatus(id, apiStatus)
      .then(updated => setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: mapStatus(updated.status) } : a)))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to update status'))
      .finally(() => setUpdatingId(null));
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [termRemarks, setTermRemarks] = useState('');
  const [terminatingAdmin, setTerminatingAdmin] = useState<ConfigAdminRecord | null>(null);
  const [termLoading, setTermLoading] = useState(false);

  const onConfirmTermination = () => {
    if (!termRemarks.trim() || !terminatingAdmin) return;
    setTermLoading(true);

    if (wireframe) {
      setTimeout(() => {
        setAdmins(prev => prev.map(a => a.id === terminatingAdmin.id ? {
          ...a,
          status: 'Terminated',
          terminatedOn: formatDateTime(new Date().toISOString()),
          terminatedBy: 'Super Admin',
        } : a));
        setTermLoading(false);
        setConfirmOpen(false);
        setTerminatingAdmin(null);
        setTermRemarks('');
      }, 800);
      return;
    }

    terminateConfigAdmin(terminatingAdmin.id)
      .then(updated => {
        setAdmins(prev => prev.map(a => a.id === terminatingAdmin.id ? {
          ...a,
          status: mapStatus(updated.status),
          terminatedOn: formatDateTime(updated.updated_at),
          terminatedBy: 'Super Admin',
        } : a));
        setConfirmOpen(false);
        setTerminatingAdmin(null);
        setTermRemarks('');
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to terminate admin'))
      .finally(() => setTermLoading(false));
  };

  const filtered = useMemo(() => {
    return admins.filter(a => {
      if (mode === 'directory' || mode === 'status') {
        if (a.status === 'Terminated') return false;
      }
      if (mode === 'terminate') {
        if (a.status !== 'Inactive') return false;
      }
      if (mode === 'ex') {
        if (a.status !== 'Terminated') return false;
      }
      const q = query.toLowerCase();
      const matchesQuery = a.name.toLowerCase().includes(q) || a.contact.toLowerCase().includes(q) || a.username.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesQuery && (mode === 'directory' ? matchesStatus : true);
    });
  }, [admins, query, statusFilter, mode]);

  const titles: Record<ConfigAdminMode, string> = {
    directory: 'Configuration Admin',
    status:    'Configuration Admin | Active / Inactive',
    terminate: 'Configuration Admin | Terminate',
    ex:        'Ex Configuration-Admin Management',
  };

  const moreOptions = [
    { label: 'New Configuration Admin', action: () => { setOpenHeaderMore(false); router.push(`${base}/configuration-admin/create`); } },
    { label: 'Active / Inactive', action: () => { setOpenHeaderMore(false); setMode('status'); } },
    { label: 'Terminate',        action: () => { setOpenHeaderMore(false); setMode('terminate'); } },
    { label: 'Ex Sub-Admin',     action: () => { setOpenHeaderMore(false); setMode('ex'); } },
  ];

  if (loading) return (
    <PageWrapper>
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-blue-400" />
      </div>
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <div className="flex items-center justify-center h-64 text-red-500 text-[13px] font-semibold">{error}</div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <PageHeader
        title={titles[mode]}
        subtitle={mode === 'directory' ? 'Manage system configuration administrators' : undefined}
        actions={
          <div className="flex items-center gap-3">
            {mode === 'directory' && (
              <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl flex items-center gap-2 h-[44px]">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Total</span>
                <span className="text-[14px] font-bold text-gray-600">{admins.filter(a => a.status !== 'Terminated').length}</span>
              </div>
            )}
            {mode !== 'directory' && (
              <SecondaryButton
                onClick={() => setMode('directory')}
                className="px-5 text-[12px] text-black"
              >
                ← Back to Directory
              </SecondaryButton>
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
                <DropdownMenu className="absolute top-[calc(100%+8px)] right-0 z-[100] w-[220px]">
                  {moreOptions.map((opt, i) => (
                    <React.Fragment key={opt.label}>
                      {i > 0 && <DropdownMenuDivider />}
                      <DropdownMenuItem onClick={opt.action}>{opt.label}</DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenu>
              )}
            </div>
          </div>
        }
      />

      <FilterBox>
        {mode === 'directory' && (
          <div className="w-[200px]">
            <CustomSelect
              label="Status"
              value={statusFilter}
              options={['All', 'Active', 'Inactive']}
              onChange={setStatusFilter}
              isSmall
            />
          </div>
        )}
        <div className="flex-1" />
        <SearchInput
          label={mode === 'terminate' ? "Search Inactive Admin" : "Search Admin"}
          placeholder="type name or ID....."
          value={query}
          onChange={setQuery}
        />
        {mode === 'terminate' && (
          <div className="ml-4 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-bold text-amber-600 uppercase tracking-widest self-end">
            Only inactive admins can be terminated
          </div>
        )}
      </FilterBox>

      <DataTable>
        <Table className="whitespace-nowrap" overflowVisible>
          <THead>
            {mode === 'directory' && (
              <>
                <SNoTh />
                <Th width="w-[220px]" sortKey="name" onSort={handleSort}>Name <SortIcon columnKey="name" /></Th>
                <Th width="w-[160px]">Contact</Th>
                <Th width="w-[120px]" align="center">Status</Th>
                <Th width="w-[180px]">Last Login</Th>
                <Th width="w-[180px]">Last Logout</Th>
                <Th width="w-[120px]">Duration</Th>
                <Th align="right" className="pr-10">Actions</Th>
              </>
            )}
            {mode === 'status' && (
              <>
                <SNoTh />
                <Th width="w-[250px]">Name</Th>
                <Th width="w-[180px]">Username</Th>
                <Th width="w-[200px]">Role</Th>
                <Th width="w-[150px]" align="center">Status</Th>
                <Th align="right" className="pr-10">Action</Th>
              </>
            )}
            {mode === 'terminate' && (
              <>
                <SNoTh />
                <Th width="w-[250px]">Name</Th>
                <Th width="w-[180px]">Username</Th>
                <Th width="w-[150px]">ID</Th>
                <Th width="w-[180px]">Role</Th>
                <Th width="w-[150px]" align="center">Status</Th>
                <Th align="right" className="pr-10">Action</Th>
              </>
            )}
            {mode === 'ex' && (
              <>
                <SNoTh />
                <Th width="w-[250px]">Name</Th>
                <Th width="w-[180px]">Created on</Th>
                <Th width="w-[180px]">Created by</Th>
                <Th width="w-[180px]">Terminated On</Th>
                <Th width="w-[180px]">Terminated by</Th>
              </>
            )}
          </THead>
          <TBody>
            {filtered.length > 0 ? filtered.map((row, index) => (
              <Tr key={row.id} index={index} className={openActionId === row.id ? 'relative z-50' : ''}>
                <Td isFirst>{index + 1}</Td>

                {mode === 'directory' && (
                  <>
                    <Td><span className="text-[14px] font-bold text-black tracking-tight">{row.name}</span></Td>
                    <Td>{formatMobileNumber(row.contact)}</Td>
                    <Td align="center"><StatusBadge status={row.status} /></Td>
                    <Td><span className="text-[12px] font-semibold text-black">{row.lastLogin}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-black">{row.lastLogout}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-black">{row.duration}</span></Td>
                    <Td align="right" className="relative overflow-visible pr-10">
                      <button
                        onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                        className={`inline-flex items-center justify-between w-[110px] px-5 py-2 text-[12px] font-bold rounded-xl border-2 transition-all duration-300 ${openActionId === row.id ? 'bg-white text-gray-700 border-gray-300 shadow-md' : 'bg-white text-black border-gray-100 hover:border-gray-200'}`}
                      >
                        More
                        <ChevronDown size={13} className={`transition-transform duration-300 ${openActionId === row.id ? 'rotate-180 text-black' : 'text-gray-300'}`} />
                      </button>
                      {openActionId === row.id && (
                        <DropdownMenu ref={actionMenuRef} className={`absolute right-0 ${index >= filtered.length - 2 ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} z-[100]`}>
                          <DropdownMenuItem onClick={() => { setOpenActionId(null); router.push(`${base}/configuration-admin/profile?adminId=${row.id}`); }}>View Profile</DropdownMenuItem>
                          <DropdownMenuDivider />
                          <DropdownMenuItem onClick={() => { setOpenActionId(null); router.push(`${base}/configuration-admin/assign-schools?adminId=${row.id}`); }}>Assign Schools</DropdownMenuItem>
                        </DropdownMenu>
                      )}
                    </Td>
                  </>
                )}

                {mode === 'status' && (
                  <>
                    <Td><span className="text-[14px] font-bold text-black">{row.name}</span></Td>
                    <Td>{row.username}</Td>
                    <Td>{row.role}</Td>
                    <Td align="center">
                      {updatingId === row.id
                        ? <div className="flex justify-center"><Loader2 size={16} className="animate-spin text-blue-400" /></div>
                        : <StatusBadge status={row.status} />
                      }
                    </Td>
                    <Td align="right" className="relative overflow-visible pr-10">
                      <button
                        disabled={updatingId === row.id}
                        onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all ${editingId === row.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-black hover:border-blue-400'}`}
                      >
                        Change
                      </button>
                      {editingId === row.id && (
                        <div ref={statusMenuRef} className="absolute right-8 top-[calc(100%+4px)] w-[190px] bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                          <p className="text-[9px] font-bold text-black uppercase tracking-widest px-4 pt-3 pb-2 border-b border-gray-50">Select Status</p>
                          <div className="py-1.5">
                            <button onClick={() => updateStatus(row.id, 'Active')} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                              <div className="flex items-center gap-2.5"><UserCheck size={14} className="text-blue-400" />Active</div>
                              {row.status === 'Active' && <Check size={12} strokeWidth={4} className="text-blue-500" />}
                            </button>
                            <div className="h-px bg-gray-50 mx-3" />
                            <button onClick={() => updateStatus(row.id, 'Inactive')} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-700">
                              <div className="flex items-center gap-2.5"><UserMinus size={14} className="text-amber-400" />Inactive</div>
                              {row.status === 'Inactive' && <Check size={12} strokeWidth={4} className="text-amber-500" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </Td>
                  </>
                )}

                {mode === 'terminate' && (
                  <>
                    <Td><span className="text-[14px] font-bold text-black tracking-tight">{row.name}</span></Td>
                    <Td>{row.username}</Td>
                    <Td><span className="text-[13px] font-semibold text-black uppercase">USR-{row.id.slice(0, 8)}</span></Td>
                    <Td>{row.role}</Td>
                    <Td align="center"><StatusBadge status={row.status} /></Td>
                    <Td align="right" className="pr-10">
                      <button
                        onClick={() => { setTerminatingAdmin(row); setConfirmOpen(true); }}
                        className="text-red-500 text-[12px] font-bold uppercase tracking-widest hover:underline active:scale-95 transition-all"
                      >
                        Terminate
                      </button>
                    </Td>
                  </>
                )}

                {mode === 'ex' && (
                  <>
                    <Td><span className="text-[14px] font-bold text-black tracking-tight">{row.name}</span></Td>
                    <Td><span className="text-[12px] font-semibold text-black">{row.createdOn}</span></Td>
                    <Td>{row.createdBy}</Td>
                    <Td><span className="text-[12px] font-semibold text-red-500">{row.terminatedOn ?? '—'}</span></Td>
                    <Td>{row.terminatedBy ?? '—'}</Td>
                  </>
                )}
              </Tr>
            )) : (
              <EmptyRow colSpan={8} message={mode === 'terminate' ? "No inactive admins found." : "No records matched your search."} />
            )}
          </TBody>
        </Table>
      </DataTable>

      {confirmOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 w-[420px] shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500"><UserX size={40} /></div>
            <h3 className="text-2xl font-black text-black mb-6 tracking-tight">Confirm Termination</h3>
            <div className="w-full text-left space-y-2 mb-8">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest px-0.5">Remarks *</label>
              <textarea
                value={termRemarks}
                onChange={e => setTermRemarks(e.target.value)}
                placeholder="Enter reason..."
                className="w-full h-28 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[13px] font-medium text-black focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>
            <div className="flex flex-col w-full gap-3">
              <DangerButton
                onClick={onConfirmTermination}
                disabled={termLoading || !termRemarks.trim()}
                className="w-full py-4 rounded-2xl text-[14px] justify-center bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 font-black uppercase tracking-widest disabled:opacity-50"
              >
                {termLoading ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Terminate'}
              </DangerButton>
              <SecondaryButton onClick={() => setConfirmOpen(false)} className="w-full py-4 rounded-2xl text-[14px] justify-center font-bold uppercase tracking-widest">Cancel</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
