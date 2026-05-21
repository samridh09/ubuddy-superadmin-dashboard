'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { EditableFieldProps } from "@/types/components/EditableField";

const INPUT_STYLES = 'w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-black text-[#0F172A] focus:outline-none focus:border-[#0F172A] focus:ring-4 focus:ring-[#0F172A]/5 transition-all placeholder-gray-300';
const VIEW_STYLES = 'w-full bg-transparent border-none px-0 py-3 text-[14px] font-black text-[#0F172A] focus:outline-none transition-all cursor-default truncate';

export function EditableField({ 
  label, 
  value: initialValue,
  onSave,
  rows,
  format
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');
  const [tempValue, setTempValue] = useState(initialValue || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue || '');
    setTempValue(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(tempValue);
    setIsEditing(false);
    if (onSave) onSave(tempValue);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="group/field relative pb-1 border-b border-gray-50 hover:border-gray-200 transition-colors">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          {rows ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={isEditing ? tempValue : (format ? format(value) : (value || 'Not provided'))}
              onChange={(e) => setTempValue(e.target.value)}
              rows={rows}
              disabled={!isEditing}
              className={`${isEditing ? INPUT_STYLES : VIEW_STYLES} ${!value && !isEditing ? 'text-gray-300 font-medium italic' : ''}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={isEditing ? tempValue : (format ? format(value) : (value || 'Not provided'))}
              onChange={(e) => setTempValue(e.target.value)}
              disabled={!isEditing}
              className={`${isEditing ? INPUT_STYLES : VIEW_STYLES} ${!value && !isEditing ? 'text-gray-300 font-medium italic' : ''}`}
            />
          )}
        </div>
        
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="opacity-0 group-hover/field:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-xl shrink-0"
          >
            <Edit2 size={14} className="text-gray-400" />
          </button>
        )}

        {isEditing && (
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
