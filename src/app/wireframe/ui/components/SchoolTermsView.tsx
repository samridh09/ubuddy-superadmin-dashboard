'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Pencil, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PageWrapper, PageHeader, PrimaryButton, SecondaryButton
} from './ui';
import { SchoolTermsViewProps } from '@/types';

interface ClassTermData {
  id: string;
  className: string;
  terms: string[];
}

const INITIAL_DATA: ClassTermData[] = [
  { id: '1', className: '1st', terms: ['Annual Exam'] },
  { id: '2', className: '2nd', terms: ['Annual Exam'] },
  { id: '3', className: '3rd', terms: ['Annual Exam'] },
  { id: '4', className: '4th', terms: ['Annual Exam'] },
  { id: '5', className: '5th', terms: ['Annual Exam'] },
];

const ALL_TERMS: string[] = [
  'Monthly Test', 'Unit Test 1', 'Unit Test 2', 'Unit Test 3', 'Unit Test 4', 'Periodic Test 1', 'Periodic Test 2', 'Quarterly Exam',
  'Term 1 Exam', 'Pre-Mid Term Exam', 'Mid Term Exam', 'Term 2 Exam', 'Pre-Half Yearly Exam', 'Half Yearly Exam', 'Post-Half Yearly Exam', 'Pre-Annual Exam',
  'Annual Exam', 'Term 3 Exam', 'Pre-Board Exam', 'Board Exam', 'Mock Test', 'Practice Test', 'Class Test', 'Open Book Test',
  'Objective Test', 'Subjective Test', 'Descriptive Test', 'Formative Assessment 1', 'Formative Assessment 2', 'Summative Assessment 1', 'Summative Assessment 2', 'Internal Assessment',
  'Practical Exam', 'Viva Voce', 'Assignment Submission', 'Project Work', 'Lab Work', 'Field Work', 'Online Test', 'Oral Test',
  'Weekly Test', 'Slip Test', 'Re-Test', 'Supplementary Exam', 'Final Exam', 'Annual School Exam', 'Sessional Exam', 'Entrance Practice Test'
];

