'use client';

import React, { useState } from 'react';
import { Pencil, ArrowLeft, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import {
  PageWrapper, FilterBox, SecondaryButton,
  DataTable, Table, THead, TBody, Th, Td, Tr, ToggleSwitch
} from './ui';
import { ModuleAssignment, SchoolAssignModuleViewProps } from '@/types';

export const SchoolAssignModuleView: React.FC<SchoolAssignModuleViewProps> = ({ schoolName, initialData, schoolId, onSave }) => {
  const router = useRouter();
  const base = useBasePath();
  const [isEditing, setIsEditing] = useState(false);

  // Mark defaults as assigned if they aren't already
  const processedData = initialData.map(m => m.isDefault ? { ...m, isAssigned: true } : m);

  const [saved, setSaved] = useState<ModuleAssignment[]>(processedData);
  const [draft, setDraft] = useState<ModuleAssignment[]>(processedData);
  const [saving, setSaving] = useState(false);

  const hasChanges = draft.some((item, i) => item.isAssigned !== saved[i].isAssigned);

  const toggleAssigned = (index: number) => {
    setDraft(prev => prev.map((item, i) => i === index ? { ...item, isAssigned: !item.isAssigned } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const assignedKeys = draft.filter(m => m.isAssigned).map(m => m.key);
      await onSave(assignedKeys);
      setSaved(draft);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(saved);
    setIsEditing(false);
  };

  const enterEdit = () => {
    setDraft(saved);
    setIsEditing(true);
  };

  return (
    <PageWrapper>
      {/* Header Section */}
      <div className="flex items-center gap-5 px-1 pt-2">
        <button
          onClick={() => isEditing ? handleCancel() : router.push(`${base}/school`)}
          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all active:scale-95 shrink-0"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h2 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          {schoolName} | {isEditing ? 'Edit Assignments' : 'Assign School Module'}
        </h2>

      </div>

      {/* Identity Banner */}
      <FilterBox>
        <div className="flex-1" />
        {!isEditing && (
          <SecondaryButton
            onClick={enterEdit}
            className="px-6 py-2.5 h-11 border-gray-100 hover:border-gray-200"
          >
            <Pencil size={14} strokeWidth={2.5} />
            Edit Assignments
          </SecondaryButton>
        )}
      </FilterBox>

      {/* Main Assignment Table */}
      <DataTable>
        <Table fixed>
          <THead>
            <Th width="w-[120px]" isFirst>S. No.</Th>
            <Th width="w-[450px]">Module Name</Th>
            <Th align="center" width="w-[180px]">Status</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            {(isEditing ? draft : saved).map((item, index) => {
              const isAssigned = item.isAssigned;
              return (
                <Tr key={item.key} index={index}>
                  <Td isFirst>
                    <span className="text-[13px] font-semibold text-gray-400">
                      {index + 1}
                    </span>
                  </Td>
                  <Td>
                    <span className={`text-[15px] font-bold tracking-tight transition-all duration-300 ${
                      isAssigned ? 'text-blue-600' : 'text-gray-300'
                    }`}>
                      {item.name}
                    </span>
                  </Td>
                  <Td align="center">
                    <div className="flex justify-center py-1">
                      {isEditing ? (
                        <ToggleSwitch
                          checked={isAssigned}
                          onChange={() => toggleAssigned(index)}
                        />
                      ) : (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-400">
                          <span className={`text-[13px] font-bold tracking-tight uppercase ${
                            isAssigned ? 'text-blue-900' : 'text-gray-300'
                          }`}>
                            {isAssigned ? 'Assigned' : 'Unassigned'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td></Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </DataTable>

      {/* Floating save/cancel — only when there are unsaved changes */}
      {isEditing && hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </PageWrapper>
  );
};
