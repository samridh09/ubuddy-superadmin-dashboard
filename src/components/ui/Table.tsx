import React, { useState, useMemo } from 'react';
import { Column, TableProps } from "@/types/components/Table";

export function Table<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    const key = (col.id || col.accessorKey) as string;
    if (!key) return;
    if (sortConfig?.key === key) {
      setSortConfig(sortConfig.direction === 'asc' ? { key, direction: 'desc' } : null);
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const column = columns.find(c => (c.id || c.accessorKey) === sortConfig.key);
    if (!column) return data;
    return [...data].sort((a, b) => {
      if (column.sortFn) return sortConfig.direction === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a);
      const aVal = a[column.accessorKey as keyof T];
      const bVal = b[column.accessorKey as keyof T];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortConfig]);

  if (loading) {
    return <div className="w-full py-10 flex justify-center items-center text-neutral-400">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="w-full py-10 flex justify-center items-center text-neutral-400">{emptyMessage}</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-[14px] text-gray-600">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col, index) => {
              const key = (col.id || col.accessorKey) as string;
              const isSorted = sortConfig?.key === key;
              return (
                <th
                  key={index}
                  onClick={() => handleSort(col)}
                  className={`py-4 px-8 font-semibold text-gray-400 text-[12px] capitalize tracking-tight ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:text-gray-600 transition-colors' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${col.className?.includes('right') ? 'justify-end' : ''}`}>
                    {col.header}
                    {col.sortable && (
                      <span className="flex flex-col text-[10px] leading-[0.5] text-gray-300 ml-1">
                        <span className={isSorted && sortConfig.direction === 'asc' ? 'text-[#0F172A]' : ''}>▲</span>
                        <span className={isSorted && sortConfig.direction === 'desc' ? 'text-[#0F172A]' : ''}>▼</span>
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-100/60 hover:bg-gray-50/40 transition-colors last:border-0 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, index) => (
                <td key={index} className={`py-4 px-8 text-[14px] text-[#0F172A] ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : (row[col.accessorKey as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
