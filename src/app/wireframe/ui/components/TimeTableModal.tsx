'use client';

import React from 'react';
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DataTable, Table as TablePrimitive, THead, TBody, Th, Td, Tr, IconButton
} from './ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { printTimetable, TimetableDetail } from './timetablePrintExport';
import { TimeTableModalProps } from '@/types';

export const TimeTableModal: React.FC<TimeTableModalProps> = ({ 
    isOpen, onClose, data, onPrevClass, onNextClass 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[900px] w-[95vw] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl shadow-blue-950/20"
        showCloseButton={false}
      >
        {!data ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
             <p className="text-[13px] font-bold text-gray-400">Loading details...</p>
          </div>
        ) : (
          <>
            {/* Header - Fixed the 'white border' by matching container rounding */}
            <div className="bg-blue-50 px-12 py-8 flex justify-between items-start border-b border-blue-100 relative">
              <div className="space-y-1">
                <DialogTitle className="text-[22px] font-bold tracking-tight text-black m-0">Time Table Details</DialogTitle>
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest leading-none">Exam Schedule Overview</p>
              </div>
              <IconButton
                onClick={onClose}
                variant="secondary"
                className="bg-blue-100 text-blue-400 hover:bg-blue-200 hover:text-blue-600 border-transparent"
              >
                <span className="sr-only">Close</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </IconButton>
            </div>

            {/* Sub-header / Navigation */}
            <div className="px-12 py-8 bg-white flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-12">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session</span>
                        <span className="text-[15px] font-bold text-black">{data.session}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Term</span>
                        <span className="text-[15px] font-bold text-black">{data.term}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class Selection</span>
                        <div className="flex items-center gap-3">
                            <IconButton
                                onClick={onPrevClass}
                                variant="secondary"
                                className="p-1.5"
                            >
                                <ChevronLeft size={16} strokeWidth={2.5} />
                            </IconButton>
                            <span className="text-[15px] font-bold text-black min-w-[120px] text-center">{data.className}</span>
                            <IconButton 
                                onClick={onNextClass}
                                variant="secondary"
                                className="p-1.5"
                            >
                                <ChevronRight size={16} strokeWidth={2.5} />
                            </IconButton>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => printTimetable(data)}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-blue-100 text-blue-700 rounded-xl text-[13px] font-bold hover:bg-blue-200 transition-all duration-300 active:scale-95 group cursor-pointer shadow-none"
                >
                    <Printer size={16} className="group-hover:scale-110 transition-transform" />
                    Download / Print
                </button>
            </div>

            {/* Content Table */}
            <div className="px-12 pb-12 pt-8 overflow-y-auto max-h-[60vh]">
                <DataTable>
                    <TablePrimitive>
                        <THead>
                            <Th isFirst width="w-[80px]">S. No.</Th>
                            <Th width="w-[200px]">Exam Date</Th>
                            <Th>Subjects List</Th>
                        </THead>
                        <TBody>
                            {data.details.map((row, idx) => (
                                <Tr key={idx} index={idx}>
                                    <Td isFirst>
                                        <span className="text-[13px] font-bold text-gray-400">{idx + 1}</span>
                                    </Td>
                                    <Td>
                                        <span className="text-[14px] font-bold text-black">{row.date}</span>
                                    </Td>
                                    <Td>
                                        <div className="flex flex-wrap gap-2.5">
                                            {row.subjects.map((sub, sIdx) => (
                                                <span key={sIdx} className="px-3.5 py-1.5 bg-gray-50 text-black rounded-lg text-[12px] font-bold border border-gray-100 group-hover:bg-gray-100 transition-all duration-300">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </TablePrimitive>
                </DataTable>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
