'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import type { Enquiry } from '@/types/enquiry';
import type { AcademicClass } from '@/lib/services/academic-service';
import { formatMobileNumber } from '@/lib/utils/staff-formatting';
import { EnquiryTableProps } from "@/types/components/EnquiryTable";

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    NEW: 'bg-blue-50 text-blue-600 border-blue-100',
    FOLLOW_UP: 'bg-purple-50 text-purple-600 border-purple-100',
    CONVERTED: 'bg-green-50 text-green-600 border-green-100',
    REJECTED: 'bg-red-50 text-red-600 border-red-100',
    CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600 border-gray-200';
}

export function EnquiryTable({
  enquiries,
  loading = false,
  classMap,
  onRowClick,
  onStarToggle,
  emptyMessage = 'No enquiries found',
  onAddNew,
}: EnquiryTableProps) {
  const getClassName = (classId: string) => {
    const cls = classMap[classId];
    if (!cls) return classId.slice(0, 8) + '...';
    return cls.display_name || `${cls.name}${cls.section ? ' - ' + cls.section : ''}`;
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden min-h-[400px]">
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#0F172A] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-[18px] font-bold text-[#0F172A]">{emptyMessage}</h3>
        <p className="text-[14px] text-gray-500 mt-2 max-w-sm mx-auto">
          Start by creating a new admission enquiry.
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="mt-6 px-6 py-2.5 bg-[#0F172A] text-white rounded-xl font-medium text-[13px] transition-all hover:bg-[#1e293b] shadow-sm"
          >
            New Enquiry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-neutral-50/80 border-b border-gray-100/60">
              <th className="w-10 px-4 py-3"></th>
              <th className="text-left px-6 py-3 font-semibold text-black text-[10px] uppercase tracking-wider w-[100px]">
                S. No.
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Student
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Class
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Follow Up
              </th>
              <th className="text-left px-6 py-3 font-semibold text-black text-xs uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {enquiries.map((enq, index) => (
              <tr
                key={enq.id}
                onClick={() => onRowClick(enq)}
                className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={(e) => onStarToggle(enq.id, enq.is_starred, e)}
                    className="text-gray-300 hover:text-amber-400 transition-colors focus:outline-none"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        enq.is_starred ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 font-semibold text-black">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-black">{enq.student_name}</div>
                  <div className="text-[11px] text-black mt-0.5">
                    Source: {enq.source.replace(/_/g, ' ')}
                  </div>
                </td>
                <td className="px-6 py-4 text-black font-medium">
                  {getClassName(enq.class_id)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-black font-medium">
                    {formatMobileNumber(enq.primary_enquirer?.contact_number || 'N/A')}
                  </div>
                  <div className="text-[11px] text-black mt-0.5">
                    {enq.primary_enquirer?.name || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getStatusBadge(
                      enq.status,
                    )}`}
                  >
                    {enq.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {enq.follow_up_date ? (
                    <span className="text-[12px] text-purple-600 font-medium">
                      {new Date(enq.follow_up_date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-black text-[12px]">
                  {new Date(enq.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
