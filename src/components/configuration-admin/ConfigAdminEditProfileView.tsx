'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Check, X, Upload, Edit2, Mail, Phone, Info } from 'lucide-react';
import { PageWrapper, PageHeader, SectionCard, SectionHeading, ErrorBanner } from '@/app/wireframe/ui/components/ui';
import { FormSelect } from '@/components/ui/form-select';
import { DateInput, formatDateDisplay } from '@/components/ui/date-input';
import { updateConfigAdmin } from '@/lib/services/config-admin-service';
import { toast } from 'react-toastify';
import { EditData } from "@/types/components/ConfigAdminEditProfileView";

const STATUS_COLORS: Record<string, string> = {
  Active:     'bg-emerald-50 text-emerald-600 border border-emerald-100',
  Inactive:   'bg-amber-50 text-amber-600 border border-amber-100',
  Terminated: 'bg-rose-50 text-rose-600 border border-rose-100',
};

const INPUT_VIEW = 'w-full bg-transparent border-none rounded-xl px-0 py-3 text-[13px] font-bold text-blue-900 focus:outline-none cursor-default';
const INPUT_EDIT = "w-full px-4 py-3 border border-gray-100 rounded-xl text-[13px] font-bold bg-gray-50/50 text-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300";
const INPUT_ERROR = "w-full px-4 py-3 border border-red-500 rounded-xl text-[13px] font-bold bg-white text-red-900 focus:ring-4 focus:ring-red-500/5 focus:border-red-600 outline-none transition-all placeholder:text-red-300";

