'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Plus, Trash2, School, User, Check, X, Edit2, MapPin, ShieldCheck, FileText, Loader2,
} from 'lucide-react';
import { FormSelect } from '@/components/ui/form-select';
import { DateInput, formatDateDisplay } from '@/components/ui/date-input';
import { PageHeader, PageWrapper, SectionCard } from '@/app/wireframe/ui/components/ui';
import { getSchoolById, updateSchoolProfile } from '@/lib/services/school-service';
import type { SchoolPOCFormData as POC, SchoolDraft } from '@/types/school';
import { formCls } from '@/styles/form';
import { formatPhone } from '@/utils/phone';
import { ensureIsoDate } from '@/utils/date';

const INPUT_VIEW = formCls.inputView;
const INPUT_EDIT = formCls.inputEditMode;

// ─── EditableField ─────────────────────────────────────────────────────────────

function EditableField({
  label, value: initialValue, displayValue, fieldKey, onSave,
  rows, readOnly, isEditing, onEditStart, onCancel, maxLength,
  type = 'text', options, error, pattern, inputMode, validationMessage, formatFn,
}: {
  label: string;
  value: string;
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
  pattern?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  validationMessage?: string;
  formatFn?: (val: string) => string;
}) {
  const [temp, setTemp] = useState(initialValue || '');
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { setTemp(initialValue || ''); }, [initialValue]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const displayVal = (displayValue ?? initialValue) || 'Not provided';
  const isEmpty = !initialValue;

  const handleSave = () => {
    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }
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
                (e.target as HTMLInputElement).setCustomValidity('');
                const newVal = formatFn ? formatFn(e.target.value) : e.target.value;
                if (maxLength && newVal.length > maxLength) return;
                setTemp(newVal);
              }}
              onInvalid={validationMessage ? (e) => (e.target as HTMLInputElement).setCustomValidity(validationMessage) : undefined}
              disabled={!isEditing}
              pattern={isEditing ? pattern : undefined}
              inputMode={inputMode}
              maxLength={maxLength}
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
            <button onClick={handleSave} className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
              <Check size={13} strokeWidth={3} />
            </button>
            <button onClick={handleCancel} className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all">
              <X size={13} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── POCCard ───────────────────────────────────────────────────────────────────

