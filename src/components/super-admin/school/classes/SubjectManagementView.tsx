'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  PageWrapper, PageHeader, PrimaryButton, SecondaryButton
} from '@/app/wireframe/ui/components/ui';
import { Class, getAllClasses } from '@/lib/services/class-service';
import { Subject, getClassSubjects, assignClassSubjects } from '@/lib/services/subject-service';
import { fetchGlobalSubjects } from '@/lib/services/global-subjects-service';

interface ClassWithSubjects extends Class {
  assignedSubjectIds: string[];
  initialSubjectIds: string[];
}

interface SubjectManagementViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

export const SubjectManagementView: React.FC<SubjectManagementViewProps> = ({
  schoolName,
  sessionYear,
  schoolId,
  sessionId,
}) => {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassWithSubjects[]>([]);
  const [masterSubjects, setMasterSubjects] = useState<Subject[]>([]);
  const [expandedClassIds, setExpandedClassIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesData, subjectsData] = await Promise.all([
        getAllClasses(schoolId, sessionId),
        fetchGlobalSubjects()
      ]);

      // Global subjects have different casing/types but we map them to the expected shape
      const mappedSubjects: Subject[] = subjectsData.map(gs => ({
        id: gs.id,
        school_id: schoolId,
        name: gs.name,
        code: gs.code || '',
        description: gs.description || '',
        is_active: gs.is_active,
        is_elective: false,
        created_at: gs.createdAt,
        updated_at: gs.updatedAt
      }));

      setMasterSubjects(mappedSubjects);

      const classesWithAssigned = await Promise.all(
        classesData.map(async (cls) => {
          try {
            const assigned = await getClassSubjects(cls.id, sessionId);
            const assignedIds = assigned.map(s => s.id);
            return {
              ...cls,
              assignedSubjectIds: assignedIds,
              initialSubjectIds: [...assignedIds]
            };
          } catch (err) {
            console.error(`Failed to fetch subjects for class ${cls.id}`, err);
            return {
              ...cls,
              assignedSubjectIds: [],
              initialSubjectIds: []
            };
          }
        })
      );

      setClasses(classesWithAssigned);
      if (classesWithAssigned.length > 0) {
        setExpandedClassIds([classesWithAssigned[0].id]);
      }
    } catch (err: any) {
      console.error('Failed to fetch subject configuration:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [schoolId, sessionId]);

  useEffect(() => {
    if (schoolId && sessionId) {
      fetchData();
    }
  }, [schoolId, sessionId, fetchData]);

  const toggleClassExpand = (classId: string) => {
    setExpandedClassIds(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleToggleSubject = (classId: string, subjectId: string) => {
    if (!isEditing) return;

    setClasses(prev =>
      prev.map(c => {
        if (c.id === classId) {
          const exists = c.assignedSubjectIds.includes(subjectId);
          const newIds = exists
            ? c.assignedSubjectIds.filter(id => id !== subjectId)
            : [...c.assignedSubjectIds, subjectId];
          return { ...c, assignedSubjectIds: newIds };
        }
        return c;
      })
    );
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setClasses(prev => prev.map(c => ({
      ...c,
      assignedSubjectIds: [...c.initialSubjectIds]
    })));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const changedClasses = classes.filter(c => 
        JSON.stringify(c.assignedSubjectIds.sort()) !== JSON.stringify(c.initialSubjectIds.sort())
      );

      await Promise.all(
        changedClasses.map(c => assignClassSubjects(c.id, {
          school_id: schoolId,
          session_id: sessionId,
          subject_ids: c.assignedSubjectIds
        }))
      );

      await fetchData();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save subject assignments');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title={`${schoolName} | Configuration | Subject`}
        subtitle={sessionYear}
        showBack
        onBack={() => router.push(`/super-admin/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${sessionId}`)}
        actions={
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-none flex items-center justify-center h-10 tracking-tight">
              Total : {loading ? '...' : classes.length}
            </span>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="p-6 border border-gray-100 flex items-center justify-between bg-white rounded-3xl animate-slideUp fill-mode-both" style={{ animationDelay: '50ms' }}>
            <div>
              <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">
                Subject Configurations
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {isEditing ? 'Select or deselect subjects enabled for the session' : 'View configured classes and subjects'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-xl" />
              ) : isEditing ? (
                <>
                  <SecondaryButton onClick={handleCancelEdit} className="h-10 px-4 text-[13px]">
                    <X size={15} />
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="h-10 min-w-[120px] px-5 text-[13px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeIn flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Save
                      </>
                    )}
                  </PrimaryButton>
                </>
              ) : (
                <PrimaryButton onClick={handleStartEdit} className="h-10 px-5 text-[13px] bg-blue-600 hover:bg-blue-700">
                  <Pencil size={15} />
                  Edit
                </PrimaryButton>
              )}
            </div>
          </div>

          {/* List of Classes */}
          <div className="space-y-4">
            {loading ? (
              // Skeleton Loading State
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-3">
                      <div className="h-5 w-32 bg-gray-100 animate-pulse rounded-lg" />
                      <div className="h-3 w-48 bg-gray-50 animate-pulse rounded-lg" />
                    </div>
                    <div className="h-10 w-10 bg-gray-50 animate-pulse rounded-xl" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="bg-white border border-red-100 rounded-3xl p-20 text-center">
                <p className="text-red-500 font-medium">{error}</p>
                <SecondaryButton onClick={fetchData} className="mt-4 h-10 px-6">Retry</SecondaryButton>
              </div>
            ) : (
              classes.map((classItem, classIdx) => {
                const isExpanded = expandedClassIds.includes(classItem.id);
                const selectedCount = classItem.assignedSubjectIds.length;
                
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
                          {classItem.name}
                        </h4>
                        <p className="text-[11px] text-black font-bold uppercase tracking-widest mt-0.5">
                          {selectedCount}/{masterSubjects.length} subjects selected
                        </p>
                      </div>
                      <div className="text-black p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-fadeIn">
                        <div className="flex flex-wrap gap-3 pt-2">
                          {masterSubjects.map((subject) => {
                            const isChecked = classItem.assignedSubjectIds.includes(subject.id);
                            
                            if (isEditing) {
                              return (
                                <button
                                  key={subject.id}
                                  type="button"
                                  onClick={() => handleToggleSubject(classItem.id, subject.id)}
                                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold transition-all duration-200 active:scale-95 group text-left ${
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
                                  <span className="text-black leading-tight whitespace-nowrap">{subject.name}</span>
                                </button>
                              );
                            }

                            return (
                              <div
                                key={subject.id}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold text-left cursor-default select-none transition-all duration-200 ${
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
                                <span className="text-black leading-tight whitespace-nowrap">{subject.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
