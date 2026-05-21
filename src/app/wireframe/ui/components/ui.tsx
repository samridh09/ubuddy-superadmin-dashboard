'use client';

/**
 * Wireframe UI — Shared Component Primitives
 *
 * Single source of truth for all reusable UI building-blocks used across
 * every page in /wireframe/ui.  Import from here instead of hard-coding
 * Tailwind strings in individual view files.
 *
 * Design tokens (reference):
 *  - Page title    : text-[22px] font-bold text-blue-900 tracking-tight
 *  - TH text       : text-[10px] font-bold text-gray-400 uppercase tracking-widest
 *  - TH padding    : px-8 py-5
 *  - TD padding    : px-8 py-5
 *  - THEAD bg      : bg-gray-50/50 border-b border-gray-100
 *  - Row hover     : hover:bg-gray-50/50
 *  - Row divider   : divide-y divide-gray-100
 *  - Filter box    : p-7 bg-white border border-gray-100 rounded-3xl
 *  - Table wrapper : bg-white border border-gray-100 rounded-3xl
 *  - Primary btn   : px-6 py-2.5 text-[13px] font-bold text-white bg-blue-900 rounded-xl
 *  - Secondary btn : px-6 py-2.5 text-[13px] font-bold text-blue-900 bg-white border-2 border-gray-100 rounded-xl
 *  - Back button   : w-10 h-10 rounded-xl bg-white border border-gray-100
 *  - Section card  : bg-white rounded-3xl border border-gray-100
 */

import React from 'react';
import { ChevronLeft, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PageHeaderProps, SearchInputProps, ButtonProps, StatusBadgeProps, AssignedStaffCellProps, SectionHeadingProps } from '@/types';
import { CapacityBadgeProps, ToggleSwitchProps, DropdownMenuItemProps, PaginationProps } from "@/types/components/ui";

// ─── Page scaffold ────────────────────────────────────────────────────────────

/** Top-level page entry wrapper — handles smooth fade-in */
export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-fadeIn space-y-8 pb-32">
    {children}
  </div>
);

// ─── Header ───────────────────────────────────────────────────────────────────

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showBack = false, onBack, actions }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={onBack || (() => router.back())}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all duration-200 active:scale-95 shadow-none shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h2 className="text-[22px] font-bold text-black tracking-tight leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

// ─── Filter / Search panel ────────────────────────────────────────────────────

/** White rounded-3xl box that wraps all filter controls */
export const FilterBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-end gap-5 p-7 bg-white border border-gray-100 rounded-3xl animate-slideUp fill-mode-both" style={{ animationDelay: '100ms' }}>
    {children}
  </div>
);

export const SearchInput: React.FC<SearchInputProps> = ({
  label = 'Search',
  placeholder = 'Type to search...',
  value,
  onChange,
  width = 'w-[340px]',
}) => (
  <div className={`space-y-1 ${width}`}>
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">{label}</label>
    <div className="relative group/search">
      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-gray-500 transition-colors duration-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-all duration-300 placeholder-gray-200"
      />
    </div>
  </div>
);

// ─── Buttons ──────────────────────────────────────────────────────────────────

/** Solid dark primary action button */
export const PrimaryButton: React.FC<ButtonProps> = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={cn(
      'flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-xl',
      'hover:bg-blue-700 active:scale-95 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      className,
    )}
  >
    {children}
  </button>
);

/** Ghost/outline secondary button */
export const SecondaryButton: React.FC<ButtonProps> = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={cn(
      'flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-gray-700 bg-white',
      'border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50',
      'active:scale-95 cursor-pointer transition-all duration-300',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    )}
  >
    {children}
  </button>
);

/** Danger/destructive action — red text, shows in action menus */
export const DangerButton: React.FC<ButtonProps> = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={cn(
      'flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-red-500 bg-white',
      'border-2 border-red-50 rounded-xl hover:bg-red-50 hover:border-red-100',
      'active:scale-95 cursor-pointer transition-all duration-300',
      className
    )}
  >
    {children}
  </button>
);

