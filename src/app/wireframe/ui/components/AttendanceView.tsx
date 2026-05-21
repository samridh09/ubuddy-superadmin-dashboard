'use client';

import React from 'react';
import { Save, Plus } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  PrimaryButton, SecondaryButton, DataTable, Table, THead, TBody,
  Th, Td, Tr, EmptyRow, AssignedStaffDisplay, SectionPill, Pagination
} from './ui';
import { AttendanceViewProps } from '@/types';

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  query, updateFilters, isAssigning, setIsAssigning, handleAssignClick,
  filteredData, handleSort, SortIcon, staffList, updateStaffMock, page, limit
}) => {
  const handleToggle = () => {
    if (isAssigning) handleAssignClick();
    setIsAssigning(!isAssigning);
  };

  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Staff Permissions | Attendance"
        actions={
          isAssigning ? (
            <>
              <SecondaryButton onClick={() => setIsAssigning(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleToggle}>
                <Save size={15} className="animate-in fade-in spin-in-12 duration-300" />
                Save
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton onClick={handleToggle}>
              <Plus size={15} className="animate-in fade-in rotate-in-90 duration-300" />
              Assign
            </PrimaryButton>
          )
        }
      />

      {/* Filters */}
      <FilterBox>
        <SearchInput
          label="Search"
          placeholder="search staff name....."
          value={query}
          onChange={(val) => updateFilters('query', val)}
          width="flex-1 min-w-[200px]"
        />
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <Th isFirst width="w-[80px]"  sortKey="id"      onSort={handleSort}>S. No.    <SortIcon columnKey="id" /></Th>
            <Th width="w-[180px]" sortKey="class"   onSort={handleSort}>Class   <SortIcon columnKey="class" /></Th>
            <Th width="w-[140px]" sortKey="section" onSort={handleSort}>Section <SortIcon columnKey="section" /></Th>
            <Th                   sortKey="staff"   onSort={handleSort}>Select Staff <SortIcon columnKey="staff" /></Th>
          </THead>
          <TBody>
            {paginatedData.length > 0 ? paginatedData.map((row, index) => (
              <Tr key={row.id} index={index}>
                <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{(page - 1) * limit + index + 1}</span></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.class}</span></Td>
                <Td><SectionPill value={row.section} /></Td>
                <Td className="overflow-visible">
                  <div className="w-full max-w-[360px]">
                    {isAssigning ? (
                      <div className="animate-in fade-in zoom-in-95 duration-300 flex justify-start">
                        <CustomSelect
                          value={row.staff}
                          options={staffList}
                          onChange={(val) => updateStaffMock(row.id, val)}
                          isSmall
                        />
                      </div>
                    ) : (
                      <AssignedStaffDisplay staffName={row.staff} />
                    )}
                  </div>
                </Td>
              </Tr>
            )) : (
              <EmptyRow colSpan={4} />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => updateFilters('page', String(p))} />
      </DataTable>
    </PageWrapper>
  );
};
