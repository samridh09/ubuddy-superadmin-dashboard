'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Pencil, Save, X, Plus, Minus, Info, GripVertical } from 'lucide-react';
import {
  PageWrapper, PageHeader, DataTable, Table, THead, TBody, Th, Td, Tr, PrimaryButton, SecondaryButton
} from './ui';
import { SchoolClassSectionViewProps } from '@/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ClassSectionData {
  id: string;
  className: string;
  sections: string[];
}

const INITIAL_DATA: ClassSectionData[] = [
  { id: '1', className: 'Nursery', sections: ['A'] },
  { id: '2', className: 'LKG', sections: ['A', 'B'] },
  { id: '3', className: 'UKG', sections: ['A', 'B'] },
  { id: '4', className: 'I', sections: ['A', 'B', 'C'] },
  { id: '5', className: 'II', sections: ['A', 'B'] },
  { id: '6', className: 'III', sections: ['A'] },
  { id: '7', className: 'IX', sections: ['A', 'B', 'C'] },
  { id: '8', className: 'X', sections: ['A', 'B'] },
  { id: '9', className: 'XI Commerce', sections: ['Rose', 'Lily'] },
];

interface SortableRowItemProps {
  id: string;
  index: number;
  isEditing: boolean;
  item: ClassSectionData;
  tempDataLength: number;
  onRemoveClassRow?: (id: string) => void;
  onClassNameChange?: (id: string, value: string) => void;
  onSectionNameChange?: (id: string, idx: number, value: string) => void;
  onRemoveSectionField?: (id: string, idx: number) => void;
  onAddSectionField?: (id: string) => void;
}

