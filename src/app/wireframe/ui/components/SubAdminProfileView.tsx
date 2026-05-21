'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, History, Edit2, Upload, X, Check } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import { PageWrapper, PageHeader, SectionCard, SectionHeading } from './ui';
import { SubAdminProfileViewData } from '@/types';
import { STATUS_COLORS } from './constants';
import { PROFILE_INPUT_VIEW as INPUT_VIEW, PROFILE_INPUT_EDIT as INPUT_EDIT } from './styles';

function formatMobile(val: string): string {
  const d = val.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatDob(iso: string): string {
  if (!iso) return '';
  try {
    const d = parseISO(iso);
    return isValid(d) ? format(d, 'dd/MM/yyyy') : iso;
  } catch { return iso; }
}

function EditableField({
  label, value: initialValue, displayValue, apiField, onSave, rows, readOnly,
  isEditing, onEditStart, onCancel,
}: {
  label:           string;
  value:           string;
  displayValue?:   string;
  apiField?:       string;
  onSave?:         (apiField: string, value: string) => Promise<void>;
  rows?:           number;
  readOnly?:       boolean;
  isEditing?:      boolean;
  onEditStart?:    (field: string) => void;
  onCancel?:       () => void;
}) {
  const [value, setValue]       = useState(initialValue || '');
  const [temp, setTemp]         = useState(initialValue || '');
  const [saving, setSaving]     = useState(false);
  const [fieldErr, setFieldErr] = useState('');
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // Sync value when parent data refreshes
  useEffect(() => { setValue(initialValue || ''); setTemp(initialValue || ''); }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const activeEdit       = isEditing;
  const displayVal       = (displayValue ?? value) || 'Not provided';
  const isEmpty          = !value;

  const handleSave = async () => {
    if (!onSave || !apiField) { setValue(temp); onCancel?.(); return; }
    setSaving(true);
    setFieldErr('');
    try {
      await onSave(apiField, temp);
      setValue(temp);
      onCancel?.();
    } catch (e: unknown) {
      setFieldErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setTemp(value); onCancel?.(); setFieldErr(''); };

  if (readOnly) {
    return (
      <div className="pb-2 border-b border-gray-50">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
        <p className={`text-[13px] font-bold py-2 ${isEmpty ? 'text-gray-300 italic font-medium' : 'text-blue-900'}`}>{displayVal}</p>
      </div>
    );
  }

  return (
    <div className={`pb-2 border-b border-gray-50 transition-colors ${!activeEdit ? 'group/field hover:border-gray-200' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-0.5">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {fieldErr && <span className="text-[10px] text-red-500 italic font-normal">{fieldErr}</span>}
      </div>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {rows ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={activeEdit ? temp : displayVal}
              onChange={e => {
                setTemp(e.target.value);
              }}
              disabled={!activeEdit || saving}
              rows={rows}
              className={`${activeEdit ? INPUT_EDIT : INPUT_VIEW} resize-none ${!activeEdit && isEmpty ? 'text-gray-300 italic font-medium' : ''}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={activeEdit ? temp : displayVal}
              onChange={e => {
                setTemp(e.target.value);
              }}
              disabled={!activeEdit || saving}
              className={`${activeEdit ? INPUT_EDIT : INPUT_VIEW} ${!activeEdit && isEmpty ? 'text-gray-300 italic font-medium' : ''}`}
            />
          )}
        </div>

        {!activeEdit && (
          <button
            onClick={() => { setTemp(value); onEditStart?.(apiField || ''); }}
            className="opacity-0 group-hover/field:opacity-100 transition-opacity mt-1.5 p-1.5 hover:bg-gray-100 rounded-lg shrink-0"
          >
            <Edit2 size={13} className="text-gray-400" />
          </button>
        )}

        {activeEdit && (
          <div className="flex items-center gap-1 mt-1.5 shrink-0">
            <button onClick={handleSave} disabled={saving}
              className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-60">
              {saving ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={13} strokeWidth={3} />}
            </button>
            <button onClick={handleCancel} disabled={saving}
              className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-60">
              <X size={13} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const SubAdminProfileView: React.FC<{
  data:         SubAdminProfileViewData;
  rawData?:     any;
  adminId?:     string;
  onRefresh?:   () => void;
  historyPath?: string;
  editPath?:    string;
}> = ({ data, rawData, adminId, onRefresh, historyPath, editPath }) => {
  const router      = useRouter();
  const idParam     = adminId ? `?adminId=${adminId}` : '';
  const resolvedHistoryPath = historyPath ?? `/dashboard/schooladmin/sub-admin/profile/history`;
  const resolvedEditPath    = editPath    ?? `/dashboard/schooladmin/sub-admin/profile/edit`;
  const [previewUrl] = useState<string | null>(data.avatar || null);

  return (
    <PageWrapper>
      <PageHeader
        title="Sub-Admin Profile"
        subtitle={`${data.name} • ${data.role}`}
        showBack
      />

      <SectionCard>
        {/* Identity strip */}
        <div className="p-10 border-b border-gray-100 relative">
          <div className="absolute top-8 right-8 flex items-center gap-3">
            <button
              onClick={() => router.push(`${resolvedHistoryPath}${idParam}`)}
              className="flex items-center gap-2 px-5 py-2 h-10 text-[13px] font-bold text-blue-900 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <History size={15} />
              View Changes
            </button>
            <button
              onClick={() => router.push(`${resolvedEditPath}${idParam}`)}
              className="flex items-center gap-2 px-5 py-2 h-10 text-[13px] font-bold text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              <Edit2 size={15} />
              Edit Profile
            </button>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  previewUrl
                    ? 'border-blue-200 cursor-default p-0'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400">
                      <Upload size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Photo</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <h1 className="text-[26px] font-bold text-blue-900 tracking-tight leading-none mb-1">{data.name}</h1>
              <p className="text-[13px] font-semibold text-gray-400 mb-4 tracking-tight">{data.role}</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[data.status]}`}>
                {data.status}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <div>
            <SectionHeading icon={<User size={15} />} title="Profile Information" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6">
              <EditableField label="Full Name"        value={data.name}              readOnly />
              <EditableField label="Username"         value={data.username}          readOnly />
              <EditableField label="Gender"           value={data.gender}            readOnly />
              <EditableField label="Date of Birth"    value={formatDob(data.dateOfBirth)} readOnly />
              <EditableField label="Designation"      value={data.designation}       readOnly />
              <EditableField label="Mobile Number"    value={formatMobile(data.mobileNumber)} readOnly />
              <EditableField label="Alternate Mobile" value={formatMobile(data.alternateMobileNumber)} readOnly />
              <EditableField label="Email Address"    value={data.email}             readOnly />
              <div className="md:col-span-4">
                <EditableField label="Remarks"        value={data.remarks}           readOnly rows={3} />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </PageWrapper>
  );
};