function POCCard({ poc, activeField, setActiveField, onUpdate, onRemove }: {
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
        <button type="button" onClick={() => onRemove(poc.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2">
        <EditableField label="Name" value={poc.name} fieldKey={field('name')} onSave={onSave} isEditing={isEditing('name')} onEditStart={() => setActiveField(field('name'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Gender" value={poc.gender} displayValue={poc.gender ? poc.gender.charAt(0) + poc.gender.slice(1).toLowerCase() : ''} fieldKey={field('gender')} onSave={onSave} type="select" options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]} isEditing={isEditing('gender')} onEditStart={() => setActiveField(field('gender'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Date of Birth" value={poc.dob ?? ''} fieldKey={field('dob')} onSave={onSave} type="date" isEditing={isEditing('dob')} onEditStart={() => setActiveField(field('dob'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Designation" value={poc.designation} fieldKey={field('designation')} onSave={onSave} isEditing={isEditing('designation')} onEditStart={() => setActiveField(field('designation'))} onCancel={() => setActiveField(null)} />
        <EditableField label="Contact" value={poc.contactNumber} displayValue={formatPhone(poc.contactNumber)} fieldKey={field('contactNumber')} onSave={onSave} isEditing={isEditing('contactNumber')} onEditStart={() => setActiveField(field('contactNumber'))} onCancel={() => setActiveField(null)} inputMode="numeric" maxLength={12} formatFn={formatPhone} pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" validationMessage="Must be 10 digits" />
        <EditableField label="Alternate Contact" value={poc.alternateNumber} displayValue={formatPhone(poc.alternateNumber)} fieldKey={field('alternateNumber')} onSave={onSave} isEditing={isEditing('alternateNumber')} onEditStart={() => setActiveField(field('alternateNumber'))} onCancel={() => setActiveField(null)} inputMode="numeric" maxLength={12} formatFn={formatPhone} pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" validationMessage="Must be 10 digits" />
        <div className="md:col-span-2 lg:col-span-3">
          <EditableField label="Remarks" value={poc.remarks} fieldKey={field('remarks')} onSave={onSave} rows={2} isEditing={isEditing('remarks')} onEditStart={() => setActiveField(field('remarks'))} onCancel={() => setActiveField(null)} />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function EditPageSkeleton() {
  return (
    <PageWrapper>
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-72 bg-gray-100 rounded-xl" />
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 space-y-8">
          <div className="flex gap-8">
            <div className="w-32 h-32 rounded-[24px] bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-7 w-56 bg-gray-100 rounded-lg" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          </div>
          {[4, 3, 5, 2].map((cols, si) => (
            <div key={si} className="space-y-4 pt-4 border-t border-gray-50">
              <div className="h-3 w-28 bg-gray-100 rounded" />
              <div className="grid grid-cols-4 gap-8">
                {Array.from({ length: cols }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-2.5 w-16 bg-gray-100 rounded" />
                    <div className="h-5 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<SchoolDraft | null>(null);
  const [original, setOriginal] = useState<SchoolDraft | null>(null);
  const [schoolMeta, setSchoolMeta] = useState({ uCode: '', status: 'Active' as 'Active' | 'Inactive' });
  const [activeField, setActiveField] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSchoolById(schoolId)
      .then((school) => {
        const d: SchoolDraft = {
          name: school.name ?? '',
          udiseCode: school.udise_code ?? '',
          schoolCode: school.affiliation_number ?? '',
          affiliationCode: school.affiliation_number ?? '',
          principalName: school.principal_name ?? '',
          principalGender: school.principal_gender ?? '',
          principalDob: ensureIsoDate(school.principal_dob ?? ''),
          directorName: school.director_name ?? '',
          directorGender: school.director_gender ?? '',
          directorDob: ensureIsoDate(school.director_dob ?? ''),
          state: school.address?.state ?? '',
          city: school.address?.city ?? '',
          address: school.address?.street ?? '',
          email: school.email ?? '',
          website: school.website_url ?? '',
          phone: school.contact_number ?? '',
          alternatePhone: school.alternative_contact_number ?? '',
          username: school.default_admin_username ?? '',
          remarks: school.remarks ?? '',
          pocs: (school.pocs ?? []).map((p) => ({
            id: p.id,
            name: p.name,
            gender: p.gender,
            dob: ensureIsoDate(p.date_of_birth ?? ''),
            designation: p.designation,
            contactNumber: p.primary_contact_number,
            alternateNumber: p.alternate_contact_number ?? '',
            remarks: p.remarks ?? '',
          })),
        };
        setDraft(d);
        setOriginal(d);
        setSchoolMeta({ uCode: school.code, status: school.status === 'ACTIVE' ? 'Active' : 'Inactive' });
        if (school.logo_url) setLogoPreview(school.logo_url);
      })
      .catch(() => setLoadError('Failed to load school data.'));
  }, [schoolId]);

  if (loadError) return <div className="p-10 text-red-500">{loadError}</div>;
  if (!draft || !original) return <EditPageSkeleton />;

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(original);

  const isFormReady = draft &&
    draft.name.length > 0 &&
    draft.udiseCode.length === 4 &&
    draft.schoolCode.length === 4 &&
    draft.principalGender !== '' &&
    draft.principalName.length > 0 &&
    draft.phone.replace(/\D/g, '').length === 10 &&
    /^[0-9]{6,7}$/.test(draft.affiliationCode.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) &&
    Object.values(errors).every(e => e === '');

  const saveField = (key: string, val: string) => {
    setDraft((prev) => prev ? { ...prev, [key]: val } : prev);
  };

  const updatePoc = (id: string, field: keyof POC, val: string) => {
    setDraft((prev) => prev ? {
      ...prev,
      pocs: prev.pocs.map((p) => p.id === id ? { ...p, [field]: val } : p),
    } : prev);
  };

  const addPoc = () => {
    setDraft((prev) => prev ? {
      ...prev,
      pocs: [...prev.pocs, { id: Math.random().toString(36).substr(2, 9), name: '', gender: 'MALE', dob: '', designation: '', contactNumber: '', alternateNumber: '', remarks: '' }],
    } : prev);
  };

  const removePoc = (id: string) => {
    setDraft((prev) => prev ? { ...prev, pocs: prev.pocs.filter((p) => p.id !== id) } : prev);
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
    if (!draft || !original) return;
    setIsSubmitting(true);
    setSaveErr('');
    try {
      const payload: Record<string, unknown> = {};
      if (draft.name !== original.name) payload.name = draft.name;
      if (draft.udiseCode !== original.udiseCode) payload.udise_code = draft.udiseCode;
      if (draft.affiliationCode !== original.affiliationCode) payload.affiliation_number = draft.affiliationCode;
      if (draft.email !== original.email) payload.email = draft.email;
      if (draft.website !== original.website) payload.website_url = draft.website;
      if (draft.phone !== original.phone) payload.contact_number = draft.phone.replace(/-/g, '');
      if (draft.alternatePhone !== original.alternatePhone) payload.alternative_contact_number = draft.alternatePhone.replace(/-/g, '');
      if (draft.remarks !== original.remarks) payload.remarks = draft.remarks;
      if (draft.principalName !== original.principalName) payload.principal_name = draft.principalName;
      if (draft.principalGender !== original.principalGender) payload.principal_gender = draft.principalGender;
      if (draft.principalDob !== original.principalDob) payload.principal_dob = draft.principalDob;
      if (draft.directorName !== original.directorName) payload.director_name = draft.directorName;
      if (draft.directorGender !== original.directorGender) payload.director_gender = draft.directorGender;
      if (draft.directorDob !== original.directorDob) payload.director_dob = draft.directorDob;
      if (draft.address !== original.address || draft.city !== original.city || draft.state !== original.state) {
        payload.address = { street: draft.address, city: draft.city, state: draft.state, zipCode: '' };
      }
      if (JSON.stringify(draft.pocs) !== JSON.stringify(original.pocs)) {
        payload.pocs = draft.pocs.map((p) => ({
          name: p.name,
          gender: p.gender,
          dateOfBirth: p.dob ? formatDateDisplay(p.dob) : '',
          designation: p.designation,
          primaryContactNumber: p.contactNumber.replace(/-/g, ''),
          alternateContactNumber: p.alternateNumber ? p.alternateNumber.replace(/-/g, '') : undefined,
          remarks: p.remarks,
        }));
      }
      await updateSchoolProfile(schoolId, payload);
      router.push(`/super-admin/school/view/${schoolId}`);
    } catch (err: any) {
      setSaveErr(err?.response?.data?.message || 'Failed to save. Please try again.');
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

      <SectionCard>
        {/* Identity Strip */}
        <div className="p-10 border-b border-gray-100">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                onClick={() => !logoPreview && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  logoPreview ? 'border-blue-200 cursor-default p-0' : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
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
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest">
                {logoPreview ? 'Change' : 'Choose File'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleLogoChange} />
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-[26px] font-bold text-blue-900 tracking-tight leading-none mb-1">{draft.name}</h1>
              <p className="text-[13px] font-semibold text-gray-400 mb-4 tracking-tight uppercase">U-Code: {schoolMeta.uCode}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${schoolMeta.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {schoolMeta.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-12 pb-24">
          {/* School Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
            <EditableField label="School Name" {...f('name')} pattern="^[a-zA-Z0-9.\-\' ]+$" validationMessage="Only letters, numbers, spaces, dots, hyphens, and apostrophes allowed" />
            <EditableField label="UDISE Code" {...f('udiseCode')} inputMode="numeric" maxLength={4} formatFn={v => v.replace(/\D/g, '').slice(0, 4)} pattern="^[0-9]{4}$" validationMessage="Must be a 4 digit number" />
            <EditableField label="School Code" {...f('schoolCode')} inputMode="numeric" maxLength={4} formatFn={v => v.replace(/\D/g, '').slice(0, 4)} pattern="^[0-9]{4}$" validationMessage="Must be a 4 digit number" />
            <EditableField label="Affiliation Code" {...f('affiliationCode')} inputMode="numeric" maxLength={7} formatFn={v => v.replace(/\D/g, '').trim().slice(0, 7)} pattern="^[0-9]{6,7}$" validationMessage="Must be a 6 or 7 digit number" />
          </div>

          <div className="h-px bg-gray-50" />

          {/* Leadership */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2">
              <EditableField label="Principal Name" {...f('principalName')} pattern="^[a-zA-Z.\-\' ]+$" validationMessage="Only letters, spaces, dots, hyphens, and apostrophes allowed" />
              <EditableField label="Principal Gender" value={draft.principalGender} displayValue={genderDisplay(draft.principalGender)} fieldKey="principalGender" onSave={saveField} type="select" options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]} isEditing={activeField === 'principalGender'} onEditStart={() => setActiveField('principalGender')} onCancel={() => setActiveField(null)} />
              <EditableField label="Principal DOB" {...f('principalDob')} type="date" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2">
              <EditableField label="Director Name" {...f('directorName')} pattern="^[a-zA-Z.\-\' ]+$" validationMessage="Only letters, spaces, dots, hyphens, and apostrophes allowed" />
              <EditableField label="Director Gender" value={draft.directorGender} displayValue={genderDisplay(draft.directorGender)} fieldKey="directorGender" onSave={saveField} type="select" options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]} isEditing={activeField === 'directorGender'} onEditStart={() => setActiveField('directorGender')} onCancel={() => setActiveField(null)} />
              <EditableField label="Director DOB" {...f('directorDob')} type="date" />
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Contact & Location */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
            <EditableField label="State" {...f('state')} pattern="^[a-zA-Z ]+$" validationMessage="Only letters and spaces allowed" />
            <EditableField label="City" {...f('city')} pattern="^[a-zA-Z ]+$" validationMessage="Only letters and spaces allowed" />
            <EditableField label="Email" {...f('email')} type="text" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" validationMessage="Enter a valid email address" />
            <EditableField label="Website" {...f('website')} pattern="^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$" validationMessage="Enter a valid website URL" />
            <EditableField label="Phone Number" value={draft.phone} displayValue={formatPhone(draft.phone)} fieldKey="phone" onSave={saveField} isEditing={activeField === 'phone'} onEditStart={() => setActiveField('phone')} onCancel={() => setActiveField(null)} inputMode="numeric" maxLength={12} formatFn={formatPhone} pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" validationMessage="Must be 10 digits" />
            <EditableField label="Alternate Phone" value={draft.alternatePhone} displayValue={formatPhone(draft.alternatePhone)} fieldKey="alternatePhone" onSave={saveField} isEditing={activeField === 'alternatePhone'} onEditStart={() => setActiveField('alternatePhone')} onCancel={() => setActiveField(null)} inputMode="numeric" maxLength={12} formatFn={formatPhone} pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" validationMessage="Must be 10 digits" />
            <div className="md:col-span-4">
              <EditableField label="Full Address" {...f('address')} rows={2} />
            </div>
          </div>

          <div className="h-px bg-gray-50" />

          {/* Admin Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-2">
            <div className="md:col-span-4">
              <EditableField label="Remarks" {...f('remarks')} rows={3} maxLength={300} />
            </div>
          </div>

          {/* Points of Contact */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-400"><FileText size={15} /></span>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points of Contact</h3>
              </div>
              <button type="button" onClick={addPoc} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
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
                  <POCCard key={poc.id} poc={poc} activeField={activeField} setActiveField={setActiveField} onUpdate={updatePoc} onRemove={removePoc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* API Error Banner */}
      {saveErr && (
        <div className="flex items-center justify-between px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-[12px] font-bold text-red-500 uppercase tracking-wide animate-in fade-in duration-300 mt-6">
          <span>{saveErr}</span>
          <button type="button" onClick={() => setSaveErr('')} className="text-red-300 hover:text-red-500 transition-colors ml-4 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-blue-600 rounded-[20px] p-1.5 flex items-center gap-1 shadow-2xl shadow-blue-900/30">
            <button
              onClick={() => { setDraft(original); setActiveField(null); }}
              className="flex items-center gap-2 px-6 py-2.5 text-white/90 hover:text-white text-[13px] font-bold uppercase tracking-widest transition-colors"
            >
              <X size={16} strokeWidth={2.5} />
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !isFormReady}
              className="flex items-center gap-2 px-8 py-2.5 bg-white text-blue-600 rounded-[14px] text-[13px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
