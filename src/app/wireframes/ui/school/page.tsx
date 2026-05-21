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
  X,
  Pencil,
} from 'lucide-react';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  PrimaryButton, SecondaryButton, DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow, StatusBadge, Pagination, ToggleSwitch, SNoTh
} from '@/app/wireframe/ui/components/ui';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SchoolData } from "@/types/components/page";

const MOCK_SCHOOLS: SchoolData[] = [
  {
    id: '1',
    slNo: 1,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
    studentCount: 100,
    subAdminCount: 100,
  },
  {
    id: '2',
    slNo: 2,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
    studentCount: 100,
    subAdminCount: 100,
  },
  {
    id: '3',
    slNo: 3,
    name: 'UBUDDY School',
    uCode: '1234',
    city: 'Indore',
    status: 'Active',
    studentCount: 100,
    subAdminCount: 100,
  },
  {
    id: '4',
    slNo: 4,
    name: 'Global International Academy',
    uCode: '5678',
    city: 'Bhopal',
    status: 'Active',
    studentCount: 100,
    subAdminCount: 100,
  },
  {
    id: '5',
    slNo: 5,
    name: 'St. Mary\'s Convent',
    uCode: '9012',
    city: 'Pune',
    status: 'Inactive',
    studentCount: 100,
    subAdminCount: 100,
  },
];
export default function SchoolManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [openConfigureId, setOpenConfigureId] = useState<string | null>(null);

  // Modal State
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [isAppControlModalOpen, setIsAppControlModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'student' | 'subadmin' | null>(null);
  const [countValue, setCountValue] = useState('100');
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const [appToggles, setAppToggles] = useState({
    student: true,
    teacher: true,
    admin: true,
  });

  const headerMoreRef = React.useRef<HTMLDivElement>(null);
  const configureMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) {
        setOpenHeaderMore(false);
      }
      if (configureMenuRef.current && !configureMenuRef.current.contains(event.target as Node)) {
        setOpenConfigureId(null);
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

  const handleOpenCountModal = (school: SchoolData, type: 'student' | 'subadmin') => {
    setSelectedSchoolId(school.id);
    setModalType(type);
    setCountValue(type === 'student' ? (school.studentCount?.toString() || '0') : (school.subAdminCount?.toString() || '0'));
    setIsEditingCount(false);
    setIsCountModalOpen(true);
    setOpenConfigureId(null);
  };

  const handleOpenAppControlModal = (school: SchoolData) => {
    setSelectedSchoolId(school.id);
    setIsAppControlModalOpen(true);
    setOpenConfigureId(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="School Management"
        subtitle="Manage institution directory & access"
        actions={
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
                    onClick={() => { setOpenHeaderMore(false); router.push('/wireframes/ui/school/status'); }}
                    className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors uppercase tracking-wide active:bg-neutral-100"
                  >
                    Active/Inactive
                  </button>
                </div>
              </div>
            )}
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
            <SNoTh />
            <Th width="w-[300px]">School Name</Th>
            <Th width="w-[150px]">U-Code</Th>
            <Th width="w-[150px]">Status</Th>
            <Th width="w-[180px]">City</Th>
            <Th width="w-[200px]" align="center">Actions</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {paginatedSchools.length > 0 ? (
              paginatedSchools.map((school, index) => (
                <Tr key={school.id} index={index} className={openConfigureId === school.id ? 'relative z-50' : ''}>
                  <Td isFirst>{school.slNo}</Td>
                  <Td>
                    <span className="text-[14px] font-bold text-black tracking-tight whitespace-nowrap overflow-hidden text-ellipsis block max-w-[400px]">
                      {school.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2.5 py-1 bg-gray-100 text-black rounded-lg text-[12px] font-bold">
                      {school.uCode}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={school.status} />
                  </Td>
                  <Td>{school.city}</Td>
                  <Td align="center" className="relative overflow-visible">
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenConfigureId(openConfigureId === school.id ? null : school.id)}
                          className={`inline-flex items-center justify-between gap-2 px-4 py-2 text-[12px] font-bold rounded-xl border-2 transition-all duration-300 active:scale-95 cursor-pointer ${openConfigureId === school.id ? 'bg-white text-gray-700 border-gray-300 shadow-md' : 'bg-white text-black border-gray-100 hover:border-gray-200'}`}
                        >
                          Configure
                          <ChevronDown size={13} className={`transition-transform duration-300 ${openConfigureId === school.id ? 'rotate-180 text-black' : 'text-gray-300'}`} />
                        </button>
                        {openConfigureId === school.id && (
                          <div ref={configureMenuRef} className={`absolute right-0 ${index >= paginatedSchools.length - 2 ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} w-[200px] bg-white border border-gray-100 rounded-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl`}>
                            <div className="py-2">
                              {[
                                { label: 'Assign module', onClick: () => router.push(`/wireframes/ui/school/assign-module?schoolId=${school.id}`) },
                                { label: `Student count [${school.studentCount || 0}]`, onClick: () => handleOpenCountModal(school, 'student') },
                                { label: `Sub-admin count [${school.subAdminCount || 0}]`, onClick: () => handleOpenCountModal(school, 'subadmin') },
                                { label: 'Manage sessions', onClick: () => router.push(`/wireframes/ui/school/manage-sessions?schoolId=${school.id}`) },
                                { label: 'App controll', onClick: () => handleOpenAppControlModal(school) }
                              ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                  {i > 0 && <div className="h-px bg-gray-50 mx-3" />}
                                  <button
                                    onClick={() => {
                                      setOpenConfigureId(null);
                                      item.onClick();
                                    }}
                                    className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                                  >
                                    {item.label}
                                  </button>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <SecondaryButton className="px-4 py-2 border-gray-100 h-[38px] min-w-0" onClick={() => router.push(`/wireframes/ui/school/view/${school.id}`)}>
                        <Eye size={14} />
                        View
                      </SecondaryButton>
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

      {/* Count Update Modal */}
      <Dialog open={isCountModalOpen} onOpenChange={setIsCountModalOpen}>
        <DialogContent className="max-w-[400px] border-none shadow-2xl p-8" showCloseButton={false}>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight">
                {modalType === 'student' ? 'Student count' : 'Sub-admin count'}
              </h3>
              <button
                onClick={() => setIsCountModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-black hover:text-black hover:bg-gray-100 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Count Display / Edit Area */}
            <div className="flex justify-center items-center gap-3">
              {isEditingCount ? (
                <input
                  type="text"
                  value={countValue}
                  onChange={(e) => setCountValue(e.target.value.replace(/\D/g, ''))}
                  className="bg-transparent text-black text-[80px] font-bold text-center focus:outline-none w-full border-none caret-blue-500"
                  autoFocus
                  onBlur={() => setIsEditingCount(false)}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-black text-[80px] font-bold leading-none">{countValue}</span>
                  <button
                    onClick={() => setIsEditingCount(true)}
                    className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-black hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 self-center"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3">
              <SecondaryButton
                onClick={() => setIsCountModalOpen(false)}
                className="flex-1 justify-center py-3 rounded-xl border-gray-100 h-11"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setIsCountModalOpen(false);
                }}
                className="flex-1 justify-center py-3 rounded-xl shadow-lg shadow-blue-600/10 h-11"
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* App Control Modal */}
      <Dialog open={isAppControlModalOpen} onOpenChange={setIsAppControlModalOpen}>
        <DialogContent className="max-w-[450px] border-none shadow-2xl p-0 overflow-hidden" showCloseButton={false}>
          <div className="p-8 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-bold text-black tracking-tight">
                App controll
              </h3>
              <button 
                onClick={() => setIsAppControlModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black hover:text-black hover:bg-gray-100 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Toggle List */}
            <div className="space-y-6">
              {[
                { id: 'student', label: 'Student App' },
                { id: 'teacher', label: 'teacher App' },
                { id: 'admin', label: 'Admin App' },
              ].map((app) => (
                <div key={app.id} className="flex items-center justify-between group">
                  <span className="text-[15px] font-bold text-gray-700 group-hover:text-black transition-colors">
                    {app.label}
                  </span>
                  <ToggleSwitch
                    checked={appToggles[app.id as keyof typeof appToggles]}
                    onChange={() => setAppToggles(prev => ({ ...prev, [app.id]: !prev[app.id as keyof typeof prev] }))}
                  />
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 pt-4">
              <SecondaryButton
                onClick={() => setIsAppControlModalOpen(false)}
                className="flex-1 justify-center py-3 rounded-xl border-gray-100 h-11"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  // Logic to save the app control settings would go here
                  setIsAppControlModalOpen(false);
                }}
                className="flex-1 justify-center py-3 rounded-xl shadow-lg shadow-blue-600/10 h-11"
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
