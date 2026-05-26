'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, X, Plus, Minus, Info, GripVertical, Loader2 } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, PrimaryButton, SecondaryButton
} from '@/app/wireframe/ui/components/ui';
import { SkeletonTableRows } from '@/components/ui';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Class, 
  getAllClasses, 
  createClass, 
  updateClass, 
  deleteClass 
} from '@/lib/services/class-service';

interface LocalSection {
  id: string;
  name: string;
}

interface LocalClass {
  id: string;
  name: string;
  sections: LocalSection[];
  isNew?: boolean;
}

interface ClassSectionManagementViewProps {
  schoolName: string;
  sessionYear: string;
  schoolId: string;
  sessionId: string;
}

interface SortableRowItemProps {
  id: string;
  index: number;
  isEditing: boolean;
  cls: LocalClass;
  totalClassesCount: number;
  onRemoveClass: (id: string) => void;
  onClassNameChange: (id: string, value: string) => void;
  onSectionNameChange: (classId: string, sectionId: string, value: string) => void;
  onRemoveSection: (classId: string, sectionId: string) => void;
  onAddSection: (classId: string) => void;
}

const SortableRowItem = ({
  id, index, isEditing, cls, totalClassesCount,
  onRemoveClass, onClassNameChange, onSectionNameChange, onRemoveSection, onAddSection
}: SortableRowItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 50 } : {}),
  };

  return (
    <Tr
      ref={setNodeRef}
      index={index}
      style={style as React.CSSProperties}
      className={isDragging ? 'bg-blue-50/80 shadow-xl opacity-90' : 'bg-white'}
    >
      {isEditing && (
        <Td className="pl-12 py-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all inline-flex items-center justify-center shadow-sm"
          >
            <GripVertical size={16} />
          </div>
        </Td>
      )}

      {isEditing ? (
        <>
          <Td className="px-6 py-4 border-r border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter Class Name"
                value={cls.name}
                onChange={(e) => onClassNameChange(cls.id, e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-[13px] font-bold text-blue-900 focus:outline-none transition-all ${
                  !cls.name.trim()
                    ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-900/5'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/5'
                }`}
              />
              <button
                type="button"
                onClick={() => onRemoveClass(cls.id)}
                className="w-9 h-9 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0 animate-fadeIn"
                title="Remove Class"
              >
                <Minus size={15} />
              </button>
            </div>
          </Td>

          <Td className="pl-8 py-4">
            <div className="flex flex-col gap-2 justify-center">
              <div className="flex flex-wrap items-center gap-2">
                {cls.sections.map((section, sectionIdx) => {
                  const isLast = sectionIdx === cls.sections.length - 1;
                  const canRemove = cls.sections.length > 1;

                  return (
                    <div key={section.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter"
                        value={section.name}
                        onChange={(e) => onSectionNameChange(cls.id, section.id, e.target.value)}
                        className={`w-24 bg-white border rounded-xl px-3 py-2 text-center text-[13px] font-bold text-gray-700 focus:outline-none transition-all ${
                          !section.name.trim()
                            ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-900/5'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/5'
                        }`}
                      />
                      {canRemove && (
                        <button
                          type="button"
                          onClick={() => onRemoveSection(cls.id, section.id)}
                          className="w-7 h-7 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0"
                          title="Remove Section"
                        >
                          <Minus size={12} />
                        </button>
                      )}
                      {isLast && (
                        <button
                          type="button"
                          disabled={totalClassesCount >= 30}
                          onClick={() => onAddSection(cls.id)}
                          className="w-7 h-7 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Add Section"
                        >
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Td>
        </>
      ) : (
        <>
          <Td className="pl-12 py-5 text-[14px] font-bold text-gray-500">
            {index + 1}
          </Td>
          <Td className="py-5 text-[15px] font-bold text-blue-900 tracking-tight">
            {cls.name}
          </Td>
          <Td className="py-5">
            <span className="text-[15px] font-bold text-gray-700 tracking-tight">
              {cls.sections.map(s => s.name).join(' | ')}
            </span>
          </Td>
        </>
      )}
    </Tr>
  );
};

export const ClassSectionManagementView: React.FC<ClassSectionManagementViewProps> = ({
  schoolName,
  sessionYear,
  schoolId,
  sessionId,
}) => {
  const router = useRouter();

  const [classes, setClasses] = useState<LocalClass[]>([]);
  const [initialClasses, setInitialClasses] = useState<LocalClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllClasses(schoolId, sessionId);
      
      const local: LocalClass[] = data
        .sort((a, b) => a.order_index - b.order_index)
        .map(c => ({
          id: c.id,
          name: c.name,
          sections: c.sections.map(s => ({ id: s.id, name: s.name }))
        }));

      setClasses(local);
      setInitialClasses(JSON.parse(JSON.stringify(local)));
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch classes:', err);
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, [schoolId, sessionId]);

  useEffect(() => {
    if (schoolId && sessionId) {
      fetchClasses();
    }
  }, [schoolId, sessionId, fetchClasses]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setClasses((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setClasses(JSON.parse(JSON.stringify(initialClasses)));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const hasInvalidClass = classes.some(c => !c.name.trim() || c.sections.length === 0 || c.sections.some(s => !s.name.trim()));
    if (hasInvalidClass) return;

    setIsSaving(true);
    try {
      const toDelete = initialClasses.filter(ic => !classes.find(cc => cc.id === ic.id));
      await Promise.all(toDelete.map(c => deleteClass(c.id)));

      for (let i = 0; i < classes.length; i++) {
        const cc = classes[i];
        const sectionsStrings = cc.sections.map(s => s.name.trim());
        const payload = {
          name: cc.name.trim(),
          sections: sectionsStrings,
          order_index: i
        };

        if (cc.isNew) {
          await createClass({ ...payload, school_id: schoolId, session_id: sessionId });
        } else {
          const ic = initialClasses.find(init => init.id === cc.id);
          const isNameChanged = ic?.name !== cc.name;
          const areSectionsChanged = JSON.stringify(ic?.sections.map(s => s.name)) !== JSON.stringify(cc.sections.map(s => s.name));
          const isOrderChanged = initialClasses.findIndex(init => init.id === cc.id) !== i;

          if (isNameChanged || areSectionsChanged || isOrderChanged) {
            await updateClass(cc.id, payload);
          }
        }
      }

      await fetchClasses();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClass = () => {
    if (classes.length >= 30) {
      alert('Maximum of 30 classes allowed in a session');
      return;
    }
    const tempId = `temp-class-${Date.now()}`;
    setClasses([
      ...classes,
      { id: tempId, name: '', sections: [{ id: `temp-sec-${Date.now()}`, name: '' }], isNew: true }
    ]);
  };

  const handleRemoveClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleClassNameChange = (id: string, value: string) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, name: value } : c)));
  };

  const handleSectionNameChange = (classId: string, sectionId: string, value: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: c.sections.map(s => s.id === sectionId ? { ...s, name: value } : s)
        };
      }
      return c;
    }));
  };

  const handleAddSection = (classId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: [...c.sections, { id: `temp-sec-${Date.now()}`, name: '' }]
        };
      }
      return c;
    }));
  };

  const handleRemoveSection = (classId: string, sectionId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        if (c.sections.length <= 1) return c;
        return {
          ...c,
          sections: c.sections.filter(s => s.id !== sectionId),
        };
      }
      return c;
    }));
  };

  const isSaveDisabled = isSaving || classes.some(c => 
    !c.name.trim() || c.sections.length === 0 || c.sections.some(s => !s.name.trim())
  );

  return (
    <PageWrapper>
      <PageHeader
        title={`${schoolName} | Configuration | Class & Section`}
        subtitle={sessionYear}
        showBack
        onBack={() => router.push(`/super-admin/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${sessionId}`)}
        actions={
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-none flex items-center justify-center h-10 tracking-tight">
              Total Classes: {classes.length} / 30
            </span>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto">
        <DataTable>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl">
            <div>
              <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">
                Class & Section Configurations
              </h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {isEditing ? 'Configure classes and their corresponding sections' : 'View configured classes and sections'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <SecondaryButton 
                    onClick={handleAddClass} 
                    disabled={classes.length >= 30}
                    className="h-10 px-4 text-[13px] border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <Plus size={15} />
                    New Class
                  </SecondaryButton>
                  <SecondaryButton onClick={handleCancelEdit} className="h-10 px-4 text-[13px]">
                    <X size={15} />
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSaveEdit}
                    disabled={isSaveDisabled}
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

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table fixed={true}>
              {isEditing ? (
                <THead>
                  <Th className="pl-12 w-[60px]"></Th>
                  <Th className="px-6 w-[220px] border-r border-gray-100">Class</Th>
                  <Th className="pl-8 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span>Sections</span>
                      <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 normal-case pr-4">
                        <Info size={12} /> Minimum one section is mandatory
                      </span>
                    </div>
                  </Th>
                </THead>
              ) : (
                <THead>
                  <Th className="pl-12 w-[120px]">S. No.</Th>
                  <Th className="w-[220px]">Class</Th>
                  <Th className="w-full">Section</Th>
                </THead>
              )}
              
              <TBody>
                {loading ? (
                  <SkeletonTableRows rows={6} cols={[120, 220, 500]} />
                ) : classes.length > 0 ? (
                  <SortableContext 
                    items={classes.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {classes.map((cls, index) => (
                      <SortableRowItem
                        key={cls.id}
                        id={cls.id}
                        index={index}
                        cls={cls}
                        isEditing={isEditing}
                        totalClassesCount={classes.length}
                        onRemoveClass={handleRemoveClass}
                        onClassNameChange={handleClassNameChange}
                        onSectionNameChange={handleSectionNameChange}
                        onAddSection={handleAddSection}
                        onRemoveSection={handleRemoveSection}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <tr className="border-b border-gray-50/50">
                    <td colSpan={3} className="py-20 text-center">
                      <p className="text-[13px] font-medium text-gray-400 italic">{error || "No classes configured for this session."}</p>
                    </td>
                  </tr>
                )}
              </TBody>
            </Table>
          </DndContext>
        </DataTable>
      </div>
    </PageWrapper>
  );
};
