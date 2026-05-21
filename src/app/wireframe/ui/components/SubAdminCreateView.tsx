'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';
import { FormSelect } from '@/components/ui/form-select';
import { PageWrapper, PageHeader, SecondaryButton, PrimaryButton, ErrorBanner } from './ui';
import { API_ENDPOINTS } from '@/lib/api';
import apiClient from '@/lib/axios';
import { FORM_INPUT as INPUT, FORM_INPUT_ERROR as INPUT_ERROR } from './styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateForApi(isoDate: string): string {
  if (!isoDate) return '';
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${dd}-${mm}-${yyyy}`;
}

function formatMobile(val: string): string {
  const d = val.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">{msg}</p> : null;

// ─── Main component ───────────────────────────────────────────────────────────
export const SubAdminCreateView = () => {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name:                  '',
    username:              '',
    gender:                '',
    dateOfBirth:           '',
    designation:           '',
    mobileNumber:          '',
    alternateMobileNumber: '',
    email:                 '',
    remarks:               '',
  });

  const [profilePicture, setProfilePicture]   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]           = useState<string | null>(null);
  const fileInputRef                          = useRef<HTMLInputElement>(null);

  // ─── File handling ──────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateField = (name: string, value: string): boolean => {
    const nameRegex  = /^[a-zA-Z\s'\-.]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = '';

    switch (name) {
      case 'name':
        if (!value)              error = 'Name is required';
        else if (value.length > 50) error = 'Max 50 characters';
        else if (!nameRegex.test(value)) error = 'Only letters, apostrophe, hyphen, dot';
        break;
      case 'username':
        if (!value)                  error = 'Username is required';
        else if (value.length < 6)   error = 'Min 6 characters';
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Letters, numbers, underscore only';
        break;
      case 'gender':
        if (!value) error = 'Gender is required';
        break;
      case 'designation':
        if (!value) error = 'Designation is required';
        else if (value.length > 50) error = 'Max 50 characters';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Enter valid 10-digit number';
        break;
      case 'alternateMobileNumber':
        if (value && !/^\d{10}$/.test(value)) error = 'Enter valid 10-digit number';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Enter valid email';
        break;
      case 'dateOfBirth':
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (dob >= today) {
            error = 'Date of birth cannot be a future date';
          }
        }
        break;
      case 'remarks':
        if (value.length > 200) error = 'Max 200 characters';
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let filtered = value;

    if (name === 'dateOfBirth') {
      setFormData(prev => ({ ...prev, dateOfBirth: value }));
      return;
    } else if (name === 'name') {
      filtered = value.replace(/[^a-zA-Z\s'\-.]/g, '').slice(0, 50);
    } else if (name === 'username') {
      filtered = value.replace(/[^a-zA-Z0-9_]/g, '');
    } else if (name === 'designation') {
      filtered = value.slice(0, 50);
    } else if (name === 'mobileNumber' || name === 'alternateMobileNumber') {
      filtered = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'remarks') {
      filtered = value.slice(0, 200);
    }

    setFormData(prev => ({ ...prev, [name]: filtered }));
    validateField(name, filtered);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof typeof formData;
    validateField(name, formData[name]);
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const fields: (keyof typeof formData)[] = [
      'name', 'username', 'gender', 'designation', 'mobileNumber', 'email', 'remarks',
    ];
    if (formData.alternateMobileNumber) fields.push('alternateMobileNumber');
    if (formData.dateOfBirth) fields.push('dateOfBirth');

    const valid = fields.map(f => validateField(f, formData[f])).every(Boolean);
    if (!valid) return;

    const schoolId = typeof window !== 'undefined' ? localStorage.getItem('schoolId') : null;
    if (!schoolId) { setApiError('School ID not found. Please log in again.'); return; }

    setLoading(true);
    setApiError('');

    try {
      const fd = new FormData();
      fd.append('name',                  formData.name);
      fd.append('username',              formData.username);
      fd.append('gender',                formData.gender);
      fd.append('designation',           formData.designation);
      fd.append('mobileNumber',          formData.mobileNumber);
      fd.append('email',                 formData.email);
      if (formData.alternateMobileNumber) fd.append('alternateMobileNumber', formData.alternateMobileNumber);
      fd.append('dateOfBirth', formatDateForApi(formData.dateOfBirth));
      if (formData.remarks)               fd.append('remarks', formData.remarks);
      if (profilePicture)                 fd.append('profilePicture', profilePicture);

      const { data: json } = await apiClient.post(API_ENDPOINTS.schoolAdmins.base(schoolId), fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!json.success) {
        throw new Error(json.message || 'Failed to create sub-admin');
      }

      router.push('/dashboard/schooladmin/sub-admin');

    } catch (err: unknown) {
      const axiosMsg = (err as any)?.response?.data?.message;
      setApiError(axiosMsg || (err instanceof Error ? err.message : 'Failed to create sub-admin.'));
    } finally {
      setLoading(false);
    }
  };

  const isFormReady =
    formData.name.length > 0 &&
    formData.username.length >= 6 &&
    formData.gender !== '' &&
    formData.designation.length > 0 &&
    formData.mobileNumber.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    Object.values(errors).every(e => e === '');

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <PageHeader title="Create Sub-Admin" showBack />

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Profile & Basic Info ─────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Profile Information</p>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <FieldLabel label="Profile Photo" />
              <div
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
                  previewUrl
                    ? 'border-blue-200 cursor-default p-0'
                    : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                }`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-all">
                      <Upload size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</span>
                  </>
                )}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                >
                  <X size={10} />
                  Remove
                </button>
              )}
              {!previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest"
                >
                  Choose File
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <FieldLabel label="Full Name" required />
                <input name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                  placeholder="e.g. Vikram Aditya"
                  className={errors.name ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.name} />
              </div>

              <div>
                <FieldLabel label="Username" required />
                <input name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur}
                  placeholder="e.g. vikram_admin"
                  className={errors.username ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.username} />
              </div>

              <div>
                <FieldLabel label="Designation" required />
                <input name="designation" value={formData.designation} onChange={handleChange} onBlur={handleBlur}
                  placeholder="e.g. Manager"
                  className={errors.designation ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.designation} />
              </div>

              <div>
                <FieldLabel label="Gender" required />
                <FormSelect
                  value={formData.gender}
                  onValueChange={(val) => {
                    setFormData(prev => ({ ...prev, gender: val }));
                    validateField('gender', val);
                  }}
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                  ]}
                  placeholder="Select gender"
                  error={!!errors.gender}
                />
                <ErrorMsg msg={errors.gender} />
              </div>

              <div>
                <FieldLabel label="Date of Birth" />
                <DateInput
                  value={formData.dateOfBirth}
                  onChange={(iso) => {
                    setFormData(prev => ({ ...prev, dateOfBirth: iso }));
                  }}
                  onBlur={() => validateField('dateOfBirth', formData.dateOfBirth)}
                  error={!!errors.dateOfBirth}
                  calendarDisabled={{ after: new Date() }}
                />
                <ErrorMsg msg={errors.dateOfBirth} />
              </div>

              <div>
                <FieldLabel label="Mobile Number" required />
                <input name="mobileNumber" value={formatMobile(formData.mobileNumber)} onChange={handleChange} onBlur={handleBlur}
                  placeholder="XXXX-XXX-XXX"
                  className={errors.mobileNumber ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.mobileNumber} />
              </div>

              <div>
                <FieldLabel label="Alternate Mobile" />
                <input name="alternateMobileNumber" value={formatMobile(formData.alternateMobileNumber)}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Optional"
                  className={errors.alternateMobileNumber ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.alternateMobileNumber} />
              </div>

              <div>
                <FieldLabel label="Email Address" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  placeholder="email@example.com"
                  className={errors.email ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.email} />
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-end mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">Remarks</label>
                  <span className={`text-[10px] font-bold ${formData.remarks.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.remarks.length} / 200
                  </span>
                </div>
                <textarea name="remarks" value={formData.remarks} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Any additional notes..."
                  rows={3}
                  className={errors.remarks ? INPUT_ERROR : INPUT} />
                <ErrorMsg msg={errors.remarks} />
              </div>
            </div>
          </div>
        </div>

        {apiError && <ErrorBanner message={apiError} onDismiss={() => setApiError('')} />}

        {/* ── Actions ───────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-4 pt-4 pb-12 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <SecondaryButton type="button" onClick={() => router.back()} disabled={loading} className="px-8 py-3.5 rounded-2xl">
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleSubmit} disabled={loading || !isFormReady} className="px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Creating...' : 'Create Sub-Admin'}
          </PrimaryButton>
        </div>
      </div>

    </PageWrapper>
  );
};
