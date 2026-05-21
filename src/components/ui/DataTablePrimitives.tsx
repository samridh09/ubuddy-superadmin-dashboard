'use client';

import React from 'react';
import { ThProps, TdProps } from "@/types/components/DataTablePrimitives";

/**
 * Shared Table Primitives for consistent data tables across the application.
 * Follows the Super-Admin styling: 100px S. No. column and black body text.
 */

export const DataTable: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-visible ${className}`}>
    {children}
  </div>
);

export const Table: React.FC<{ children: React.ReactNode; className?: string; fixed?: boolean; overflowVisible?: boolean }> = ({ children, className = '', fixed = false, overflowVisible = false }) => (
  <div className={`${overflowVisible ? 'overflow-visible' : 'overflow-x-auto'} rounded-[32px]`}>
    <table className={`w-full text-left border-collapse ${fixed ? 'table-fixed' : ''} ${className}`}>
      {children}
    </table>
  </div>
);

export const THead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <thead className={`bg-gray-50/50 border-b border-gray-100 ${className}`}>
    <tr>{children}</tr>
  </thead>
);

export const TBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-gray-50 ${className}`}>{children}</tbody>
);

export const Tr: React.FC<{ children: React.ReactNode; className?: string; index?: number }> = ({ children, className = '', index }) => (
  <tr className={`hover:bg-blue-50/30 transition-colors group ${className}`}>
    {children}
  </tr>
);
/** Standard sortable (or static) table header cell - keeps gray-400 text color */
export const Th: React.FC<ThProps> = ({
  children,
  sortKey,
  onSort,
  align = 'left',
  width,
  className = '',
  isFirst = false,
}) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right pr-12' : '';
  const paddingClass = isFirst ? 'pl-12' : 'px-8';
  const clickable = sortKey && onSort;
  return (
    <th
      onClick={clickable ? () => onSort!(sortKey!) : undefined}
      className={`${paddingClass} py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest
        ${alignClass} ${width ?? ''} ${clickable ? 'cursor-pointer group' : ''} ${className}`}
    >
      {children && (
        <div className={`flex items-center gap-0.5 transition-colors ${clickable ? 'group-hover:text-gray-600' : ''} ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
          {children}
        </div>
      )}
    </th>
  );
};

/** Specialized Th for Serial Numbers to ensure 100px consistency */
export const SNoTh = ({ isFirst = true, className = '' }: { isFirst?: boolean; className?: string }) => (
  <Th width="w-[100px]" isFirst={isFirst} className={className}>S. No.</Th>
);
/** Standard table data cell — enforces black text color for body consistency */
export const Td: React.FC<TdProps> = ({ children, align = 'left', className = '', isFirst = false, ...rest }) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
  const paddingClass = isFirst ? 'pl-12' : 'px-8';
  return (
    <td {...rest} className={`${paddingClass} py-5 ${alignClass} text-[13px] font-semibold text-black ${className}`}>
      {children}
    </td>
  );
};

export const EmptyRow: React.FC<{ colSpan: number; message?: string }> = ({ colSpan, message = 'No records found.' }) => (
  <tr>
    <td colSpan={colSpan} className="py-20 text-center">
      <p className="text-[13px] font-medium text-gray-400 italic">{message}</p>
    </td>
  </tr>
);

export const SkeletonTableRows: React.FC<{ rows?: number; cols: number[] }> = ({ rows = 5, cols }) => (
  <>
    {Array.from({ length: rows }).map((_, ri) => (
      <tr key={ri} className="border-b border-gray-50/50">
        {cols.map((w, ci) => {
          // Add subtle variation to widths if they aren't 0
          const variation = w > 0 ? (ri % 3 === 0 ? 5 : ri % 2 === 0 ? -5 : 0) : 0;
          const finalWidth = Math.max(10, w + variation);
          
          return (
            <td key={ci} className={`${ci === 0 ? 'pl-12' : 'px-8'} py-5`}>
              {w > 0 ? (
                <div 
                  className="bg-gray-100 rounded-lg animate-pulse h-4" 
                  style={{ width: `${finalWidth}%` }} 
                />
              ) : null}
            </td>
          );
        })}
      </tr>
    ))}
  </>
);
