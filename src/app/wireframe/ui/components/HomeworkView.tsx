'use client';

import React from 'react';
import { Save, Plus } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  PrimaryButton, SecondaryButton, DataTable, Table, THead, TBody,
  Th, Td, Tr, EmptyRow, AssignedStaffDisplay, SectionPill, Pagination
} from './ui';
import { HomeworkViewProps } from '@/types';

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  className, section, query, updateFilters,
  isAssigning, setIsAssigning, handleAssignClick, filteredData,
  handleSort, SortIcon, staffList, updateStaffMock, page, limit
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
        title="Staff Permissions | Homework"
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
        <div className="w-[200px]">
          <CustomSelect
            label="Class"
            value={className || 'All Classes'}
            options={['All Classes', 'Pre-nursery', 'Nursery', 'Class 1']}
            onChange={(val) => updateFilters('class', val)}
          />
        </div>
        <div className="w-[200px]">
          <CustomSelect
            label="Section"
            value={section || 'All Sections'}
            options={['All Sections', 'A', 'B', 'C']}
            onChange={(val) => updateFilters('section', val)}
          />
        </div>
        <div className="flex-1" />
        <SearchInput
          label="Search"
          placeholder="search staff name....."
          value={query}
          onChange={(val) => updateFilters('query', val)}
        />
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <Th isFirst width="w-[80px]"  sortKey="id"      onSort={handleSort}>S. No.    <SortIcon columnKey="id" /></Th>
            <Th width="w-[160px]" sortKey="class"   onSort={handleSort}>Class   <SortIcon columnKey="class" /></Th>
            <Th width="w-[120px]" sortKey="section" onSort={handleSort} align="center">Section <SortIcon columnKey="section" /></Th>
            <Th width="w-[220px]" sortKey="subject" onSort={handleSort}>Subject <SortIcon columnKey="subject" /></Th>
            <Th sortKey="staff" onSort={handleSort}>Assigned Staff <SortIcon columnKey="staff" /></Th>
          </THead>
          <TBody>
            {paginatedData.length > 0 ? paginatedData.map((row, index) => (
              <Tr key={row.id} index={index}>
                <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{(page - 1) * limit + index + 1}</span></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.class}</span></Td>
                <Td align="center"><SectionPill value={row.section} /></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.subject}</span></Td>
                <Td className="overflow-visible">
                  <div className="w-full">
                    {isAssigning ? (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
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
              <EmptyRow colSpan={5} />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => updateFilters('page', String(p))} />
      </DataTable>
    </PageWrapper>
  );
};
