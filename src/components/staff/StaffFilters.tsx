'use client';

import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { Gender, StaffType, StaffStatus } from '@/types/staff';
import { StaffFiltersProps } from "@/types/components/StaffFilters";

export function StaffFilters({
  searchQuery,
  onSearchChange,
  filterGender,
  onGenderChange,
  filterStaffType,
  onStaffTypeChange,
  filterStatus,
  onStatusChange,
  showStatusFilter = true,
  showSearch = true,
  className = '',
}: StaffFiltersProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Search Box */}
      {showSearch && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name, Employee ID or Mobile..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 w-72 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0F172A]/20 focus:outline-none"
          />
        </div>
      )}

      {/* Gender Filter */}
      <Select
        value={filterGender}
        onValueChange={(value) => onGenderChange(value as Gender | '')}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Genders</SelectItem>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
        </SelectContent>
      </Select>

      {/* Staff Type Filter */}
      <Select
        value={filterStaffType}
        onValueChange={(value) => onStaffTypeChange(value as StaffType | '')}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Staff Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Staff Types</SelectItem>
          <SelectItem value="Teaching">Teaching</SelectItem>
          <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      {showStatusFilter && (
        <Select
          value={filterStatus}
          onValueChange={(value) => onStatusChange(value as StaffStatus | '')}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="">All Statuses</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
