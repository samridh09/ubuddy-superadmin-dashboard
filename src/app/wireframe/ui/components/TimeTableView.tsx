'use client';

import React, { useState } from 'react';
import { Eye, Table } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { TimeTableModal } from './TimeTableModal';
import { TimeTableFullView } from './TimeTableFullView';
import { TimeTableEditView } from './TimeTableEditView';
import { TIMETABLE_MODAL_MOCK_DETAILS } from '@/mock/timetable.mock';
import {
  PageWrapper, PageHeader, FilterBox, PrimaryButton, SecondaryButton,
  DataTable, Table as TablePrimitive, THead, TBody, Th, Td, Tr,
  EmptyRow, SectionPill, IconButton, makeSortIcon, Pagination
} from './ui';
import { TimeTableViewProps } from '@/types';

export const TimeTableView: React.FC<TimeTableViewProps> = ({
  term, updateFilters, filteredData, handleSort, sortConfig, page, limit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table' | 'edit'>('list');

  const SortIcon = makeSortIcon(sortConfig?.key || '', sortConfig?.direction || 'asc');

  const handleViewDetails = (row: any) => {
    setSelectedTimetable({
      className: row.class,
      term: row.term,
      session: '2025-26',
      details: TIMETABLE_MODAL_MOCK_DETAILS,
    });
    setIsModalOpen(true);
  };

  const handleNextClass = () => {
    if (!selectedTimetable) return;
    const currentIndex = filteredData.findIndex(row => row.class === selectedTimetable.className);
    const nextIndex = (currentIndex + 1) % filteredData.length;
    handleViewDetails(filteredData[nextIndex]);
  };

  const handlePrevClass = () => {
    if (!selectedTimetable) return;
    const currentIndex = filteredData.findIndex(row => row.class === selectedTimetable.className);
    const prevIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
    handleViewDetails(filteredData[prevIndex]);
  };

  if (viewMode === 'table') {
    return <TimeTableFullView onBack={() => setViewMode('list')} onEdit={() => setViewMode('edit')} />;
  }

  if (viewMode === 'edit') {
    return <TimeTableEditView onBack={() => setViewMode('list')} />;
  }

  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <PageWrapper>
      <PageHeader 
        title="Time Table"
        actions={
          <>
            <SecondaryButton 
              onClick={() => setViewMode('table')}
              className="px-6 py-2.5"
            >
              <Table className="w-4 h-4" />
              Table View
            </SecondaryButton>
            <PrimaryButton onClick={() => setViewMode('edit')}>
              Edit Time Table
            </PrimaryButton>
          </>
        }
      />

      {/* Filters */}
      <FilterBox>
        <div className="w-[180px]">
          <CustomSelect 
            label="Term" 
            value={term || 'Term I'} 
            options={['Term I', 'Term II', 'Term III']} 
            onChange={(val) => updateFilters('term', val)} 
            isSmall
          />
        </div>
      </FilterBox>

      {/* Table Section */}
      <DataTable>
        <TablePrimitive>
          <THead>
            <Th isFirst width="w-[100px]" sortKey="id" onSort={handleSort}>S. No. <SortIcon columnKey="id" /></Th>
            <Th width="w-[280px]" sortKey="class" onSort={handleSort}>Class <SortIcon columnKey="class" /></Th>
            <Th width="w-[180px]" sortKey="term" onSort={handleSort}>Term <SortIcon columnKey="term" /></Th>
            <Th width="w-[120px]" align="center">Action</Th>
            <Th /> {/* Spacer */}
          </THead>
          <TBody>
            {paginatedData.length > 0 ? paginatedData.map((row, index) => (
              <Tr key={index} index={index}>
                <Td isFirst>
                  <span className="text-[13px] font-semibold text-gray-400">{(page - 1) * limit + index + 1}</span>
                </Td>
                <Td><span className="text-[13px] font-bold text-black tracking-tight">{row.class}</span></Td>
                <Td>
                  <SectionPill value={row.term} />
                </Td>
                <Td align="center">
                  <IconButton onClick={() => handleViewDetails(row)}>
                    <Eye size={16} />
                  </IconButton>
                </Td>
                <Td /> {/* Spacer */}
              </Tr>
            )) : (
              <EmptyRow colSpan={5} message="No exam time tables found." />
            )}
          </TBody>
        </TablePrimitive>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => updateFilters('page', String(p))} />
      </DataTable>

      {/* Details Modal */}
      <TimeTableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedTimetable} 
        onPrevClass={handlePrevClass}
        onNextClass={handleNextClass}
      />
    </PageWrapper>
  );
};