export const SchoolTermsView: React.FC<SchoolTermsViewProps> = ({
  schoolName,
  sessionYear,
  schoolId,
  sessionId,
}) => {
  const router = useRouter();
  const base = useBasePath();

  const [data, setData] = useState<ClassTermData[]>(INITIAL_DATA);
  const [tempData, setTempData] = useState<ClassTermData[]>([]);
  const [expandedClassIds, setExpandedClassIds] = useState<string[]>([INITIAL_DATA[0]?.id || '']);
  const [isEditing, setIsEditing] = useState(false);

  // Enter edit mode
  const handleStartEdit = () => {
    const clone = JSON.parse(JSON.stringify(data));
    setTempData(clone);
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempData([]);
  };

  // Save changes
  const handleSaveEdit = () => {
    setData(JSON.parse(JSON.stringify(tempData)));
    setIsEditing(false);
    setTempData([]);
  };

  const toggleClassExpand = (classId: string) => {
    setExpandedClassIds(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleToggleTerm = (classId: string, termName: string) => {
    setTempData(prev =>
      prev.map(c => {
        if (c.id === classId) {
          const exists = c.terms.includes(termName);
          const newTerms = exists
            ? c.terms.filter(t => t !== termName)
            : [...c.terms, termName];
          return { ...c, terms: newTerms };
        }
        return c;
      })
    );
  };

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Assign Terms to Classes"
        subtitle={`${schoolName} | ${sessionYear}`}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${sessionId}`)}
        actions={
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-none flex items-center justify-center h-10 tracking-tight">
              Total Classes : {data.length}
            </span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            {/* Table Toolbar in Edit Mode */}
            <div className="p-6 border border-gray-100 flex items-center justify-between bg-white rounded-3xl animate-slideUp fill-mode-both" style={{ animationDelay: '50ms' }}>
              <div>
                <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">
                  Term Configurations
                </h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  Select or deselect terms enabled for each class
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SecondaryButton onClick={handleCancelEdit} className="h-10 px-4 text-[13px]">
                  <X size={15} />
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleSaveEdit}
                  className="h-10 px-5 text-[13px] bg-blue-600 hover:bg-blue-700"
                >
                  <Save size={15} />
                  Save
                </PrimaryButton>
              </div>
            </div>

            {/* Accordion Cards for each class in Edit Mode */}
            <div className="space-y-4">
              {tempData.map((classItem, classIdx) => {
                const isExpanded = expandedClassIds.includes(classItem.id);
                const selectedCount = classItem.terms.length;
                return (
                  <div
                    key={classItem.id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-none overflow-hidden animate-slideUp fill-mode-both"
                    style={{ animationDelay: `${100 + classIdx * 20}ms` }}
                  >
                    {/* Card Header */}
                    <button
                      type="button"
                      onClick={() => toggleClassExpand(classItem.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
                    >
                      <div>
                        <h4 className="text-[15px] font-bold text-black leading-tight">
                          {classItem.className}
                        </h4>
                        <p className="text-[11px] text-black font-bold uppercase tracking-widest mt-0.5">
                          {selectedCount}/{ALL_TERMS.length} terms selected
                        </p>
                      </div>
                      <div className="text-black p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 pt-2">
                          {ALL_TERMS.map((termName) => {
                            const isChecked = classItem.terms.includes(termName);
                            return (
                              <button
                                key={termName}
                                type="button"
                                onClick={() => handleToggleTerm(classItem.id, termName)}
                                className={`flex items-center gap-2 px-2 py-3 rounded-xl border text-[12px] font-bold transition-all duration-200 active:scale-95 group text-left ${
                                  isChecked
                                    ? 'bg-neutral-50 border-black'
                                    : 'bg-white border-gray-200 hover:bg-gray-50/50 hover:border-gray-300'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                                  isChecked
                                    ? 'bg-black border-black text-white'
                                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                                }`}>
                                  {isChecked && (
                                    <svg className="w-2.5 h-2.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-black leading-tight break-words">{termName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Table Toolbar in Read-only Mode */}
            <div className="p-6 border border-gray-100 flex items-center justify-between bg-white rounded-3xl animate-slideUp fill-mode-both" style={{ animationDelay: '50ms' }}>
              <div>
                <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">
                  Term Configurations
                </h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  View configured classes and assigned terms
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PrimaryButton onClick={handleStartEdit} className="h-10 px-5 text-[13px] bg-blue-600 hover:bg-blue-700">
                  <Pencil size={15} />
                  Edit
                </PrimaryButton>
              </div>
            </div>

            {/* Accordion Cards for each class (Read-only View) */}
            <div className="space-y-4">
              {data.map((classItem, classIdx) => {
                const isExpanded = expandedClassIds.includes(classItem.id);
                const selectedCount = classItem.terms.length;
                return (
                  <div
                    key={classItem.id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-none overflow-hidden animate-slideUp fill-mode-both"
                    style={{ animationDelay: `${100 + classIdx * 20}ms` }}
                  >
                    {/* Card Header */}
                    <button
                      type="button"
                      onClick={() => toggleClassExpand(classItem.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
                    >
                      <div>
                        <h4 className="text-[15px] font-bold text-black leading-tight">
                          {classItem.className}
                        </h4>
                        <p className="text-[11px] text-black font-bold uppercase tracking-widest mt-0.5">
                          {selectedCount}/{ALL_TERMS.length} terms selected
                        </p>
                      </div>
                      <div className="text-black p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 pt-2">
                          {ALL_TERMS.map((termName) => {
                            const isChecked = classItem.terms.includes(termName);
                            return (
                              <div
                                key={termName}
                                className={`flex items-center gap-2 px-2 py-3 rounded-xl border text-[12px] font-bold text-left cursor-default select-none transition-all duration-200 ${
                                  isChecked
                                    ? 'bg-neutral-50 border-black'
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                                  isChecked
                                    ? 'bg-black border-black text-white'
                                    : 'border-gray-300 bg-white'
                                }`}>
                                  {isChecked && (
                                    <svg className="w-2.5 h-2.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-black leading-tight break-words">{termName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