function formatMobile(val: string): string {
  const d = val.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatDateForApi(isoDate: string): string {
  if (!isoDate) return '';
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${dd}-${mm}-${yyyy}`;
}

function EditableField({
  label, value: initialValue, displayValue, apiField, onSave, rows, readOnly,
  isEditing, onEditStart, onCancel, maxLength, type, options, onValidate, error,
  icon: Icon,
}: {
  label:         string;
  value:         string;
  displayValue?: string;
  apiField?:     string;
  onSave?:       (apiField: string, value: string) => Promise<void>;
  rows?:         number;
  readOnly?:     boolean;
  isEditing?:    boolean;
  onEditStart?:  () => void;
  onCancel?:     () => void;
  maxLength?:    number;
  type?:         'text' | 'textarea' | 'select' | 'date';
  options?:      { label: string; value: string }[];
  onValidate?:   (field: string, val: string) => string;
  error?:        string;
  icon?:         any;
}) {
  const [value, setValue]       = useState(initialValue || '');
  const [temp, setTemp]         = useState(initialValue || '');
  const [saving, setSaving]     = useState(false);
  const [fieldErr, setFieldErr] = useState('');
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { setValue(initialValue || ''); setTemp(initialValue || ''); }, [initialValue]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const displayVal = (displayValue ?? value) || 'Not provided';
  const isEmpty    = !value;
  const activeErr  = error || fieldErr;

  const handleSave = async () => {
    if (!onSave || !apiField) { setValue(temp); onCancel?.(); return; }
    setSaving(true); setFieldErr('');
    try {
      await onSave(apiField, temp);
      setValue(temp); onCancel?.();
    } catch (e: unknown) {
      setFieldErr(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const handleCancel = () => { setTemp(value); onCancel?.(); setFieldErr(''); };

  if (readOnly) {
    return (
      <div className="pb-2 border-b border-gray-50">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{label}</label>
        <p className={`text-[13px] font-bold py-2 ${isEmpty ? 'text-gray-300 italic font-medium' : 'text-blue-900'}`}>{displayVal}</p>
      </div>
    );
  }

  const fieldInputCls = isEditing ? (activeErr ? INPUT_ERROR : INPUT_EDIT) : INPUT_VIEW;

  return (
    <div className="group/field pb-2 border-b border-gray-50 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{label}</label>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="relative group/input">
            {isEditing && Icon && type !== 'date' && type !== 'select' && (
              <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
            )}
            {isEditing && Icon && rows && (
              <Icon size={14} className="absolute left-4 top-4 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
            )}

            {type === 'date' ? (
              isEditing ? (
                <DateInput
                  value={temp}
                  onChange={val => { setTemp(val); if (onValidate && apiField) setFieldErr(onValidate(apiField, val)); }}
                  calendarDisabled={{ after: new Date() }}
                  error={!!activeErr}
                />
              ) : (
                <div className={`${INPUT_VIEW} ${isEmpty ? 'text-gray-300 italic font-medium' : ''}`}>
                  {value ? formatDateDisplay(value) : 'Not provided'}
                </div>
              )
            ) : type === 'select' && isEditing ? (
              <FormSelect
                value={temp?.toUpperCase()}
                onValueChange={val => {
                  setTemp(val);
                  if (onValidate && apiField) setFieldErr(onValidate(apiField, val));
                }}
                disabled={saving}
                options={options || []}
                placeholder={`Select ${label}`}
                error={!!activeErr}
              />
            ) : type === 'select' && !isEditing ? (
              <div className={INPUT_VIEW}>
                {displayVal}
              </div>
            ) : rows ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={isEditing ? temp : displayVal}
                onChange={e => {
                  if (maxLength && e.target.value.length > maxLength) return;
                  const val = e.target.value;
                  setTemp(val);
                  if (onValidate && apiField) setFieldErr(onValidate(apiField, val));
                }}
                disabled={!isEditing || saving}
                rows={rows}
                className={`${fieldInputCls} resize-none ${!isEditing && isEmpty ? 'text-gray-300 italic font-medium' : ''} ${isEditing && Icon ? 'pl-10' : ''}`}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={isEditing ? temp : displayVal}
                onChange={e => {
                  if (maxLength && e.target.value.length > maxLength) return;
                  const val = e.target.value;
                  setTemp(val);
                  if (onValidate && apiField) setFieldErr(onValidate(apiField, val));
                }}
                disabled={!isEditing || saving}
                className={`${fieldInputCls} ${!isEditing && isEmpty ? 'text-gray-300 italic font-medium' : ''} ${isEditing && Icon ? 'pl-10' : ''}`}
              />
            )}
          </div>
          {activeErr && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{activeErr}</p>}
        </div>
        {!isEditing && (
          <button onClick={() => { setTemp(value); onEditStart?.(); }}
            className="opacity-0 group-hover/field:opacity-100 transition-opacity mt-1.5 p-1.5 hover:bg-gray-100 rounded-lg shrink-0">
            <Edit2 size={13} className="text-gray-400" />
          </button>
        )}
        {isEditing && (
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

export const ConfigAdminEditProfileView: React.FC<{ data: EditData; adminId: string }> = ({ data, adminId }) => {
  const router   = useRouter();
  const idParam  = `?adminId=${adminId}`;
  const [saveErr, setSaveErr]       = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<EditData>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.avatar || null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  // Sync draft if prop changes (initial load)
  useEffect(() => { setDraftData(data); setPreviewUrl(data.avatar || null); }, [data]);

  const validateField = (name: string, value: string) => {
    let error = '';
    const nameRegex = /^[a-zA-Z\s'\-\.]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case 'name':
        if (!value) error = 'Name is required';
        else if (value.length > 50) error = 'Maximum 50 characters allowed';
        else if (!nameRegex.test(value)) error = 'Only alphabets, apostrophe, hyphen and dot allowed';
        break;
      case 'gender':
        if (!value) error = 'Gender is required';
        break;
      case 'designation':
        if (!value) error = 'Designation is required';
        else if (value.length > 50) error = 'Maximum 50 characters allowed';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile number is required';
        else if (value.replace(/\D/g, '').length < 10) error = 'Enter a valid 10-digit number';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Enter a valid email address';
        break;
      case 'remarks':
        if (value.length > 200) error = 'Maximum 200 characters allowed';
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    
    try {
      await updateConfigAdmin(adminId, { profileImageUrl: file });
      toast.success('Profile photo updated');
    } catch (err) {
      setPreviewUrl(data.avatar || null);
      toast.error('Failed to update profile photo');
    }
  };

  const saveField = async (apiField: string, value: string) => {
    // Validate first
    const err = validateField(apiField, value);
    if (err) throw new Error(err);

    // Update draft locally
    setDraftData(prev => ({ ...prev, [apiField]: value }));
  };

  const handleGlobalSave = async () => {
    // Final validation sweep
    const eName        = validateField('name',         draftData.name);
    const eGender      = validateField('gender',       draftData.gender);
    const eDesignation = validateField('designation',  draftData.designation);
    const eMobile      = validateField('mobileNumber', draftData.mobileNumber);
    const eEmail       = validateField('email',        draftData.email);
    const eRemarks     = validateField('remarks',      draftData.remarks);

    if (eName || eGender || eDesignation || eMobile || eEmail || eRemarks) {
      setSaveErr('Please fix the errors before saving');
      return;
    }

    setIsSubmitting(true);
    setSaveErr('');
    
    try {
      const payload: any = {};
      let hasChanges = false;

      Object.entries(draftData).forEach(([key, val]) => {
        if (key === 'avatar' || key === 'status' || key === 'role' || key === 'username') return;

        const originalVal = (data as any)[key];
        let isChanged = val !== originalVal;

        // Special case: Gender might be 'Male' in original but 'MALE' in draft
        if (key === 'gender') {
          isChanged = val.toUpperCase() !== (originalVal?.toUpperCase() || '');
        }

        if (isChanged) {
          hasChanges = true;
          if (key === 'dateOfBirth' && val) {
            payload.dateOfBirth = formatDateForApi(val);
          } else {
            payload[key] = val;
          }
        }
      });

      if (!hasChanges) {
        setActiveField(null);
        setIsSubmitting(false);
        router.push(`/super-admin/configuration-admin/profile${idParam}`);
        return;
      }

      await updateConfigAdmin(adminId, payload);
      
      toast.success('Profile updated successfully');
      router.push(`/super-admin/configuration-admin/profile${idParam}`);
      router.refresh();
    } catch (err: any) {
      setSaveErr(err.message || 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = JSON.stringify(draftData) !== JSON.stringify(data);

  return (
    <PageWrapper>
      <PageHeader title="Edit Configuration Admin" subtitle={`${data.name} • ${data.designation}`} showBack />

      {saveErr && <ErrorBanner message={saveErr} onDismiss={() => setSaveErr('')} />}

      <SectionCard>
        {/* Identity strip */}
        <div className="p-10 border-b border-gray-100">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  previewUrl ? 'border-blue-200 cursor-default p-0' : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                }`}
              >
                {previewUrl
                  ? <img src={previewUrl} alt={data.name} className="w-full h-full object-cover" />
                  : <>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400"><Upload size={16} /></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</span>
                    </>}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest">
                {previewUrl ? 'Change' : 'Choose File'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-[26px] font-bold text-blue-900 tracking-tight leading-none mb-1">{data.name}</h1>
              <p className="text-[13px] font-semibold text-gray-400 mb-4 tracking-tight">{data.designation}</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[data.status] ?? STATUS_COLORS.Active}`}>
                {data.status}
              </div>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="p-10 space-y-12">
          <div>
            <SectionHeading icon={<User size={15} />} title="Profile Information" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6">
              <EditableField 
                label="Full Name" 
                value={draftData.name} 
                apiField="name" 
                onSave={saveField} 
                isEditing={activeField === 'name'}
                onEditStart={() => setActiveField('name')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                maxLength={50}
                error={errors.name}
                icon={User}
              />
              <EditableField label="Username" value={draftData.username} readOnly />
              <EditableField 
                label="Gender" 
                value={draftData.gender} 
                displayValue={draftData.gender ? (draftData.gender.charAt(0).toUpperCase() + draftData.gender.slice(1).toLowerCase()) : ''}
                apiField="gender" 
                onSave={saveField} 
                isEditing={activeField === 'gender'}
                onEditStart={() => setActiveField('gender')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                type="select"
                options={[
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                  { label: 'Other', value: 'OTHER' },
                ]}
                error={errors.gender}
              />
              <EditableField
                label="Date of Birth"
                value={draftData.dateOfBirth}
                apiField="dateOfBirth"
                type="date"
                onSave={saveField}
                isEditing={activeField === 'dateOfBirth'}
                onEditStart={() => setActiveField('dateOfBirth')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                error={errors.dateOfBirth}
              />
              <EditableField 
                label="Designation" 
                value={draftData.designation} 
                apiField="designation" 
                onSave={saveField} 
                isEditing={activeField === 'designation'}
                onEditStart={() => setActiveField('designation')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                maxLength={50}
                error={errors.designation}
                icon={Info}
              />
              <EditableField 
                label="Mobile Number" 
                value={draftData.mobileNumber} 
                displayValue={formatMobile(draftData.mobileNumber)} 
                apiField="mobileNumber" 
                onSave={saveField} 
                isEditing={activeField === 'mobileNumber'}
                onEditStart={() => setActiveField('mobileNumber')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                maxLength={10}
                error={errors.mobileNumber}
                icon={Phone}
              />
              <EditableField 
                label="Alternate Mobile" 
                value={draftData.alternateMobileNumber} 
                displayValue={formatMobile(draftData.alternateMobileNumber)} 
                apiField="alternateMobileNumber" 
                onSave={saveField} 
                isEditing={activeField === 'alternateMobileNumber'}
                onEditStart={() => setActiveField('alternateMobileNumber')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                maxLength={10}
                error={errors.alternateMobileNumber}
                icon={Phone}
              />
              <EditableField 
                label="Email Address" 
                value={draftData.email} 
                apiField="email" 
                onSave={saveField} 
                isEditing={activeField === 'email'}
                onEditStart={() => setActiveField('email')}
                onCancel={() => setActiveField(null)}
                onValidate={validateField}
                error={errors.email}
                icon={Mail}
              />
              <div className="md:col-span-4">
                <EditableField 
                  label="Remarks" 
                  value={draftData.remarks} 
                  apiField="remarks" 
                  onSave={saveField} 
                  rows={3} 
                  isEditing={activeField === 'remarks'}
                  onEditStart={() => setActiveField('remarks')}
                  onCancel={() => setActiveField(null)}
                  onValidate={validateField}
                  maxLength={200}
                  error={errors.remarks}
                  icon={Info}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-blue-600 rounded-[20px] p-1.5 flex items-center gap-1 shadow-2xl shadow-blue-900/30">
            <button
              onClick={() => {
                setDraftData(data);
                setActiveField(null);
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-white/90 hover:text-white text-[13px] font-bold uppercase tracking-widest transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
              Cancel
            </button>
            <button
              onClick={handleGlobalSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-white text-blue-600 rounded-[14px] text-[13px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <Check size={16} strokeWidth={3} />
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
