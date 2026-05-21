'use client';

import { Search, Star, Archive } from 'lucide-react';
import type { EnquiryStatus } from '@/types/enquiry';
import { EnquiryFiltersProps, StatusTab } from "@/types/components/EnquiryFilters";

const STATUS_TABS: { id: StatusTab; label: string; color: string }[] = [
  { id: 'ALL', label: 'All', color: 'bg-gray-100 text-gray-700' },
  { id: 'PENDING', label: 'Pending', color: 'bg-amber-50 text-amber-700' },
  { id: 'NEW', label: 'New', color: 'bg-blue-50 text-blue-700' },
  { id: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-purple-50 text-purple-700' },
  { id: 'CONVERTED', label: 'Converted', color: 'bg-green-50 text-green-700' },
  { id: 'REJECTED', label: 'Rejected', color: 'bg-red-50 text-red-700' },
  { id: 'ARCHIVED', label: 'Archived', color: 'bg-gray-50 text-gray-500' },
];

export function EnquiryFilters({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  showStarredOnly,
  onStarredToggle,
  starredCount,
  className = '',
}: EnquiryFiltersProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search + Starred Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md shadow-sm rounded-lg overflow-hidden border border-neutral-200 bg-gray-50/50 flex items-center">
          <Search className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, phone, guardian..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent py-2 pl-3 pr-4 text-[13px] text-neutral-900 focus:outline-none placeholder-neutral-400"
          />
        </div>
        <button
          onClick={onStarredToggle}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg border transition-all ${
            showStarredOnly
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Star className={`w-4 h-4 ${showStarredOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
          Starred{starredCount > 0 ? ` (${starredCount})` : ''}
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                : `${tab.color} border-transparent hover:border-gray-200`
            }`}
          >
            {tab.id === 'ARCHIVED' && <Archive className="w-3 h-3" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