const SortableRowItem = ({
  id, index, isEditing, item, tempDataLength,
  onRemoveClassRow, onClassNameChange, onSectionNameChange, onRemoveSectionField, onAddSectionField
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
          {/* Left Column: Class name input */}
          <Td className="px-6 py-4 border-r border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter Class Name"
                value={item.className}
                onChange={(e) => onClassNameChange!(item.id, e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-[13px] font-bold text-blue-900 focus:outline-none transition-all ${
                  !item.className.trim()
                    ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-900/5'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/5'
                }`}
              />
              {tempDataLength > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveClassRow!(item.id)}
                  className="w-9 h-9 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0 animate-fadeIn"
                  title="Remove Class"
                >
                  <Minus size={15} />
                </button>
              )}
            </div>
          </Td>

          {/* Right Column: Sections list in horizontal group */}
          <Td className="pl-8 py-4">
            <div className="flex flex-col gap-2 justify-center">
              <div className="flex flex-wrap items-center gap-2">
                {item.sections.map((section, sectionIdx) => {
                  const isLast = sectionIdx === item.sections.length - 1;
                  const hasMultiple = item.sections.length > 1;
                  const showMinus = hasMultiple && sectionIdx > 0;

                  return (
                    <div key={sectionIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter"
                        value={section}
                        onChange={(e) => onSectionNameChange!(item.id, sectionIdx, e.target.value)}
                        className={`w-24 bg-white border rounded-xl px-3 py-2 text-center text-[13px] font-bold text-gray-700 focus:outline-none transition-all ${
                          !section.trim()
                            ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-900/5'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/5'
                        }`}
                      />
                      {showMinus && (
                        <button
                          type="button"
                          onClick={() => onRemoveSectionField!(item.id, sectionIdx)}
                          className="w-7 h-7 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0"
                          title="Remove Section"
                        >
                          <Minus size={12} />
                        </button>
                      )}
                      {isLast && (
                        <button
                          type="button"
                          onClick={() => onAddSectionField!(item.id)}
                          className="w-7 h-7 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-200 active:scale-95 shrink-0"
                          title="Add Section"
                        >
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {item.sections.length === 0 && (
                <span className="text-[11px] text-red-500 font-bold tracking-tight animate-fadeIn">
                  At least one section is mandatory
                </span>
              )}
            </div>
          </Td>
        </>
      ) : (
        <>
          <Td className="pl-12 py-5 text-[14px] font-bold text-gray-500">
            {index + 1}
          </Td>
          <Td className="py-5 text-[15px] font-bold text-blue-900 tracking-tight">
            {item.className}
          </Td>
          <Td className="py-5">
            <span className="text-[15px] font-bold text-gray-700 tracking-tight">
              {item.sections.join(' | ')}
            </span>
          </Td>
        </>
      )}
    </Tr>
  );
};

export const SchoolClassSectionView: React.FC<SchoolClassSectionViewProps> = ({
  schoolName,
  sessionYear,
  schoolId,
  sessionId,
}) => {
  const router = useRouter();
  const base = useBasePath();

  const [data, setData] = useState<ClassSectionData[]>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<ClassSectionData[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (isEditing) {
        setTempData((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        setData((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setTempData(JSON.parse(JSON.stringify(data)));
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempData([]);
  };

  // Save changes
  const handleSaveEdit = () => {
    // Validate inputs
    const hasInvalidClass = tempData.some(item => !item.className.trim());
    const hasInvalidSection = tempData.some(item => item.sections.some(s => !s.trim()));
    const hasEmptySections = tempData.some(item => item.sections.length === 0);

    if (hasInvalidClass || hasInvalidSection || hasEmptySections) {
      return;
    }

    // Clean data before saving (trim values)
    const cleaned = tempData.map(item => ({
      ...item,
      className: item.className.trim(),
      sections: item.sections.map(s => s.trim()),
    }));

    setData(cleaned);
    setIsEditing(false);
    setTempData([]);
  };

  // Add Class row
  const handleAddClassRow = () => {
    const nextNumericId = (Math.max(...tempData.map(c => parseInt(c.id) || 0), 0) + 1).toString();
    setTempData([
      ...tempData,
      { id: nextNumericId, className: '', sections: [''] }
    ]);
  };

  // Remove Class row
  const handleRemoveClassRow = (classId: string) => {
    setTempData(tempData.filter(c => c.id !== classId));
  };

  // Update Class name
  const handleClassNameChange = (classId: string, value: string) => {
    setTempData(prev =>
      prev.map(c => (c.id === classId ? { ...c, className: value } : c))
    );
  };

  // Update specific section name
  const handleSectionNameChange = (classId: string, sectionIndex: number, value: string) => {
    setTempData(prev =>
      prev.map(c => {
        if (c.id === classId) {
          const nextSections = [...c.sections];
          nextSections[sectionIndex] = value;
          return { ...c, sections: nextSections };
        }
        return c;
      })
    );
  };

  // Append new empty section input box
  const handleAddSectionField = (classId: string) => {
    setTempData(prev =>
      prev.map(c => {
        if (c.id === classId) {
          return { ...c, sections: [...c.sections, ''] };
        }
        return c;
      })
    );
  };

  // Remove section input box
  const handleRemoveSectionField = (classId: string, sectionIndex: number) => {
    setTempData(prev =>
      prev.map(c => {
        if (c.id === classId) {
          // Keep at least one section
          if (c.sections.length <= 1) return c;
          return {
            ...c,
            sections: c.sections.filter((_, idx) => idx !== sectionIndex),
          };
        }
        return c;
      })
    );
  };

  // Validation state flags
  const isSaveDisabled = isEditing && (
    tempData.some(item => !item.className.trim() || item.sections.some(s => !s.trim()) || item.sections.length === 0)
  );

  const currentList = isEditing ? tempData : data;

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title={`${schoolName} | Configuration | Class & Section`}
        subtitle={sessionYear}
        showBack
        onBack={() => router.push(`${base}/school/manage-sessions/configure?schoolId=${schoolId}&sessionId=${sessionId}`)}
        actions={
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-none flex items-center justify-center h-10 tracking-tight">
              Total : {currentList.length}
            </span>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto">
        <DataTable>
          {/* Table Toolbar */}
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
                  <SecondaryButton onClick={handleAddClassRow} className="h-10 px-4 text-[13px] border border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Plus size={15} />
                    Add Class
                  </SecondaryButton>
                  <SecondaryButton onClick={handleCancelEdit} className="h-10 px-4 text-[13px]">
                    <X size={15} />
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSaveEdit}
                    disabled={isSaveDisabled}
                    className="h-10 px-5 text-[13px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeIn"
                  >
                    <Save size={15} />
                    Save
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

          {/* Table rendering */}
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
                <SortableContext 
                  items={currentList.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {currentList.map((item, index) => (
                    <SortableRowItem
                      key={item.id}
                      id={item.id}
                      index={index}
                      item={item}
                      isEditing={isEditing}
                      tempDataLength={tempData.length}
                      onRemoveClassRow={handleRemoveClassRow}
                      onClassNameChange={handleClassNameChange}
                      onSectionNameChange={handleSectionNameChange}
                      onAddSectionField={handleAddSectionField}
                      onRemoveSectionField={handleRemoveSectionField}
                    />
                  ))}
                </SortableContext>
              </TBody>
            </Table>
          </DndContext>
        </DataTable>
      </div>
    </PageWrapper>
  );
};
