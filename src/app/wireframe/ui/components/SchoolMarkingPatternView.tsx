'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Save, ChevronDown } from 'lucide-react';
import {
  PageWrapper, PageHeader, PrimaryButton
} from './ui';
import { SubjectMarking, SchoolMarkingPatternViewProps } from '@/types';

const SUBJECTS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science"
];

export const SchoolMarkingPatternView: React.FC<SchoolMarkingPatternViewProps> = ({ 
  schoolName, 
  schoolId, 
  sessionId 
}) => {
  const router = useRouter();
  const base = useBasePath();
  const [selectedClass, setSelectedClass] = useState('1st');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [patternCount, setPatternCount] = useState(3);
  const [patternNames, setPatternNames] = useState(['', '', '', '']);
  const [applyToAll, setApplyToAll] = useState(false);
  
  const [markingData, setMarkingData] = useState<SubjectMarking[]>(
    SUBJECTS.map(s => ({
      subject: s,
      patterns: Array(4).fill({ max: '', min: '' })
    }))
  );

  const updatePatternName = (index: number, name: string) => {
    const newNames = [...patternNames];
    newNames[index] = name;
    setPatternNames(newNames);
  };

  const updateMark = (subjectIndex: number, patternIndex: number, field: 'max' | 'min', value: string) => {
    const newData = [...markingData];
    newData[subjectIndex].patterns[patternIndex] = {
      ...newData[subjectIndex].patterns[patternIndex],
      [field]: value
    };

    // If applyToAll is on, copy this value to all subjects for this pattern
    if (applyToAll) {
      newData.forEach((s, idx) => {
        s.patterns[patternIndex] = {
          ...s.patterns[patternIndex],
          [field]: value
        };
      });
    }

    setMarkingData(newData);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Marking Pattern"
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/module/result?schoolId=${schoolId}&sessionId=${sessionId}`)}
      />

      <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-10 shadow-none">
        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-5 pr-12 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-300 transition-all cursor-pointer"
              >
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative group">
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="appearance-none h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-5 pr-12 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-300 transition-all cursor-pointer"
              >
                <option>Annual Exam</option>
                <option>Half Yearly</option>
                <option>Unit Test</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative group">
              <select 
                value={patternCount}
                onChange={(e) => setPatternCount(parseInt(e.target.value))}
                className="appearance-none h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-5 pr-12 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-300 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="ml-auto">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
              />
              <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Apply to all subjects</span>
            </label>
          </div>
        </div>

        {/* Marking Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-6 text-left text-[12px] font-black text-blue-900 uppercase tracking-widest w-[220px]">Subject</th>
                {Array(patternCount).fill(0).map((_, i) => (
                  <th key={i} className="px-8 py-6 text-center">
                    <input 
                      type="text"
                      placeholder="Enter title"
                      value={patternNames[i]}
                      onChange={(e) => updatePatternName(i, e.target.value)}
                      className="w-44 h-11 bg-white border-2 border-gray-100 rounded-xl text-center text-[14px] font-black text-blue-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm shadow-blue-900/5"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markingData.map((row, sIdx) => (
                <tr key={row.subject} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-7">
                    <span className="text-[15px] font-black text-blue-900 tracking-tight">{row.subject}</span>
                  </td>
                  {Array(patternCount).fill(0).map((_, pIdx) => (
                    <td key={pIdx} className="px-8 py-7">
                      <div className="flex items-center justify-center gap-4">
                        <div className="relative group/max">
                          <input 
                            type="text"
                            placeholder="Max"
                            value={row.patterns[pIdx].max}
                            onChange={(e) => updateMark(sIdx, pIdx, 'max', e.target.value)}
                            className="w-24 h-11 bg-emerald-50/40 border-2 border-emerald-400 rounded-xl text-center text-[13px] font-black text-emerald-800 placeholder:text-emerald-400 focus:outline-none focus:border-emerald-600 focus:bg-emerald-50 transition-all"
                          />
                        </div>
                        <div className="relative group/min">
                          <input 
                            type="text"
                            placeholder="Min"
                            value={row.patterns[pIdx].min}
                            onChange={(e) => updateMark(sIdx, pIdx, 'min', e.target.value)}
                            className="w-24 h-11 bg-amber-50/40 border-2 border-amber-400 rounded-xl text-center text-[13px] font-black text-amber-800 placeholder:text-amber-400 focus:outline-none focus:border-amber-600 focus:bg-amber-50 transition-all"
                          />
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <button className="h-12 px-16 bg-blue-600 text-white rounded-xl text-[15px] font-bold flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all">
            Save
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};
