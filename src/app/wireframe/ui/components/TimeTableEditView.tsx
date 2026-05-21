'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, X, ChevronDown, Check, Scissors } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import {
  PageWrapper, PageHeader, PrimaryButton, SecondaryButton, IconButton
} from './ui';
import { TimetableRowData, TIMETABLE_SUBJECTS, TIMETABLE_EDIT_ROWS } from '@/mock/timetable.mock';
import { TimeTableEditViewProps } from '@/types';

export const TimeTableEditView: React.FC<TimeTableEditViewProps> = ({ onBack }) => {
  const [session, setSession] = useState('2025-26');
  const [term, setTerm] = useState('Term I');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [displayClasses, setDisplayClasses] = useState(['Pre-Nursery', 'L.K.G.', 'I', 'Nursery', 'II', 'III', 'IV', 'V']);
  
  const [rows, setRows] = useState<TimetableRowData[]>(TIMETABLE_EDIT_ROWS);

  const [activeSelector, setActiveSelector] = useState<{ rowId: string, className: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ rowId: string, className: string, x: number, y: number } | null>(null);
  const [cutSubject, setCutSubject] = useState<{ rowId: string, className: string, subject: string, subIndex: number } | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.log('Fullscreen not supported or denied');
      }
    };
    enterFullscreen();

    // Exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setActiveSelector(null);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addRow = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setRows([...rows, { id: newId, date: '', day: '', classSubjects: {} }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRowDate = (id: string, dateStr: string) => {
    setRows(rows.map(row => {
        if (row.id === id) {
            let day = '';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                if (!isNaN(dateObj.getTime())) {
                    day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                }
            }
            return { ...row, date: dateStr, day: day };
        }
        return row;
    }));
  };

  const addSubject = (rowId: string, className: string, subject: string) => {
    setRows(rows.map(row => {
        if (row.id === rowId) {
            const subs = [...(row.classSubjects[className] || []), subject];
            return { ...row, classSubjects: { ...row.classSubjects, [className]: subs } };
        }
        return row;
    }));
    setActiveSelector(null);
  };

  const removeSubject = (rowId: string, className: string, subIndex: number) => {
    setRows(rows.map(row => {
        if (row.id === rowId) {
            const subs = [...(row.classSubjects[className] || [])];
            subs.splice(subIndex, 1);
            return { ...row, classSubjects: { ...row.classSubjects, [className]: subs } };
        }
        return row;
    }));
  };

  const getAvailableSubjects = (className: string) => {
    const usedSubjects = new Set<string>();
    rows.forEach(row => {
        (row.classSubjects[className] || []).forEach(sub => usedSubjects.add(sub));
    });
    return TIMETABLE_SUBJECTS.filter(sub => !usedSubjects.has(sub));
  };

  const handleCellRightClick = (e: React.MouseEvent, rowId: string, className: string) => {
    e.preventDefault();
    const hasSubjects = (rows.find(r => r.id === rowId)?.classSubjects[className] || []).length > 0;
    if (hasSubjects) {
      setContextMenu({ rowId, className, x: e.clientX, y: e.clientY });
    }
  };

  const handleCutSubject = (rowId: string, className: string) => {
    const subjects = rows.find(r => r.id === rowId)?.classSubjects[className] || [];
    if (subjects.length > 0) {
      setCutSubject({ rowId, className, subject: subjects[0], subIndex: 0 });
      removeSubject(rowId, className, 0);
    }
    setContextMenu(null);
  };

  const handlePasteSubject = (rowId: string, className: string) => {
    if (cutSubject) {
      addSubject(rowId, className, cutSubject.subject);
      setCutSubject(null);
    }
  };

  return (
    <PageWrapper>
      {/* Top Header */}
      <PageHeader 
        title="Edit Time Table"
        showBack
        onBack={onBack}
        actions={
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Session:</span>
              <span className="text-sm font-bold text-blue-900">{session}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Term:</span>
              <span className="text-sm font-bold text-blue-900">{term}</span>
            </div>
            <IconButton onClick={addRow} variant="primary">
                <Plus size={18} strokeWidth={2.5} />
            </IconButton>
          </>
        }
      />

      {/* Main Edit Table Card */}
      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-none animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="overflow-auto scrollbar-custom max-h-[82vh] relative">
          <table className="w-full text-left border-collapse border-separate border-spacing-0">
            <thead className="sticky top-0 z-50 bg-gray-50/50">
              <tr>
                <th className="sticky left-0 z-[60] bg-gray-50 px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-r border-gray-100 min-w-[60px]">Action</th>
                <th className="sticky left-[60px] z-[60] bg-gray-50 px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-r border-gray-100 min-w-[140px]">Date</th>
                <th className="sticky left-[200px] z-[60] bg-gray-50 px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-r border-gray-100 min-w-[70px]">Day</th>
                {displayClasses.map(cls => (
                  <th key={cls} className="px-5 py-3 text-[13px] font-extrabold text-blue-900 uppercase tracking-wide text-center border-b border-r border-gray-100 min-w-[180px] last:border-r-0">
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                  {/* Action Column (Sticky Left) */}
                  <td className="sticky left-0 z-40 bg-white group-hover:bg-[#fcfdfe] px-4 py-3 border-r border-gray-100 text-center transition-colors">
                    <IconButton
                        onClick={() => removeRow(row.id)}
                        variant="danger"
                    >
                        <Trash2 size={14} />
                    </IconButton>
                  </td>

                  {/* Date Column (Sticky Left) */}
                  <td className="sticky left-[60px] z-40 bg-white group-hover:bg-[#fcfdfe] px-4 py-3 border-r border-gray-100 transition-colors">
                    <div className="relative group/date max-w-[120px]">
                        <input 
                            type="text" 
                            value={row.date} 
                            onChange={(e) => updateRowDate(row.id, e.target.value)}
                            placeholder="DD-MM-YYYY"
                            className="w-full bg-white border border-gray-100 rounded-lg py-2 px-3 text-[12px] font-bold text-blue-900 focus:outline-none focus:border-blue-500 transition-all pr-8 hover:border-gray-200"
                        />
                        <Calendar size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/date:text-blue-500 pointer-events-none transition-colors" />
                    </div>
                  </td>

                  {/* Day Column (Sticky Left) */}
                  <td className="sticky left-[200px] z-40 bg-white group-hover:bg-[#fcfdfe] px-4 py-3 border-r border-gray-100 text-[12px] font-bold transition-colors">
                    <span className={row.day.toLowerCase() === 'sun' ? 'text-red-500' : 'text-gray-400'}>
                        {row.day || '-'}
                    </span>
                  </td>

                  {/* Classes Columns */}
                  {displayClasses.map(cls => (
                    <td 
                      key={cls} 
                      className="px-5 py-3 border-r border-gray-100 last:border-r-0 relative overflow-visible"
                      onContextMenu={(e) => handleCellRightClick(e, row.id, cls)}
                    >
                        <div className="space-y-2 overflow-visible">
                            {(row.classSubjects[cls] || []).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-gray-50/50 border border-dashed border-gray-200 rounded-lg items-center">
                                {row.classSubjects[cls]?.map((sub, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-[12px] font-bold animate-in zoom-in-95 group/tag border border-blue-200 shadow-none">
                                      {sub}
                                      <button 
                                          onClick={() => removeSubject(row.id, cls, sIdx)}
                                          className="opacity-0 group-hover/tag:opacity-60 hover:!opacity-100 transition-all ml-0.5 bg-white/10 rounded-sm p-0.5"
                                      >
                                          <X size={10} strokeWidth={3} />
                                      </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                      setActiveSelector(activeSelector?.rowId === row.id && activeSelector?.className === cls ? null : { rowId: row.id, className: cls });
                                    }}
                                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black transition-all border duration-300 cursor-pointer ${activeSelector?.rowId === row.id && activeSelector?.className === cls ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-blue-900 border-gray-100 hover:bg-gray-50 hover:border-gray-200 shadow-none'}`}
                                >
                                    <Plus size={14} strokeWidth={3} />
                                    {(row.classSubjects[cls] || []).length === 0 && (
                                      <span>SELECT SUBJECT</span>
                                    )}
                                </button>

                                {activeSelector?.rowId === row.id && activeSelector?.className === cls && (
                                    <div ref={selectorRef} className="absolute left-0 top-full mt-1.5 w-full bg-white border border-gray-100 rounded-xl z-[100] p-1 animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-blue-900/10">
                                        <div className="max-h-[200px] overflow-y-auto scrollbar-custom">
                                            {getAvailableSubjects(cls).length > 0 ? (
                                                getAvailableSubjects(cls).map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => addSubject(row.id, cls, sub)}
                                                        className="w-full text-left px-3 py-2 text-[11px] font-bold text-blue-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all flex items-center justify-between group"
                                                    >
                                                        {sub}
                                                        <Check size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-3 py-4 text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider italic bg-gray-50/50 rounded-lg">
                                                    Limit Reached
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Add Row Button */}
              <tr className="bg-gray-50/50">
                <td colSpan={3 + displayClasses.length} className="p-6 text-center">
                    <button 
                        onClick={addRow}
                        className="w-[350px] mx-auto flex items-center justify-center gap-3 px-8 py-4 border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-400 hover:text-blue-900 rounded-[20px] transition-all duration-500 group active:scale-95 shadow-none cursor-pointer"
                    >
                        <span className="text-[12px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                            Add more dates
                            <Plus size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700" />
                        </span>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] p-1.5 animate-in fade-in zoom-in-95 duration-200"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleCutSubject(contextMenu.rowId, contextMenu.className)}
            className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-3"
          >
            <Scissors size={14} />
            Cut
          </button>
          <button
            onClick={() => {
              setActiveSelector({ rowId: contextMenu.rowId, className: contextMenu.className });
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-3"
          >
            <Plus size={14} />
            Add Subject
          </button>
        </div>
      )}
    </PageWrapper>
  );
};
