'use client';

import React from 'react';
import { Save, X } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  DataTable, Table, THead, TBody, Th, Td, Tr, EmptyRow,
  PrimaryButton, SecondaryButton, Pagination
} from './ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { StudentEnquiryViewProps } from '@/types';

export const StudentEnquiryView: React.FC<StudentEnquiryViewProps> = ({
  query, updateFilters, statusFilter, filteredData,
  handleSort, SortIcon, toggleStatus, handleSave, handleCancel, hasChanges,
  page, limit
}) => {
  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader title="Staff Permissions | Student Enquiry" />

      {/* Filters */}
      <FilterBox>
        <div className="w-[300px]">
          <CustomSelect
            label="Status"
            value={statusFilter}
            options={['All', 'Assigned', 'Unassigned']}
            onChange={(val) => updateFilters('status', val)}
          />
        </div>
        <div className="flex-1" />
        <SearchInput
          label="Search"
          placeholder="Search by staff name"
          value={query}
          onChange={(val) => updateFilters('query', val)}
          width="w-full max-w-[340px]"
        />
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <Th isFirst sortKey="id"     onSort={handleSort}>S. No.   <SortIcon columnKey="id" /></Th>
            <Th sortKey="staff"  onSort={handleSort}>Staff  <SortIcon columnKey="staff" /></Th>
            <Th sortKey="status" onSort={handleSort} align="right">Status <SortIcon columnKey="status" /></Th>
          </THead>
          <TBody>
            {paginatedData.length > 0 ? paginatedData.map((row, index) => (
              <Tr key={row.id} index={index}>
                <Td isFirst><span className="text-[13px] font-semibold text-gray-400">{(page - 1) * limit + index + 1}</span></Td>
                <Td>
                  <span className="text-[13px] font-bold text-blue-900 tracking-tight transition-all group-hover:translate-x-1 inline-block">
                    {row.staff}
                  </span>
                </Td>
                <Td align="right">
                  <div className="flex items-center justify-end gap-4">
                    <span className={`text-[11px] font-extrabold tracking-widest uppercase transition-all duration-500 ${
                      row.status === 'Assigned' ? 'text-blue-500' : 'text-gray-400 opacity-60'
                    }`}>
                      {row.status}
                    </span>
                    {/* Animated toggle switch */}
                    <button
                      onClick={() => toggleStatus(row.id)}
                      className={`relative w-14 h-7 rounded-full p-1 transition-all duration-500 border-none outline-none hover:scale-105 active:scale-95 ${
                        row.status === 'Assigned'
                          ? 'bg-blue-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'bg-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm transform ${
                        row.status === 'Assigned' ? 'translate-x-[26px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </Td>
              </Tr>
            )) : (
              <EmptyRow colSpan={3} message="No staff records matched your search." />
            )}
          </TBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => updateFilters('page', String(p))} />
      </DataTable>

      {/* Save confirmation Dialog */}
      <Dialog open={hasChanges} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-blue-900">Save Changes?</DialogTitle>
            <DialogDescription className="text-[13px] text-gray-400 font-medium">
              You have pending status updates for the student enquiry list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-3">
            <SecondaryButton onClick={handleCancel} className="flex-1">
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleSave} className="flex-1">
              Save Changes
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
