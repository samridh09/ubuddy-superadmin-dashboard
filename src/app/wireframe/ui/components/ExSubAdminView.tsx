'use client';

import React from 'react';
import {
  PageWrapper, PageHeader, FilterBox, SearchInput,
  DataTable, Table, THead, TBody, Th, Td, Tr,
  EmptyRow
} from './ui';
import { ExSubAdminViewProps } from '@/types';

export const ExSubAdminView: React.FC<ExSubAdminViewProps> = ({
  query, updateFilters, data, handleSort, SortIcon
}) => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Ex Sub-Admin Management"
      />

      {/* Filters */}
      <FilterBox>
        <SearchInput
          label="Search Ex Sub Admin"
          placeholder="type sub admin name....."
          value={query}
          onChange={(val) => updateFilters('query', val)}
          width="w-full max-w-[340px]"
        />
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[80px]"  sortKey="id"           onSort={handleSort}>S. No.          <SortIcon columnKey="id" /></Th>
            <Th width="w-[200px]" sortKey="name"         onSort={handleSort}>Name          <SortIcon columnKey="name" /></Th>
            <Th                   sortKey="createdOn"    onSort={handleSort}>Created on    <SortIcon columnKey="createdOn" /></Th>
            <Th                   sortKey="createdBy"    onSort={handleSort}>Created by    <SortIcon columnKey="createdBy" /></Th>
            <Th                   sortKey="terminatedOn" onSort={handleSort}>Terminated On <SortIcon columnKey="terminatedOn" /></Th>
            <Th                   sortKey="terminatedBy" onSort={handleSort}>Terminated by <SortIcon columnKey="terminatedBy" /></Th>
          </THead>
          <TBody>
            {data.length > 0 ? data.map((row, index) => (
              <Tr key={row.id} index={index}>
                <Td><span className="text-[13px] font-semibold text-gray-400">{index + 1}</span></Td>
                <Td><span className="text-[13px] font-semibold text-blue-900 tracking-tight">{row.name}</span></Td>
                <Td><span className="text-[12px] font-semibold text-gray-600">{row.createdOn}</span></Td>
                <Td><span className="text-[13px] font-semibold text-blue-900">{row.createdBy}</span></Td>
                <Td><span className="text-[12px] font-semibold text-red-500">{row.terminatedOn}</span></Td>
                <Td><span className="text-[13px] font-semibold text-blue-900">{row.terminatedBy}</span></Td>
              </Tr>
            )) : (
              <EmptyRow colSpan={6} message="No ex sub-admins found." />
            )}
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );
};
