'use client';

import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeLogEntry, HistoryEntry, SubAdminHistoryViewProps } from '@/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ', '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
}

function formatAction(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatFieldName(name: string): string {
  // Handle specific cases if needed
  if (name === 'alternateMobileNumber') return 'Alternate Mobile Number';
  if (name === 'mobileNumber') return 'Mobile Number';
  if (name === 'dateOfBirth') return 'Date of Birth';
  
  // Generic camelCase to Title Case
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export const SubAdminHistoryView: React.FC<SubAdminHistoryViewProps> = ({ adminName, entries }) => {
  const router = useRouter();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h2 className="text-[20px] font-bold text-blue-900 tracking-tight">
              View Changes{adminName ? ': ' : ''}<span className="text-blue-600">{adminName ?? ''}</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Profile Audit History</p>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-neutral-200 p-12 text-center text-gray-400 text-[13px] font-medium">
          No history found.
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-neutral-200 p-10 divide-y divide-gray-200/60 animate-in zoom-in-95 duration-500 delay-150">
          {entries.map((entry, idx) => (
            <div key={entry.id} className={`${idx !== 0 ? 'pt-12 mt-12' : ''} space-y-6`}>
              <div className="space-y-1">
                <p className="text-[14px] font-black text-blue-900 tracking-tight">{formatAction(entry.action)}</p>
                <p className="text-[12px] font-bold text-gray-400">
                  {formatDate(entry.createdAt)} &nbsp;·&nbsp; by {entry.performedBy.name}
                </p>
              </div>

              <div className="space-y-4">
                {entry.changes.map((change, i) => (
                  <div key={i} className="grid grid-cols-[200px_1fr] gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest shrink-0">
                      {formatFieldName(change.fieldName)}:
                    </p>
                    <div className="flex items-center gap-4 font-black text-[13px]">
                      <span className="text-gray-400/80">{change.oldValue || 'N/A'}</span>
                      <div className="w-4 h-[1px] bg-gray-200 shrink-0" />
                      <span className="text-blue-600">{change.newValue || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
