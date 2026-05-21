'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, School, User, Phone, Globe, ShieldCheck, FileText,
  Hash, Check, X, Edit2, Upload, MapPin,
} from 'lucide-react';
import { FormSelect } from '@/components/ui/form-select';
import { DateInput, formatDateDisplay } from '@/components/ui/date-input';
import { PageHeader, PageWrapper, SectionCard, SectionHeading } from '@/app/wireframe/ui/components/ui';
import { POC, SchoolDraft } from "@/types/components/page";

// ─── Types ─────────────────────────────────────────────────────────────────────
// ─── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL: SchoolDraft = {
  name: 'UBUDDY School',
  udiseCode: '23010100101',
  schoolCode: 'UB-SCH-001',
  affiliationCode: 'CBSE-987654',
  principalName: 'Dr. Anjali Sharma',
  principalGender: 'FEMALE',
  principalDob: '1982-04-12',
  directorName: 'Mr. Rajesh Kumar',
  directorGender: 'MALE',
  directorDob: '1975-08-25',
  state: 'Madhya Pradesh',
  city: 'Indore',
  address: 'Flat 402, Sunrise Apartments, Sector 15, Dwarka, New Delhi',
  website: 'www.ubuddyschool.com',
  phone: '987-654-3210',
  alternatePhone: '912-345-6789',
  username: 'ubuddy_admin_indore',
  remarks:
    'This is a premium institution registered under the UBUDDY program. All modules are currently being managed by the central admin.',
  pocs: [
    { id: 'p1', name: 'Amit Verma', gender: 'MALE', dob: '1990-05-10', designation: 'Admin', contactNumber: '9988776655', alternateNumber: '9988776644', remarks: 'Primary contact.' },
    { id: 'p2', name: 'Sneha Gupta', gender: 'FEMALE', dob: '1992-11-22', designation: 'Accounts', contactNumber: '9911223344', alternateNumber: '9911223355', remarks: '' },
  ],
};

const SCHOOL_META = { id: '1', uCode: '1210', status: 'Active' as const, logoUrl: '' };

// ─── Styles ────────────────────────────────────────────────────────────────────

const INPUT_VIEW = 'w-full bg-transparent border-none rounded-xl px-0 py-3 text-[13px] font-bold text-blue-900 focus:outline-none cursor-default';
const INPUT_EDIT = 'w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5 transition-all placeholder-gray-300';

// ─── EditableField ─────────────────────────────────────────────────────────────

