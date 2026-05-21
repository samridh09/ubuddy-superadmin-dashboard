'use client';

import React from 'react';
import { Save, Plus, X } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  PrimaryButton, SecondaryButton, DataTable, Table, THead, TBody,
  Th, Td, Tr, EmptyRow, AssignedStaffDisplay, SectionPill, Pagination
} from './ui';
import { ResultViewProps } from '@/types';

export const ResultView: React.FC<ResultViewProps> = ({
  term, className, section, query, updateFilters,
  isAssigning, setIsAssigning, filteredData,
  handleSort, SortIcon, staffList, updateStaffMock, handleCancel,
  page, limit
}) => {
  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Staff Permissions | Result"
        actions={
          <>
            {isAssigning && (
              <SecondaryButton
                onClick={() => { handleCancel?.(); setIsAssigning(false); }}
                className="animate-in fade-in slide-in-from-right-2"
              >
                <X size={14} />
                Cancel
              </SecondaryButton>
            )}
            <PrimaryButton onClick={() => setIsAssigning(!isAssigning)}>
              {isAssigning ? <Save size={14} /> : <Plus size={14} />}
              {isAssigning ? 'Save' : 'Assign Permissions'}
            </PrimaryButton>
          </>
        }
      />

      {/* Filters */}
      <FilterBox>
        <div className="w-[180px]">
          <CustomSelect label="Term"    value={term    || 'All Terms'}    options={['All Terms', 'Term 1', 'Term 2']}                   onChange={(val) => updateFilters('term', val)} />
        </div>
        <div className="w-[180px]">
          <CustomSelect label="Class"   value={className  || 'All Classes'}  options={['All Classes', 'Pre-nursery', 'Nursery', 'Class 1']} onChange={(val) => updateFilters('class', val)} />
        </div>
        <div className="w-[180px]">
          <CustomSelect label="Section" value={section || 'All Sections'} options={['All Sections', 'A', 'B', 'C']}                   onChange={(val) => updateFilters('section', val)} />
        </div>
        <div className="flex-1" />
        <SearchInput
          label="Search Staff"
          placeholder="Type staff name..."
          value={query}
          onChange={(val) => updateFilters('query', val)}
        />
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <Th isFirst width="w-[70px]"  sortKey="id"      onSort={handleSort}>S. No.    <SortIcon columnKey="id" /></Th>
            <Th width="w-[140px]" sortKey="term"    onSort={handleSort}>Term    <SortIcon columnKey="term" /></Th>
            <Th width="w-[200px]" sortKey="class"   onSort={handleSort}>Class   <SortIcon columnKey="class" /></Th>
            <Th width="w-[100px]" sortKey="section" onSort={handleSort} align="center">Section <SortIcon columnKey="section" /></Th>
            <Th width="w-[220px]" sortKey="subject" onSort={handleSort}>Subject <SortIcon columnKey="subject" /></Th>
            <Th sortKey="staff" onSort={handleSort}>Assigned Staff <SortIcon columnKey="staff" /></Th>
          </THead>
          <TBody>
            {paginatedData.length > 0 ? paginatedData.map((row, index) => (
              <Tr key={row.id} index={index}>
                <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{(page - 1) * limit + index + 1}</span></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.term}</span></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.class}</span></Td>
                <Td align="center"><SectionPill value={row.section} /></Td>
                <Td><span className="text-[13px] font-bold text-blue-900 whitespace-nowrap tracking-tight">{row.subject}</span></Td>
                <Td className="overflow-visible">
                  {isAssigning ? (
                    <div className="animate-in zoom-in-95 fade-in duration-300">
                      <CustomSelect value={row.staff} options={staffList} onChange={(val) => updateStaffMock(row.id, val)} isSmall />
                    </div>
                  ) : (
                    <AssignedStaffDisplay staffName={row.staff} />
                  )}
                </Td>
              </Tr>
            )) : (
              <EmptyRow colSpan={6} message="No records matched your current filter criteria." />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => updateFilters('page', String(p))} />
      </DataTable>
    </PageWrapper>
  );
};
