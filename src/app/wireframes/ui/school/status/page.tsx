'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Eye, 
  School,
  MapPin,
  Tag,
  Hash,
  ChevronDown,
  UserCheck,
  UserMinus,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  PrimaryButton, SecondaryButton, DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow, StatusBadge, Pagination
} from '@/app/wireframe/ui/components/ui';
import { SchoolData } from "@/types/components/page";

const MOCK_SCHOOLS: SchoolData[] = [
  {
    id: '1',
    slNo: 1,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
  },
  {
    id: '2',
    slNo: 2,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
  },
  {
    id: '3',
    slNo: 3,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
  },
  {
    id: '4',
    slNo: 4,
    name: 'Global International Academy',
    uCode: '5678',
    city: 'Bhopal',
    status: 'Active',
  },
  {
    id: '5',
    slNo: 5,
    name: 'St. Mary\'s Convent',
    uCode: '9012',
    city: 'Pune',
    status: 'Inactive',
  },
];

export default function SchoolStatusManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

  const headerMoreRef = React.useRef<HTMLDivElement>(null);
  const statusMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  const filteredSchools = useMemo(() => {
    return MOCK_SCHOOLS.filter((school) => {
      const q = searchQuery.toLowerCase();
      return (
        school.name.toLowerCase().includes(q) ||
        school.uCode.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / limit));
  const paginatedSchools = useMemo(() => {
    return filteredSchools.slice((page - 1) * limit, page * limit);
  }, [filteredSchools, page]);

  return (
    <PageWrapper>
      <PageHeader
        title="School Management | Active/Inactive"
        subtitle="Manage institution directory & access"
        actions={
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={() => router.push('/wireframes/ui/school')} className="pr-5">
              <ArrowLeft size={16} />
              Back to Directory
            </SecondaryButton>
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
                    <button
                      onClick={() => { setOpenHeaderMore(false); router.push('/wireframes/ui/school/add'); }}
                      className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors uppercase tracking-wide active:bg-neutral-100"
                    >
                      New school
                    </button>
                    <div className="h-px bg-gray-50 mx-3" />
                    <button
                      onClick={() => { setOpenHeaderMore(false); }}
                      className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-blue-600 bg-blue-50/50 transition-colors uppercase tracking-wide cursor-default"
                    >
                      Active/Inactive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />

      <FilterBox>
        <div className="ml-auto">
          <SearchInput
            label="Search"
            placeholder="Search school name Ucode...."
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            width="w-[400px]"
          />
        </div>
      </FilterBox>

      <DataTable>
        <Table>
          <THead>
            <Th width="w-[100px]" isFirst>S. No.</Th>
            <Th width="w-[300px]">School Name</Th>
            <Th width="w-[150px]">U-Code</Th>
            <Th width="w-[150px]">Status</Th>
            <Th width="w-[180px]">City</Th>
            <Th width="w-[200px]" align="center">Change Status</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {paginatedSchools.length > 0 ? (
              paginatedSchools.map((school, index) => (
                <Tr key={school.id} index={index} className={editingStatusId === school.id ? 'relative z-50' : ''}>
                  <Td isFirst>
                    <span className="text-[13px] font-semibold text-gray-400">
                      {school.slNo}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[14px] font-bold text-blue-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis block max-w-[400px]">
                      {school.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[12px] font-bold">
                      {school.uCode}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={school.status} />
                  </Td>
                  <Td>
                    <span className="text-[13px] font-semibold text-gray-500">
                      {school.city}
                    </span>
                  </Td>
                  <Td align="center" className="relative overflow-visible">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setEditingStatusId(editingStatusId === school.id ? null : school.id)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 transition-all active:scale-95 ${editingStatusId === school.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-blue-900 hover:border-blue-400'}`}
                      >
                        Change
                      </button>
                      {editingStatusId === school.id && (
                        <div ref={statusMenuRef} className={`absolute right-8 ${index >= paginatedSchools.length - 2 ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'} w-[190px] bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden`}>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-2 border-b border-gray-50">Select Status</p>
                          <div className="py-1.5">
                            <button 
                              onClick={() => { /* Update logic */ setEditingStatusId(null); }} 
                              className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group/opt"
                            >
                              <div className="flex items-center gap-2.5">
                                <UserCheck size={14} className="text-blue-400 group-hover/opt:text-blue-500" />
                                Active
                              </div>
                              {school.status === 'Active' && <Check size={12} strokeWidth={4} className="text-blue-500" />}
                            </button>
                            <div className="h-px bg-gray-50 mx-3" />
                            <button 
                              onClick={() => { /* Update logic */ setEditingStatusId(null); }} 
                              className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors group/opt"
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
                  <Td></Td>
                </Tr>
              ))
            ) : (
              <EmptyRow colSpan={6} message="No schools matched your search." />
            )}
          </TBody>
        </Table>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </DataTable>
    </PageWrapper>
  );
}
