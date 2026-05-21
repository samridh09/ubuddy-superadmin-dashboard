'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, ChevronDown, X, Pencil } from 'lucide-react';

import {
  PageWrapper,
  PageHeader,
  FilterBox,
  SearchInput,
  PrimaryButton,
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
  ToggleSwitch,
  SNoTh,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
} from '../../wireframe/ui/components/ui';
import { SkeletonTableRows } from '@/components/ui/DataTablePrimitives';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getAllSchools, updateSchool } from '@/lib/services/school-service';
import type { SchoolTableRow } from '@/types/school';
import { SchoolData } from "@/types/components/page";
import { useAuth } from '@/providers/auth-provider';

export default function SchoolManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [openHeaderMore, setOpenHeaderMore] = useState(false);
  const [openConfigureId, setOpenConfigureId] = useState<string | null>(null);
  const [configureMenuPos, setConfigureMenuPos] = useState<{ top: number; right: number } | null>(null);

  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [isSavingCount, setIsSavingCount] = useState(false);
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

  useEffect(() => {
    getAllSchools()
      .then((data) =>
        setSchools(
          data.map((s, i) => ({
            id: s.id,
            slNo: i + 1,
            name: s.name,
            uCode: s.code ?? '—',
            city: s.address?.city ?? '—',
            status: s.status === 'ACTIVE' ? 'Active' : 'Inactive',
            studentCount: s.total_students_count ?? 0,
            studentLimit: s.total_students_limit ?? 0,
            subAdminCount: s.total_sub_admins_count ?? 0,
            subAdminLimit: s.total_sub_admins_limit ?? 0,
          })),
        ),
      )
      .catch(() => setFetchError('Failed to load schools.'))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMoreRef.current && !headerMoreRef.current.contains(event.target as Node)) {
        setOpenHeaderMore(false);
      }
      if (configureMenuRef.current && !configureMenuRef.current.contains(event.target as Node)) {
        setOpenConfigureId(null);
        setConfigureMenuPos(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSchools = useMemo(
    () =>
      schools.filter((school) => {
        const q = searchQuery.toLowerCase();
        return (
          school.name.toLowerCase().includes(q) ||
          school.uCode.toLowerCase().includes(q) ||
          school.city.toLowerCase().includes(q)
        );
      }),
    [searchQuery, schools],
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / limit));
  const paginatedSchools = useMemo(
    () => filteredSchools.slice((page - 1) * limit, page * limit),
    [filteredSchools, page],
  );

  const handleOpenCountModal = (school: SchoolData, type: 'student' | 'subadmin') => {
    setSelectedSchoolId(school.id);
    setModalType(type);
    setCountValue(type === 'student' ? school.studentLimit?.toString() ?? '0' : school.subAdminLimit?.toString() ?? '0');
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
          user?.role !== 'CONFIGURATION_ADMIN' && (
            <div className="relative" ref={headerMoreRef}>
              <SecondaryButton
                onClick={() => setOpenHeaderMore(!openHeaderMore)}
                className="pr-4"
              >
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
                  <DropdownMenuItem onClick={() => { setOpenHeaderMore(false); router.push('/super-admin/school/status'); }}>
                    Active/Inactive
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </div>
          )
        }
      />

      <FilterBox>
        <div className="ml-auto">
          <SearchInput
            label="Search"
            placeholder="Search school name Ucode...."
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setPage(1); }}
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
            <Th className="w-full" />
          </THead>
          <TBody>
            {loading ? (
              <SkeletonTableRows rows={10} cols={[30, 70, 40, 40, 50, 60, 0]} />
            ) : fetchError ? (
              <EmptyRow colSpan={6} message={fetchError} />
            ) : paginatedSchools.length > 0 ? (
              paginatedSchools.map((school, index) => (
                <Tr
                  key={school.id}
                  index={index}
                  className={openConfigureId === school.id ? 'relative z-50' : ''}
                >
                  <Td isFirst>{school.slNo}</Td>
                  <Td>
                    <span className="block max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold tracking-tight text-black">
                      {school.name}
                    </span>
                  </Td>
                  <Td>
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-black">
                      {school.uCode}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={school.status} />
                  </Td>
                  <Td>{school.city}</Td>
                  <Td align="center" className="relative overflow-visible">
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <button
                          onClick={(e) => {
                            if (openConfigureId === school.id) {
                              setOpenConfigureId(null);
                              setConfigureMenuPos(null);
                            } else {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setConfigureMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
                              setOpenConfigureId(school.id);
                            }
                          }}
                          className={`inline-flex cursor-pointer items-center justify-between gap-2 rounded-xl border-2 px-4 py-2 text-[12px] font-bold transition-all duration-300 active:scale-95 ${openConfigureId === school.id ? 'border-gray-300 bg-white text-gray-700 shadow-md' : 'border-gray-100 bg-white text-black hover:border-gray-200'}`}
                        >
                          Configure
                          <ChevronDown
                            size={13}
                            className={`transition-transform duration-300 ${openConfigureId === school.id ? 'rotate-180 text-black' : 'text-gray-300'}`}
                          />
                        </button>
                      </div>
                      <SecondaryButton
                        className="h-[38px] min-w-0 border-gray-100 px-4 py-2"
                        onClick={() => router.push(`/super-admin/school/view/${school.id}`)}
                      >
                        <Eye size={14} />
                        View
                      </SecondaryButton>
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

      {/* Count Update Modal */}
      <Dialog open={isCountModalOpen} onOpenChange={setIsCountModalOpen}>
        <DialogContent className="max-w-[400px] border-none p-8 shadow-2xl" showCloseButton={false}>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold tracking-tight text-[#0F172A]">
                  {modalType === 'student' ? 'Student limit' : 'Sub-admin limit'}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                  Current: {schools.find((s) => s.id === selectedSchoolId)?.[modalType === 'student' ? 'studentLimit' : 'subAdminLimit'] ?? 0}
                </p>
              </div>
              <button
                onClick={() => setIsCountModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-black transition-all hover:bg-gray-100 hover:text-black active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              {isEditingCount ? (
                <input
                  type="text"
                  value={countValue}
                  onChange={(e) => setCountValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full border-none bg-transparent text-center text-[80px] font-bold text-black caret-blue-500 focus:outline-none"
                  autoFocus
                  onBlur={() => setIsEditingCount(false)}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[80px] font-bold leading-none text-black">{countValue}</span>
                  <button
                    onClick={() => setIsEditingCount(true)}
                    className="flex h-9 w-9 items-center justify-center self-center rounded-xl bg-gray-50 text-black transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <SecondaryButton
                onClick={() => setIsCountModalOpen(false)}
                className="h-11 flex-1 justify-center rounded-xl border-gray-100 py-3"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={isSavingCount}
                onClick={async () => {
                  if (!selectedSchoolId || !modalType) return;
                  setIsSavingCount(true);
                  try {
                    const val = parseInt(countValue, 10) || 0;
                    const payload = modalType === 'student'
                      ? { total_students_limit: val }
                      : { total_sub_admins_limit: val };
                    const updated = await updateSchool(selectedSchoolId, payload);
                    setSchools((prev) =>
                      prev.map((s) =>
                        s.id === selectedSchoolId
                          ? {
                              ...s,
                              studentLimit: updated.total_students_limit,
                              studentCount: updated.total_students_count,
                              subAdminCount: updated.total_sub_admins_count,
                              subAdminLimit: updated.total_sub_admins_limit,
                            }
                          : s,
                      ),
                    );
                    setIsCountModalOpen(false);
                  } finally {
                    setIsSavingCount(false);
                  }
                }}
                className="h-11 flex-1 justify-center rounded-xl py-3 shadow-lg shadow-blue-600/10"
              >
                {isSavingCount ? 'Saving...' : 'Save'}
              </PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* App Control Modal */}
      <Dialog open={isAppControlModalOpen} onOpenChange={setIsAppControlModalOpen}>
        <DialogContent className="max-w-[450px] overflow-hidden border-none p-0 shadow-2xl" showCloseButton={false}>
          <div className="space-y-10 p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-bold tracking-tight text-black">
                App Control
              </h3>
              <button
                onClick={() => setIsAppControlModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-black transition-all hover:bg-gray-100 hover:text-black active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { id: 'student', label: 'Student App' },
                { id: 'teacher', label: 'Teacher App' },
                { id: 'admin', label: 'Admin App' },
              ].map((app) => (
                <div key={app.id} className="group flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-700 transition-colors group-hover:text-black">
                    {app.label}
                  </span>
                  <ToggleSwitch
                    checked={appToggles[app.id as keyof typeof appToggles]}
                    onChange={() =>
                      setAppToggles((prev) => ({ ...prev, [app.id]: !prev[app.id as keyof typeof prev] }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <SecondaryButton
                onClick={() => setIsAppControlModalOpen(false)}
                className="h-11 flex-1 justify-center rounded-xl border-gray-100 py-3"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={() => setIsAppControlModalOpen(false)}
                className="h-11 flex-1 justify-center rounded-xl py-3 shadow-lg shadow-blue-600/10"
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fixed-position configure dropdown — escapes all overflow clipping */}
      {openConfigureId && configureMenuPos && (() => {
        const school = schools.find((s) => s.id === openConfigureId);
        if (!school) return null;

        const allOptions = [
          { label: 'Assign module', onClick: () => router.push(`/super-admin/school/assign-module?schoolId=${school.id}`) },
          { label: `Student count [${school.studentLimit || 0}]`, onClick: () => handleOpenCountModal(school, 'student') },
          { label: `Sub-admin count [${school.subAdminLimit || 0}]`, onClick: () => handleOpenCountModal(school, 'subadmin') },
          { label: 'Manage sessions', onClick: () => router.push(`/super-admin/school/manage-sessions?schoolId=${school.id}`) },
          { label: 'App control', onClick: () => handleOpenAppControlModal(school) },
        ];

        const options = user?.role === 'CONFIGURATION_ADMIN'
          ? allOptions.filter((opt) => opt.label === 'Manage sessions')
          : allOptions;

        return (
          <DropdownMenu
            ref={configureMenuRef}
            style={{ position: 'fixed', top: configureMenuPos.top, right: configureMenuPos.right, zIndex: 9999 }}
          >
            {options.map((item, i) => (
              <React.Fragment key={item.label}>
                {i > 0 && <DropdownMenuDivider />}
                <DropdownMenuItem
                  uppercase={false}
                  onClick={() => { setOpenConfigureId(null); setConfigureMenuPos(null); item.onClick(); }}
                >
                  {item.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenu>
        );
      })()}
    </PageWrapper>
  );
}
