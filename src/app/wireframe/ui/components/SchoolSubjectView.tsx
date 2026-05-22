'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Pencil, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PageWrapper, PageHeader, PrimaryButton, SecondaryButton
} from './ui';
import { SchoolSubjectViewProps } from '@/types';

interface ClassSubjectData {
  id: string;
  className: string;
  subjects: string[];
}

interface SubjectItem {
  id: string;
  name: string;
}

interface SubjectGroup {
  id: string;
  name: string;
  subjects: SubjectItem[];
}

const INITIAL_DATA: ClassSubjectData[] = [
  { id: '1', className: 'Nursery', subjects: ['Mathematics', 'English', 'Hindi'] },
  { id: '2', className: 'VIII', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Science'] },
  { id: '3', className: 'IX', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Science'] },
  { id: '4', className: 'XI PCM', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Science'] },
  { id: '5', className: 'XI PCB', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Science'] },
];

const ALL_SUBJECTS: string[] = [
  'English', 'English Grammar', 'English Amazon',
  'Hindi', 'Kshitij', 'Kritika', 'Hindi Grammar',
  'Mathematics', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics',
  'Science', 'Physics', 'Chemistry', 'Biology',
  'Social Science', 'History', 'Geography', 'Civics', 'Economics',
  'Computer Science', 'Programming Basics', 'HTML & CSS', 'Database Basics',
  'Sanskrit', 'Urdu', 'Punjabi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Geography / History', 'Economics / Civics', 'Business Studies', 'Accountancy',
  'Environmental Studies', 'General Knowledge', 'Moral Values', 'Drawing / Art',
  'Physical Education', 'Music'
];

export const SchoolSubjectView: React.FC<SchoolSubjectViewProps> = ({
  schoolName,
  sessionYear,
  schoolId,
  sessionId,
}) => {
  const router = useRouter();
  const base = useBasePath();

  const [data, setData] = useState<ClassSubjectData[]>(INITIAL_DATA);
  const [tempData, setTempData] = useState<ClassSubjectData[]>([]);
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

  const handleToggleSubject = (classId: string, subjectName: string) => {
    setTempData(prev =>
      prev.map(c => {
        if (c.id === classId) {
          const exists = c.subjects.includes(subjectName);
          const newSubjects = exists
            ? c.subjects.filter(s => s !== subjectName)
            : [...c.subjects, subjectName];
          return { ...c, subjects: newSubjects };
        }
        return c;
      })
    );
  };

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | Configuration | Subject`}
        subtitle={sessionYear}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${sessionId}`)}
        actions={
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-none flex items-center justify-center h-10 tracking-tight">
              Total : {data.length}
            </span>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            {/* Table Toolbar in Edit Mode */}
            <div className="p-6 border border-gray-100 flex items-center justify-between bg-white rounded-3xl animate-slideUp fill-mode-both" style={{ animationDelay: '50ms' }}>
              <div>
                <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">
                  Subject Configurations
                </h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  Select or deselect subjects enabled for the session
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

            {/* Accordion Cards for each class */}
            <div className="space-y-4">
              {tempData.map((classItem, classIdx) => {
                const isExpanded = expandedClassIds.includes(classItem.id);
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
                          {classItem.subjects.length}/{ALL_SUBJECTS.length} subjects selected
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
                          {ALL_SUBJECTS.map((subjectName) => {
                            const isChecked = classItem.subjects.includes(subjectName);
                            return (
                              <button
                                key={subjectName}
                                type="button"
                                onClick={() => handleToggleSubject(classItem.id, subjectName)}
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
                                <span className="text-black leading-tight break-words">{subjectName}</span>
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
                  Subject Configurations
                </h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  View configured classes and subjects
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
                          {classItem.subjects.length}/{ALL_SUBJECTS.length} subjects selected
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
                          {ALL_SUBJECTS.map((subjectName) => {
                            const isChecked = classItem.subjects.includes(subjectName);
                            return (
                              <div
                                key={subjectName}
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
                                <span className="text-black leading-tight break-words">{subjectName}</span>
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