function EditableField({
  label, value: initialValue, displayValue, fieldKey, onSave,
  rows, readOnly, isEditing, onEditStart, onCancel, maxLength,
  type = 'text', options, error,
}: {
  label: string;
  value?: string;
  displayValue?: string;
  fieldKey?: string;
  onSave?: (key: string, val: string) => void;
  rows?: number;
  readOnly?: boolean;
  isEditing?: boolean;
  onEditStart?: () => void;
  onCancel?: () => void;
  maxLength?: number;
  type?: 'text' | 'textarea' | 'select' | 'date';
  options?: { label: string; value: string }[];
  error?: string;
}) {
  const [temp, setTemp] = useState(initialValue || '');
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { setTemp(initialValue || ''); }, [initialValue]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const displayVal = (displayValue ?? initialValue) || 'Not provided';
  const isEmpty = !initialValue;

  const handleSave = () => {
    if (onSave && fieldKey) onSave(fieldKey, temp);
    onCancel?.();
  };

  const handleCancel = () => { setTemp(initialValue || ''); onCancel?.(); };

  if (readOnly) {
    return (
      <div className="pb-2 border-b border-gray-50">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
        <p className={`text-[13px] font-bold py-2 ${isEmpty ? 'text-gray-300 italic font-medium' : 'text-blue-900'}`}>{displayVal}</p>
      </div>
    );
  }

  return (
    <div className="group/field pb-2 border-b border-gray-50 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-0.5">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {error && <span className="text-[10px] text-red-500 italic font-normal">{error}</span>}
      </div>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {type === 'date' ? (
            isEditing ? (
              <DateInput value={temp} onChange={setTemp} calendarDisabled={{ after: new Date() }} />
            ) : (
              <div className={`${INPUT_VIEW} ${isEmpty ? 'text-gray-300 italic font-medium' : ''}`}>
                {initialValue ? formatDateDisplay(initialValue) : 'Not provided'}
              </div>
            )
          ) : type === 'select' && isEditing ? (
            <FormSelect
              value={temp?.toUpperCase()}
              onValueChange={setTemp}
              options={options || []}
              placeholder={`Select ${label}`}
            />
          ) : type === 'select' ? (
            <div className={INPUT_VIEW}>{displayVal}</div>
          ) : rows ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={isEditing ? temp : (isEmpty ? 'Not provided' : initialValue)}
              onChange={(e) => {
                if (maxLength && e.target.value.length > maxLength) return;
                setTemp(e.target.value);
              }}
              disabled={!isEditing}
              rows={rows}
              className={`${isEditing ? INPUT_EDIT : INPUT_VIEW} resize-none ${!isEditing && isEmpty ? 'text-gray-300 italic font-medium' : ''}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={isEditing ? temp : (isEmpty ? 'Not provided' : initialValue)}
              onChange={(e) => {
                if (maxLength && e.target.value.length > maxLength) return;
                setTemp(e.target.value);
              }}
              disabled={!isEditing}
              className={`${isEditing ? INPUT_EDIT : INPUT_VIEW} ${!isEditing && isEmpty ? 'text-gray-300 italic font-medium' : ''}`}
            />
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => { setTemp(initialValue || ''); onEditStart?.(); }}
            className="opacity-0 group-hover/field:opacity-100 transition-opacity mt-1.5 p-1.5 hover:bg-gray-100 rounded-lg shrink-0"
          >
            <Edit2 size={13} className="text-gray-400" />
          </button>
        )}

        {isEditing && (
          <div className="flex items-center gap-1 mt-1.5 shrink-0">
            <button
              onClick={handleSave}
              className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <Check size={13} strokeWidth={3} />
            </button>
            <button
              onClick={handleCancel}
              className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all"
            >
              <X size={13} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── POCCard ───────────────────────────────────────────────────────────────────

function POCCard({
  poc, activeField, setActiveField, onUpdate, onRemove,
}: {
  poc: POC;
  activeField: string | null;
  setActiveField: (f: string | null) => void;
  onUpdate: (id: string, field: keyof POC, val: string) => void;
  onRemove: (id: string) => void;
}) {
  const field = (f: keyof POC) => `poc.${poc.id}.${f}`;
  const isEditing = (f: keyof POC) => activeField === field(f);
  const onSave = (_key: string, val: string) => {
    const f = _key.split('.')[2] as keyof POC;
    onUpdate(poc.id, f, val);
  };

  return (
    <div className="p-6 bg-gray-50/30 border border-gray-100 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{poc.designation || 'POC'}</span>
        <button
          type="button"
          onClick={() => onRemove(poc.id)}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2">
        <EditableField label="Name" value={poc.name} fieldKey={field('name')} onSave={onSave} isEditing={isEditing('name')} onEditStart={() => setActiveField(field('name'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Gender" value={poc.gender} displayValue={poc.gender ? poc.gender.charAt(0) + poc.gender.slice(1).toLowerCase() : ''} fieldKey={field('gender')} onSave={onSave} type="select" options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]} isEditing={isEditing('gender')} onEditStart={() => setActiveField(field('gender'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Date of Birth" value={poc.dob} fieldKey={field('dob')} onSave={onSave} type="date" isEditing={isEditing('dob')} onEditStart={() => setActiveField(field('dob'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Designation" value={poc.designation} fieldKey={field('designation')} onSave={onSave} isEditing={isEditing('designation')} onEditStart={() => setActiveField(field('designation'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Contact" value={poc.contactNumber} fieldKey={field('contactNumber')} onSave={onSave} isEditing={isEditing('contactNumber')} onEditStart={() => setActiveField(field('contactNumber'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Alternate Contact" value={poc.alternateNumber} fieldKey={field('alternateNumber')} onSave={onSave} isEditing={isEditing('alternateNumber')} onEditStart={() => setActiveField(field('alternateNumber'))} onCancel={() => setActiveField(null)} />
        <div className="md:col-span-2 lg:col-span-3">
          <EditableField label="Remarks" value={poc.remarks} fieldKey={field('remarks')} onSave={onSave} rows={2} isEditing={isEditing('remarks')} onEditStart={() => setActiveField(field('remarks'))} onCancel={() => setActiveField(null)} />
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EditSchoolPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<SchoolDraft>(INITIAL);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(SCHOOL_META.logoUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(INITIAL);

  const saveField = (key: string, val: string) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const updatePoc = (id: string, field: keyof POC, val: string) => {
    setDraft((prev) => ({
      ...prev,
      pocs: prev.pocs.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
  };

  const addPoc = () => {
    setDraft((prev) => ({
      ...prev,
      pocs: [
        ...prev.pocs,
        { id: Math.random().toString(36).substr(2, 9), name: '', gender: 'MALE', dob: '', designation: '', contactNumber: '', alternateNumber: '', remarks: '' },
      ],
    }));
  };

  const removePoc = (id: string) => {
    setDraft((prev) => ({ ...prev, pocs: prev.pocs.filter((p) => p.id !== id) }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File size exceeds 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSaveErr('');
    try {
      await new Promise((r) => setTimeout(r, 1200));
      router.push(`/wireframes/ui/school/view/${SCHOOL_META.id}`);
    } catch {
      setSaveErr('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const f = (key: keyof Omit<SchoolDraft, 'pocs'>) => ({
    value: draft[key],
    fieldKey: key,
    onSave: saveField,
    isEditing: activeField === key,
    onEditStart: () => setActiveField(key),
    onCancel: () => setActiveField(null),
  });

  const genderDisplay = (val: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '';

  return (
    <PageWrapper>
      <PageHeader title="School Management | Edit Profile" showBack />

      {saveErr && (
        <div className="px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-[12px] font-bold text-red-500 flex items-center justify-between">
          <span>{saveErr}</span>
          <button onClick={() => setSaveErr('')}><X size={14} className="text-red-300 hover:text-red-500" /></button>
        </div>
      )}

      <SectionCard>
        {/* Identity Strip */}
        <div className="p-10 border-b border-gray-100">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                onClick={() => !logoPreview && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  logoPreview
                    ? 'border-blue-200 cursor-default p-0'
                    : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                }`}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt={draft.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-400">
                      <School size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Logo</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest"
              >
                {logoPreview ? 'Change' : 'Choose File'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleLogoChange} />
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-[26px] font-bold text-blue-900 tracking-tight leading-none mb-1">{draft.name}</h1>
              <p className="text-[13px] font-semibold text-gray-400 mb-4 tracking-tight uppercase">U-Code: {SCHOOL_META.uCode}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${SCHOOL_META.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {SCHOOL_META.status}
              </span>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="p-10 space-y-12">

          {/* Basic Details */}
          <div>
            <SectionHeading icon={<School size={15} />} title="School Details" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
              <EditableField label="School Name" {...f('name')} />
              <EditableField label="UDISE Code" {...f('udiseCode')} />
              <EditableField label="School Code" {...f('schoolCode')} />
              <EditableField label="Affiliation Code" {...f('affiliationCode')} />
            </div>
          </div>

          {/* Leadership */}
          <div>
            <SectionHeading icon={<User size={15} />} title="Leadership" />
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Principal</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2">
                  <EditableField label="Principal Name" {...f('principalName')} />
                  <EditableField
                    label="Gender"
                    value={draft.principalGender}
                    displayValue={genderDisplay(draft.principalGender)}
                    fieldKey="principalGender"
                    onSave={saveField}
                    type="select"
                    options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]}
                    isEditing={activeField === 'principalGender'}
                    onEditStart={() => setActiveField('principalGender')}
                    onCancel={() => setActiveField(null)}
                  />
                  <EditableField label="Date of Birth" {...f('principalDob')} type="date" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Director</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2">
                  <EditableField label="Director Name" {...f('directorName')} />
                  <EditableField
                    label="Gender"
                    value={draft.directorGender}
                    displayValue={genderDisplay(draft.directorGender)}
                    fieldKey="directorGender"
                    onSave={saveField}
                    type="select"
                    options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]}
                    isEditing={activeField === 'directorGender'}
                    onEditStart={() => setActiveField('directorGender')}
                    onCancel={() => setActiveField(null)}
                  />
                  <EditableField label="Date of Birth" {...f('directorDob')} type="date" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <SectionHeading icon={<MapPin size={15} />} title="Contact & Location" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
              <EditableField label="State" {...f('state')} />
              <EditableField label="City" {...f('city')} />
              <EditableField label="Website" {...f('website')} />
              <EditableField label="Phone Number" {...f('phone')} />
              <EditableField label="Alternate Phone" {...f('alternatePhone')} />
              <div className="md:col-span-4">
                <EditableField label="Full Address" {...f('address')} rows={2} />
              </div>
            </div>
          </div>

          {/* Admin Details */}
          <div>
            <SectionHeading icon={<ShieldCheck size={15} />} title="Admin Details" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
              <EditableField label="Login Username" value={draft.username} readOnly />
              <div className="md:col-span-4">
                <EditableField label="Remarks" {...f('remarks')} rows={3} maxLength={300} />
              </div>
            </div>
          </div>

          {/* Points of Contact */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-400"><FileText size={15} /></span>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points of Contact</h3>
              </div>
              <button
                type="button"
                onClick={addPoc}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus size={13} />
                Add POC
              </button>
            </div>

            {draft.pocs.length === 0 ? (
              <div className="py-10 border-2 border-dashed border-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No POCs added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {draft.pocs.map((poc) => (
                  <POCCard
                    key={poc.id}
                    poc={poc}
                    activeField={activeField}
                    setActiveField={setActiveField}
                    onUpdate={updatePoc}
                    onRemove={removePoc}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-blue-600 rounded-[20px] p-1.5 flex items-center gap-1 shadow-2xl shadow-blue-900/30">
            <button
              onClick={() => { setDraft(INITIAL); setActiveField(null); }}
              className="flex items-center gap-2 px-6 py-2.5 text-white/90 hover:text-white text-[13px] font-bold uppercase tracking-widest transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-white text-blue-600 rounded-[14px] text-[13px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
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
}