/** Small square/round button for table row actions (e.g. Eye, Pencil) */
export const IconButton: React.FC<ButtonProps & { variant?: 'primary' | 'secondary' | 'danger' | 'blue' }> = ({ 
  children, className = '', variant = 'primary', ...rest 
}) => {
  const themes = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 hover:bg-gray-50',
    danger:    'bg-red-50 text-red-500 border-transparent hover:bg-red-500 hover:text-white',
    blue:      'bg-blue-600 text-white hover:bg-blue-700',
  };
  return (
    <button
      {...rest}
      className={cn(
        'p-2.5 rounded-xl transition-all duration-300 active:scale-90 cursor-pointer shadow-none flex items-center justify-center',
        themes[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

// ─── Table primitives ─────────────────────────────────────────────────────────

export { 
  DataTable, Table, THead, TBody, Tr, Th, SNoTh, Td, EmptyRow 
} from '@/components/ui/DataTablePrimitives';

// ─── Sort icon ─────────────────────────────────────────────────────────────────

/**
 * Returns a factory function (usable as a component) for sort icons.
 * Usage:
 *   const SortIcon = makeSortIcon(sortKey, sortDir);
 *   <Th sortKey="name" onSort={handleSort}> Name <SortIcon columnKey="name" /> </Th>
 */
export const makeSortIcon = (
  currentKey: string,
  currentDir: 'asc' | 'desc'
) => {
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (currentKey !== columnKey) return <ArrowUpDown size={12} className="ml-1 text-gray-300 opacity-60" />;
    return currentDir === 'asc'
      ? <ArrowUp size={12} className="ml-1 text-gray-500" />
      : <ArrowDown size={12} className="ml-1 text-gray-500" />;
  };
  SortIcon.displayName = 'SortIcon';
  return SortIcon;
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const DEFAULT_COLOR_MAP: Record<string, { dot: string; text: string }> = {
  Active:     { dot: 'bg-blue-400', text: 'text-blue-500' },
  Inactive:   { dot: 'bg-red-400',     text: 'text-red-400' },
  Assigned:   { dot: 'bg-blue-400', text: 'text-blue-500' },
  Unassigned: { dot: 'bg-red-400',     text: 'text-red-400' },
  Terminated: { dot: 'bg-orange-400',  text: 'text-orange-500' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const styles: Record<string, string> = {
    Active:     'bg-emerald-50 text-emerald-600 border-emerald-100',
    Inactive:   'bg-amber-50 text-amber-600 border-amber-100',
    Terminated: 'bg-rose-50 text-rose-600 border-rose-100',
    Assigned:   'bg-blue-50 text-blue-600 border-blue-100',
    Unassigned: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  const style = styles[normalizedStatus] ?? 'bg-gray-50 text-gray-400 border-gray-100';
  return (
    <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${style}`}>
      {status}
    </span>
  );
};

// ─── Assigned staff cell ──────────────────────────────────────────────────────

/** Dot + staff name display (read mode) */
export const AssignedStaffDisplay: React.FC<AssignedStaffCellProps> = ({
  staffName,
  unassignedLabel = 'Unassigned',
}) => {
  const isUnassigned = staffName === unassignedLabel;
  return (
    <div className="flex items-center gap-2.5 text-[13px] font-semibold text-blue-900 animate-fadeIn">
      <span className={`${isUnassigned ? 'text-gray-400 italic font-normal' : ''} transition-all duration-300 group-hover:translate-x-1`}>
        {staffName}
      </span>
    </div>
  );
};

// ─── Profile / detail view helpers ────────────────────────────────────────────

export const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl border border-gray-100 overflow-hidden animate-slideUp fill-mode-both ${className}`} style={{ animationDelay: '50ms' }}>
    {children}
  </div>
);

/** Consistent section title with optional icon inside a SectionCard */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ icon, title }) => (
  <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-6">
    {icon && <span className="text-gray-400">{icon}</span>}
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
  </div>
);

/** Label + value pair in a profile grid */
export const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="space-y-1">
    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</div>
    <div className="text-[13px] font-semibold text-gray-700">{value || 'N/A'}</div>
  </div>
);

// ─── Stat / capacity badge ────────────────────────────────────────────────────
export const CapacityBadge: React.FC<CapacityBadgeProps> = ({ label = 'Capacity', used, total }) => (
  <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl flex items-center gap-4 h-[44px]">
    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap">{label}</span>
    <div className="flex items-center gap-1.5 font-semibold text-[14px]">
      <span className="text-gray-600 font-bold">{used}</span>
      <span className="text-gray-200">/</span>
      <span className="text-gray-400">{total}</span>
    </div>
  </div>
);

// ─── Section pill / tag ───────────────────────────────────────────────────────

/** Small accent pill for Class Section values */
export const SectionPill = ({ value }: { value: string }) => (
  <span className="px-2.5 py-1 bg-blue-50/60 text-blue-600 rounded-md text-[11px] font-extrabold uppercase transition-all duration-300 group-hover:scale-110 inline-block">
    {value}
  </span>
);

// ─── Toggle Switch ────────────────────────────────────────────────────────────
/** Standard toggle/switch component for the admin panel */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative w-10 h-6 rounded-full transition-all duration-300 focus:outline-none ${
      checked ? 'bg-blue-500' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
        checked ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'
      }`}
    />
  </button>
);

// ─── Error Banner ─────────────────────────────────────────────────────────────

export const ErrorBanner = ({ message, onDismiss }: { message: string; onDismiss: () => void }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-[12px] font-bold text-red-500 animate-in fade-in duration-300">
    <span>{message}</span>
    <button onClick={onDismiss} className="ml-4 flex-shrink-0 text-red-300 transition-colors hover:text-red-500">
      <X size={14} />
    </button>
  </div>
);

// ─── Dropdown Menu ────────────────────────────────────────────────────────────

export const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; style?: React.CSSProperties }
>(({ children, className = '', style }, ref) => (
  <div
    ref={ref}
    style={style}
    className={`w-[200px] rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
  >
    <div className="py-2">{children}</div>
  </div>
));
DropdownMenu.displayName = 'DropdownMenu';
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  onClick,
  active = false,
  uppercase = true,
  children,
}) => (
  <button
    onClick={onClick}
    className={`w-full px-5 py-2.5 text-left text-[12px] font-bold tracking-wide transition-colors ${uppercase ? 'uppercase' : ''} ${
      active
        ? 'cursor-default bg-blue-50/50 text-blue-600'
        : 'text-gray-700 hover:bg-neutral-50 active:bg-neutral-100'
    }`}
  >
    {children}
  </button>
);

export const DropdownMenuDivider = () => <div className="mx-3 h-px bg-gray-50" />;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  total,
  hasMore, 
  onPageChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between px-12 py-5 bg-white border-t border-gray-100 rounded-b-3xl ${className}`}>
      <div className="flex items-center gap-8">
        {total !== undefined && (
          <div className="text-[13px] font-bold text-black">
            Total: <span className="text-black">{total}</span>
          </div>
        )}
        <div className="text-[12px] font-medium text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center px-4 py-2 text-[12px] font-bold text-gray-500 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages && !hasMore}
          className="flex items-center justify-center px-4 py-2 text-[12px] font-bold text-gray-500 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

