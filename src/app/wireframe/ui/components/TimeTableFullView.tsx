'use client';

import React from 'react';
import { Printer, FileText, FileSpreadsheet, Edit } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table as TablePrimitive, THead, TBody, Th, Td, Tr,
  PrimaryButton, SecondaryButton
} from './ui';
import { printFullTimetable, exportFullTimetableCSV, type FullViewRow } from './timetablePrintExport';
import { TIMETABLE_DATES, TIMETABLE_CLASSES, TIMETABLE_SCHEDULE_DATA } from '@/mock/timetable.mock';
import { TimeTableFullViewProps } from '@/types';

export const TimeTableFullView: React.FC<TimeTableFullViewProps> = ({ onBack, onEdit }) => {
  const fullViewRows: FullViewRow[] = TIMETABLE_DATES.map((d) => ({
    date: d.date,
    day: d.day,
    schedule: TIMETABLE_SCHEDULE_DATA[d.date] ?? {},
  }));

  return (
    <PageWrapper>
      {/* Header Area */}
      <PageHeader 
        title="Exam Schedule Overview"
        showBack
        onBack={onBack}
        actions={
          <>
            <button
              onClick={() => printFullTimetable(fullViewRows, TIMETABLE_CLASSES)}
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={() => printFullTimetable(fullViewRows, TIMETABLE_CLASSES)}
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95 cursor-pointer"
            >
              <FileText size={16} />
              PDF
            </button>
            <button
              onClick={() => exportFullTimetableCSV(fullViewRows, TIMETABLE_CLASSES)}
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
            <PrimaryButton onClick={onEdit}>
              <Edit size={16} />
              Edit
            </PrimaryButton>
          </>
        }
      />

      {/* Main Table Card */}
      <DataTable>
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-custom">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead className="sticky top-0 z-50 bg-blue-50">
              <tr>
                <th className="px-5 py-4 text-[14px] font-extrabold text-blue-700 uppercase tracking-wide border-r border-blue-200 whitespace-nowrap">Date</th>
                <th className="px-5 py-4 text-[14px] font-extrabold text-blue-700 uppercase tracking-wide border-r border-blue-200 whitespace-nowrap">Day</th>
                {TIMETABLE_CLASSES.map(cls => (
                  <th key={cls} className="px-5 py-4 text-[14px] font-extrabold text-blue-700 uppercase tracking-wide text-center border-r border-blue-200 last:border-r-0 min-w-[160px]">
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <TBody>
              {TIMETABLE_DATES.map((dateObj, idx) => (
                <Tr key={idx} index={idx}>
                  <Td className="text-[13px] font-bold text-blue-900 border-r border-gray-50/50 px-5 py-4 whitespace-nowrap">{dateObj.date}</Td>
                  <Td className="text-[13px] font-bold text-gray-400 border-r border-gray-50/50 px-5 py-4 whitespace-nowrap">{dateObj.day}</Td>
                  {TIMETABLE_CLASSES.map(cls => {
                    const subject = TIMETABLE_SCHEDULE_DATA[dateObj.date]?.[cls] || '-';
                    return (
                      <td key={cls} className="px-5 py-4 text-center border-r border-gray-50/50 last:border-r-0">
                        <span className={`text-[13px] ${subject === '-' ? 'text-gray-300 font-medium' : 'text-blue-900 font-bold'}`}>
                          {subject}
                        </span>
                      </td>
                    );
                  })}
                </Tr>
              ))}
            </TBody>
          </table>
        </div>
      </DataTable>
    </PageWrapper>
  );
};
