'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, UserCheck, UserMinus, Check, ArrowLeft } from 'lucide-react';

import {
  PageWrapper,
  PageHeader,
  FilterBox,
  SearchInput,
  SecondaryButton,
  DataTable,
  Table,
  THead,
  TBody,
  Th,
  Td,
  Tr,
  EmptyRow,
  StatusBadge,
  Pagination,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
} from '../../../wireframe/ui/components/ui';
import { SkeletonTableRows } from '@/components/ui/DataTablePrimitives';
import { getAllSchools, updateSchoolStatus, School } from '@/lib/services/school-service';
import type { SchoolStatusRow as SchoolRow } from '@/types/school';

function toRow(school: School, index: number): SchoolRow {
  return {
    id: school.id,
    slNo: index + 1,
    name: school.name,
    uCode: school.code,
    city: school.address.city,
    status: school.status === 'ACTIVE' ? 'Active' : 'Inactive',
  };
}

export default function SchoolStatusManagementPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const headerMoreRef = React.useRef<HTMLDivElement>(null);
  const statusMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllSchools()
      .then((data) => setSchools(data.map(toRow)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) {
        setOpenHeaderMore(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setEditingStatusId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeStatus = useCallback(async (schoolId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setUpdatingId(schoolId);
    setEditingStatusId(null);
    try {
      const updated = await updateSchoolStatus(schoolId, newStatus);
      setSchools((prev) =>
        prev.map((s) =>
          s.id === schoolId ? { ...s, status: updated.status === 'ACTIVE' ? 'Active' : 'Inactive' } : s,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const filteredSchools = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.uCode.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }, [schools, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / limit));
  const paginatedSchools = useMemo(
    () => filteredSchools.slice((page - 1) * limit, page * limit),
    [filteredSchools, page],
  );

  return (
    <PageWrapper>
      <PageHeader
        title="School Management | Active/Inactive"
        subtitle="Manage institution directory & access"
        actions={
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={() => router.push('/super-admin/school')} className="pr-5">
              <ArrowLeft size={16} />
              Back to Directory
            </SecondaryButton>
            <div className="relative" ref={headerMoreRef}>
              <SecondaryButton onClick={() => setOpenHeaderMore(!openHeaderMore)} className="pr-4">
                More
                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  className={`transition-transform duration-300 ${openHeaderMore ? 'rotate-180' : ''}`}
                />
              </SecondaryButton>
              {openHeaderMore && (
                <DropdownMenu className="absolute top-[calc(100%+8px)] right-0 z-[100]">
                  <DropdownMenuItem onClick={() => { setOpenHeaderMore(false); router.push('/super-admin/school/add'); }}>
                    New school
                  </DropdownMenuItem>
                  <DropdownMenuDivider />
                  <DropdownMenuItem active>
                    Active/Inactive
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </div>
          </div>
        }
      />

      <FilterBox>
        <div className="ml-auto">
          <SearchInput
            label="Search"
            placeholder="Search school name, U-code..."
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setPage(1); }}
            width="w-[400px]"
          />
        </div>
      </FilterBox>

      <DataTable>
        <Table overflowVisible>
          <THead>
            <Th width="w-[100px]" isFirst>S. No.</Th>
            <Th width="w-[300px]">School Name</Th>
            <Th width="w-[150px]">U-Code</Th>
            <Th width="w-[150px]">Status</Th>
            <Th width="w-[180px]">City</Th>
            <Th width="w-[200px]" align="center">Change Status</Th>
            <Th className="w-full" />
          </THead>
          <TBody>
            {loading ? (
              <SkeletonTableRows rows={10} cols={[30, 70, 40, 40, 50, 60, 0]} />
            ) : paginatedSchools.length > 0 ? (
              paginatedSchools.map((school, index) => (
                <Tr
                  key={school.id}
                  index={index}
                  className={editingStatusId === school.id ? 'relative z-50' : ''}
                >
                  <Td isFirst>
                    <span className="text-[13px] font-semibold text-gray-400">{school.slNo}</span>
                  </Td>
                  <Td>
                    <span className="block max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold tracking-tight text-blue-900">
                      {school.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-600">
                      {school.uCode}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={school.status} />
                  </Td>
                  <Td>
                    <span className="text-[13px] font-semibold text-gray-500">{school.city}</span>
                  </Td>
                  <Td align="center" className="relative overflow-visible">
                    <div className="flex items-center justify-center">
                      <button
                        disabled={updatingId === school.id}
                        onClick={() => setEditingStatusId(editingStatusId === school.id ? null : school.id)}
                        className={`rounded-lg border-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${editingStatusId === school.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-100 bg-white text-blue-900 hover:border-blue-400'}`}
                      >
                        {updatingId === school.id ? '...' : 'Change'}
                      </button>
                      {editingStatusId === school.id && (
                        <div
                          ref={statusMenuRef}
                          className={`absolute right-8 z-[200] w-[190px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${index >= paginatedSchools.length - 2 ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'}`}
                        >
                          <p className="border-b border-gray-50 px-4 pt-3 pb-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            Select Status
                          </p>
                          <div className="py-1.5">
                            <button
                              onClick={() => handleChangeStatus(school.id, 'ACTIVE')}
                              className="group/opt flex w-full items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            >
                              <div className="flex items-center gap-2.5">
                                <UserCheck size={14} className="text-blue-400 group-hover/opt:text-blue-500" />
                                Active
                              </div>
                              {school.status === 'Active' && <Check size={12} strokeWidth={4} className="text-blue-500" />}
                            </button>
                            <div className="mx-3 h-px bg-gray-50" />
                            <button
                              onClick={() => handleChangeStatus(school.id, 'INACTIVE')}
                              className="group/opt flex w-full items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700"
                            >
                              <div className="flex items-center gap-2.5">
                                <UserMinus size={14} className="text-amber-400 group-hover/opt:text-amber-500" />
                                Inactive
                              </div>
                              {school.status === 'Inactive' && <Check size={12} strokeWidth={4} className="text-amber-500" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td />
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={6} message="No schools matched your search." />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </DataTable>
    </PageWrapper>
  );
}
