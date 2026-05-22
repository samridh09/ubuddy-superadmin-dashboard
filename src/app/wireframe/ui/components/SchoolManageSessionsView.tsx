'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Eye, Lock, Plus, Calendar, Trash2, X } from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';
import {
  PageWrapper, PageHeader, FilterBox, PrimaryButton, SecondaryButton,
  DataTable, Table, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import { CustomSelect } from './CustomSelect';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SchoolSession, SchoolManageSessionsViewProps } from '@/types';
import { useAuth } from '@/providers/auth-provider';

export const SchoolManageSessionsView: React.FC<SchoolManageSessionsViewProps> = ({ schoolName, initialSessions, schoolId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const base = useBasePath();
  const [sessions, setSessions] = useState<SchoolSession[]>(initialSessions);
  const [selectedSessionTemplate, setSelectedSessionTemplate] = useState('2025-2026');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <PageWrapper>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border border-gray-100 shadow-none rounded-[32px]">
          <div className="px-10 py-8 border-b border-gray-50">
            <h3 className="text-[20px] font-bold text-blue-900 tracking-tight">Create New Session</h3>
            <p className="text-[12px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Add a new academic year to the institution</p>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Session Year</label>
              <input type="text" placeholder="e.g., 2025-2026" className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl px-6 text-[14px] font-bold text-blue-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-200 focus:bg-white transition-all shadow-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
                <DateInput value={startDate} onChange={setStartDate} calendarDisabled={{ before: new Date('2020-01-01') }} />
                <p className="text-[10px] font-medium text-gray-400 px-1 mt-1">Must be on or after January 1, 2020</p>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
                <DateInput value={endDate} onChange={setEndDate} calendarDisabled={startDate ? { before: new Date(startDate) } : undefined} />
                <p className="text-[10px] font-medium text-gray-400 px-1 mt-1">Must be greater than start date</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <PrimaryButton className="h-14 px-12 text-[15px] shadow-none" onClick={() => setIsModalOpen(false)}>
                Create Session
              </PrimaryButton>
              <SecondaryButton className="h-14 px-10 text-[15px] border-gray-100 text-gray-500 shadow-none" onClick={() => setIsModalOpen(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | Manage Sessions`}
        showBack
        onBack={() => router.push(`${base}/school`)}
      />

      {/* Top Filter / Create Bar */}
      <FilterBox>
        <div className="flex-1" />
        <PrimaryButton onClick={() => setIsModalOpen(true)} className="h-[46px] shadow-none">
          <Plus size={18} />
          Create Session
        </PrimaryButton>
      </FilterBox>

      {/* Table */}
      <DataTable>
        <Table>
          <THead>
            <Th width="w-[120px]" className="pl-12">S. No.</Th>
            <Th width="w-[300px]">Academic Year</Th>
            <Th width="w-[500px]">Session Dates</Th>
            <Th width="w-[280px]" align="center">Actions</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {sessions.map((session, index) => (
              <Tr key={session.id} index={index}>
                <Td className="pl-12">
                  <span className="text-[13px] font-semibold text-gray-400">
                    {index + 1}
                  </span>
                </Td>
                <Td>
                  <span className="text-[14px] font-bold text-blue-900 tracking-tight whitespace-nowrap">
                    {session.academicYear}
                  </span>
                </Td>
                <Td>
                  <span className="text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                    {session.startDate} — {session.endDate}
                  </span>
                </Td>
                <Td align="center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => router.push(`${base}/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${session.id}`)}
                      className="inline-flex items-center px-8 py-2.5 bg-white border-2 border-gray-100 hover:border-blue-400 text-blue-900 text-[12px] font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-none"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => router.push(`${base}/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${session.id}&view=true`)}
                      className="inline-flex items-center gap-1.5 px-8 py-2.5 bg-white border-2 border-gray-100 hover:border-blue-400 text-blue-900 text-[12px] font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-none"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </Td>
                <Td></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );
};
