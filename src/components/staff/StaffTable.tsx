'use client';

import { useState } from 'react';
import { Eye, Edit2, Power, UserX } from 'lucide-react';
import type { Staff } from '@/types/staff';
import { calculateAge, formatMobileNumber } from '@/lib/utils/staff-formatting';
import { Table, THead, TBody, Tr, Th, Td, SNoTh } from '@/components/ui/DataTablePrimitives';
import { StaffTableProps } from "@/types/components/StaffTable";

function getInitials(name?: string): string {
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
}

function StaffAvatar({ name, imageUrl }: { name?: string; imageUrl?: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={name || 'staff profile'}
        className="h-10 w-10 rounded-full mr-3 object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="h-10 w-10 rounded-full bg-[#0F172A]/10 flex items-center justify-center mr-3">
      <span className="text-[#0F172A] font-semibold text-xs">
        {getInitials(name)}
      </span>
    </div>
  );
}

export function StaffTable({
  staff,
  loading = false,
  mode = 'view',
  onViewProfile,
  onEditProfile,
  onToggleStatus,
  onTerminate,
}: StaffTableProps) {
  const formatStatus = (status: Staff['status']) =>
    status.charAt(0) + status.slice(1).toLowerCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#0F172A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="p-16 text-center text-neutral-500">
        No staff matches your current filters.
      </div>
    );
  }

  return (
    <Table className="whitespace-nowrap">
        <THead>
          <SNoTh />
          <Th>Staff Name</Th>
          <Th>Employee ID</Th>
          <Th>Gender</Th>
          <Th>Contact</Th>
          <Th>Age</Th>
          <Th align="center">Status</Th>
          <Th align="right" className="pr-12">Action</Th>
        </THead>
        <TBody>
          {staff.map((member, idx) => (
            <Tr key={member.id}>
              <Td isFirst>{idx + 1}</Td>
              <Td>
                <div className="flex items-center">
                  <StaffAvatar name={member.name} imageUrl={member.profileImageUrl} />
                  <span className="text-[13px] font-bold text-black tracking-tight">
                    {(member.name || 'N/A').toUpperCase()}
                  </span>
                </div>
              </Td>
              <Td>{member.employeeId || 'N/A'}</Td>
              <Td>{member.gender || 'N/A'}</Td>
              <Td>{formatMobileNumber(member.mobileNumber) || 'N/A'}</Td>
              <Td>{calculateAge(member.dob) || 'N/A'}</Td>
              <Td align="center">
                <span
                  className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${
                    member.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : member.status === 'TERMINATED'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}
                >
                  {member.status}
                </span>
              </Td>
              <Td align="right" className="pr-12">
                {mode === 'view' && (
                  <button
                    onClick={() => onViewProfile(member.id)}
                    className="bg-blue-600 text-white shadow-lg shadow-blue-950/5 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
                  >
                    View Profile
                  </button>
                )}
                {mode === 'edit' && onEditProfile && (
                  <button
                    onClick={() => onEditProfile(member.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-white border-gray-100 text-black hover:border-blue-400 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
                {mode === 'active_inactive' && onToggleStatus && (
                  <button
                    onClick={() => onToggleStatus(member)}
                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border-2 bg-white border-gray-100 text-black hover:border-blue-400 active:scale-95 transition-all whitespace-nowrap"
                  >
                    Change Status
                  </button>
                )}
                {mode === 'terminate' &&
                  onTerminate &&
                  (member.status === 'INACTIVE' ? (
                    <button
                      onClick={() => onTerminate(member)}
                      className="text-red-500 text-[12px] font-bold uppercase tracking-widest hover:underline active:scale-95 transition-all"
                    >
                      Terminate
                    </button>
                  ) : (
                    <span className="text-gray-300 text-[11px] font-bold uppercase tracking-widest">
                      Make inactive first
                    </span>
                  ))}
                {mode === 'ex_staff' && (
                  <button
                    onClick={() => onViewProfile(member.id)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold text-black uppercase tracking-widest bg-white border-2 border-gray-100 rounded-xl hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <Eye size={14} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                    View Profile
                  </button>
                )}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
  );
}
