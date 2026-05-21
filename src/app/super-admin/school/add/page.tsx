'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, School, User, Phone, Globe, ShieldCheck, Upload, Hash, Loader2, X, Mail, Trash2 } from 'lucide-react';

import { FormSelect } from '@/components/ui/form-select';
import { DateInput, formatDateDisplay } from '@/components/ui/date-input';
import { SuccessModal } from '@/components/staff';
import { PageHeader, PageWrapper, SecondaryButton, PrimaryButton, ErrorBanner } from '@/app/wireframe/ui/components/ui';
import { FormField, PocFormItem } from '@/components/forms';
import axiosClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatPhone, isValidPhone } from '@/utils/phone';
import { validateSchoolField } from '@/utils/validation';
import { MOCK_SCHOOLS } from '@/mock/school.mock';
import { INITIAL_SCHOOL_FORM, createEmptyPoc } from '@/constants/school';
import { formCls } from '@/styles/form';
import type { SchoolFormState, SchoolPOCFormData } from '@/types/school';

const isPocValid = (p: SchoolPOCFormData): boolean =>
  p.name.length > 0 && p.gender !== '' && p.designation.length > 0 && isValidPhone(p.contactNumber);

export default function CreateSchoolPage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SchoolFormState>(INITIAL_SCHOOL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pocs, setPocs] = useState<SchoolPOCFormData[]>([]);
  const [principalDob, setPrincipalDob] = useState('');
  const [directorDob, setDirectorDob] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isDev = process.env.NODE_ENV === 'development';

  const isFormReady =
    formData.schoolName.length > 0 &&
    formData.email.length > 0 &&
    formData.state.length > 0 &&
    formData.city.length > 0 &&
    formData.address.length > 0 &&
    isValidPhone(formData.phone) &&
    formData.default_admin_username.length >= 6 &&
    pocs.length > 0 &&
    pocs.every(isPocValid) &&
    Object.values(errors).every((e) => e === '');

  const setField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] !== undefined) setErrors((prev) => ({ ...prev, [name]: validateSchoolField(name, value) }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(e.target.name, e.target.value);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setErrors((prev) => ({ ...prev, [e.target.name]: validateSchoolField(e.target.name, e.target.value) }));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setField(e.target.name, formatted);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setSubmitError('Logo file size must be under 5MB'); return; }
    if (!['image/jpeg', 'image/png'].includes(file.type)) { setSubmitError('Logo must be JPEG or PNG'); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const fillMockData = (index: number) => {
    const mock = MOCK_SCHOOLS[index];
    setFormData({ ...mock.data });
    setPrincipalDob('1980-05-15');
    setDirectorDob('1975-10-20');
    setPocs(mock.pocs.map((p) => ({ ...p, id: Math.random().toString(36).substr(2, 9) })));
    setErrors({});
  };

  const updatePoc = (id: string, field: keyof SchoolPOCFormData, value: string) =>
    setPocs((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));

  const setPocError = (key: string, msg: string) => setErrors((prev) => ({ ...prev, [key]: msg }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('name', formData.schoolName);
    fd.append('email', formData.email);
    if (formData.udiseCode) fd.append('udise_code', formData.udiseCode);
    if (formData.affiliationCode) fd.append('affiliation_number', formData.affiliationCode);
    if (formData.principalName) {
      fd.append('principal_name', formData.principalName);
      fd.append('principal_gender', formData.principalGender);
    }
    if (principalDob) fd.append('principal_dob', formatDateDisplay(principalDob));
    if (formData.directorName) {
      fd.append('director_name', formData.directorName);
      fd.append('director_gender', formData.directorGender);
    }
    if (directorDob) fd.append('director_dob', formatDateDisplay(directorDob));
    fd.append('address', JSON.stringify({ street: formData.address, city: formData.city, state: formData.state }));
    if (formData.website) fd.append('website_url', formData.website);
    fd.append('contact_number', formData.phone.replace(/-/g, ''));
    if (formData.altPhone) fd.append('alternative_contact_number', formData.altPhone.replace(/-/g, ''));
    fd.append('default_admin_username', formData.default_admin_username);
    if (formData.remarks) fd.append('remarks', formData.remarks);
    fd.append('pocs', JSON.stringify(pocs.map((p) => ({
      name: p.name,
      gender: p.gender,
      dateOfBirth: p.dob ? formatDateDisplay(p.dob) : undefined,
      designation: p.designation,
      primaryContactNumber: p.contactNumber.replace(/-/g, ''),
      alternateContactNumber: p.alternateNumber ? p.alternateNumber.replace(/-/g, '') : undefined,
      remarks: p.remarks || undefined,
    }))));
    if (logoFile) fd.append('logo', logoFile);

    try {
      await axiosClient.post(API_ENDPOINTS.schools.onboard, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowSuccessModal(true);
      setTimeout(() => router.push('/super-admin/school'), 3000);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      const msg = apiErr?.response?.data?.message;
      if (apiErr?.response?.status === 409) {
        setSubmitError(msg || 'Conflict: school already exists with same code or UDISE.');
      } else {
        setSubmitError(msg || apiErr?.message || 'Failed to create school. Please try again.');
      }
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  return (
    <PageWrapper>
      <PageHeader title="Create New School" showBack />

      {isDev && (
        <div className="mt-6 mb-2 p-4 bg-amber-50 border border-amber-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <span className={cn(formCls.label, 'ml-2 text-amber-600')}>Quick Fill (Dev Only)</span>
            <div className="flex gap-2">
              {MOCK_SCHOOLS.map((m, i) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => fillMockData(i)}
                  className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-xl text-[11px] font-bold transition-all hover:bg-amber-100 active:scale-95"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pt-6 pb-32">
        <div className={cn(formCls.card, 'space-y-12')}>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FormField label="School Name" required error={errors.schoolName}>
              <div className="relative group/input">
                <School size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-blue-500" />
                <input
                  name="schoolName"
                  type="text"
                  required
                  placeholder="Enter school name"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, 'pl-10', errors.schoolName && formCls.inputError)}
                />
              </div>
            </FormField>

            <FormField label="UDISE Code" error={errors.udiseCode}>
              <div className="relative group/input">
                <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-blue-500" />
                <input
                  name="udiseCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="11 digit code"
                  value={formData.udiseCode}
                  onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 11); setField('udiseCode', val); }}
                  onBlur={handleBlur}
                  maxLength={11}
                  className={cn(formCls.input, 'pl-10', errors.udiseCode && formCls.inputError)}
                />
              </div>
            </FormField>

            <FormField label="Affiliation Number">
              <div className="relative group/input">
                <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-blue-500" />
                <input
                  name="affiliationCode"
                  type="text"
                  placeholder="Affiliation number"
                  value={formData.affiliationCode}
                  onChange={handleInputChange}
                  className={cn(formCls.input, 'pl-10')}
                />
              </div>
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <div className="relative group/input">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-blue-500" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@school.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, 'pl-10', errors.email && formCls.inputError)}
                />
              </div>
            </FormField>
          </div>

          <div className={formCls.sectionDivider} />

          {/* Principal */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField label="Principal Name" error={errors.principalName}>
              <div className="relative group/input">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-emerald-500" />
                <input
                  name="principalName"
                  type="text"
                  placeholder="Principal name"
                  value={formData.principalName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, 'pl-10', errors.principalName && formCls.inputError)}
                />
              </div>
            </FormField>
            <FormField label="Principal Gender">
              <FormSelect
                value={formData.principalGender}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, principalGender: val }))}
                options={genderOptions}
              />
            </FormField>
            <FormField label="Principal DOB">
              <DateInput value={principalDob} onChange={setPrincipalDob} calendarDisabled={{ after: new Date() }} />
            </FormField>
          </div>

          {/* Director */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField label="Director Name" error={errors.directorName}>
              <div className="relative group/input">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within/input:text-blue-500" />
                <input
                  name="directorName"
                  type="text"
                  placeholder="Director name"
                  value={formData.directorName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, 'pl-10', errors.directorName && formCls.inputError)}
                />
              </div>
            </FormField>
            <FormField label="Director Gender">
              <FormSelect
                value={formData.directorGender}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, directorGender: val }))}
                options={genderOptions}
              />
            </FormField>
            <FormField label="Director DOB">
              <DateInput value={directorDob} onChange={setDirectorDob} calendarDisabled={{ after: new Date() }} />
            </FormField>
          </div>

          <div className={formCls.sectionDivider} />

          {/* Location & Contact */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="State" required error={errors.state}>
                <input
                  name="state"
                  type="text"
                  required
                  placeholder="e.g. Madhya Pradesh"
                  value={formData.state}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, errors.state && formCls.inputError)}
                />
              </FormField>
              <FormField label="City" required error={errors.city}>
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="e.g. Indore"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={cn(formCls.input, errors.city && formCls.inputError)}
                />
              </FormField>
            </div>

            <FormField label="Address" required error={errors.address}>
              <textarea
                name="address"
                required
                maxLength={200}
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={cn(formCls.input, 'h-20 resize-none', errors.address && formCls.inputError)}
              />
              <p className={cn(formCls.errorText, 'mt-0.5 mr-1 text-right text-gray-300')}>
                {formData.address.length}/200
              </p>
            </FormField>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField label="Website" error={errors.website}>
                <div className="relative group">
                  <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                  <input
                    name="website"
                    type="text"
                    placeholder="www.school.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(formCls.input, 'pl-10', errors.website && formCls.inputError)}
                  />
                </div>
              </FormField>
              <FormField label="Phone Number" required error={errors.phone}>
                <div className="relative group">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    placeholder="801-987-9800"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={handleBlur}
                    maxLength={12}
                    className={cn(formCls.input, 'pl-10', errors.phone && formCls.inputError)}
                  />
                </div>
              </FormField>
              <FormField label="Alternate Phone" error={errors.altPhone}>
                <div className="relative group">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                  <input
                    name="altPhone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="801-987-9800"
                    value={formData.altPhone}
                    onChange={handlePhoneChange}
                    onBlur={handleBlur}
                    maxLength={12}
                    className={cn(formCls.input, 'pl-10', errors.altPhone && formCls.inputError)}
                  />
                </div>
              </FormField>
            </div>
          </div>

          <div className={formCls.sectionDivider} />

          {/* Auth & Branding */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <FormField label="Username" required error={errors.default_admin_username}>
                <div className="relative group">
                  <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                  <input
                    name="default_admin_username"
                    type="text"
                    required
                    placeholder="Min 6 alphanumeric"
                    value={formData.default_admin_username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(formCls.input, 'pl-10', errors.default_admin_username && formCls.inputError)}
                  />
                </div>
              </FormField>
              <FormField label="Remarks">
                <textarea
                  name="remarks"
                  maxLength={300}
                  placeholder="Any additional notes..."
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className={cn(formCls.input, 'h-24 resize-none')}
                />
                <p className={cn(formCls.errorText, 'mt-0.5 mr-1 text-right text-gray-300')}>
                  {formData.remarks.length}/300
                </p>
              </FormField>
            </div>

            <div className="space-y-1">
              <label className={formCls.label}>School Logo</label>
              <div className="relative flex h-52 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30 transition-all group hover:border-blue-200">
                {logoPreview ? (
                  <div className="relative h-full w-full p-2">
                    <img src={logoPreview} alt="Logo Preview" className="h-full w-full rounded-2xl object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                        if (logoInputRef.current) logoInputRef.current.value = '';
                      }}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-xl backdrop-blur transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm transition-colors group-hover:text-blue-500">
                      <Upload size={24} />
                    </div>
                    <p className={cn(formCls.label, 'text-gray-300')}>JPEG / PNG · Max 5MB</p>
                  </>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleLogoChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          <div className={formCls.sectionDivider} />

          {/* Points of Contact */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={formCls.label}>Points of Contact</h3>
              <button
                type="button"
                onClick={() => setPocs((prev) => [...prev, createEmptyPoc()])}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
              >
                <Plus size={14} />
                Add POC
              </button>
            </div>

            <div className="space-y-6">
              {pocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-50 py-10 text-gray-300">
                  <p className={cn(formCls.label, 'text-gray-300')}>No POCs added</p>
                  <p className="text-[10px] font-bold">Click &ldquo;Add POC&rdquo; to add a point of contact</p>
                </div>
              ) : (
                pocs.map((poc, index) => (
                  <PocFormItem
                    key={poc.id}
                    poc={poc}
                    index={index}
                    errors={errors}
                    onRemove={(id) => setPocs((prev) => prev.filter((p) => p.id !== id))}
                    onUpdate={updatePoc}
                    onError={setPocError}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {submitError && <ErrorBanner message={submitError} onDismiss={() => setSubmitError(null)} />}

        <div className="sticky bottom-8 left-0 right-0 z-50 animate-in slide-in-from-bottom-8 duration-700">
          <div className="mx-auto flex max-w-fit items-center justify-center gap-4 rounded-[40px] border border-blue-100 bg-white/80 p-4 px-10 backdrop-blur-xl">
            <SecondaryButton type="button" onClick={() => router.back()} className="rounded-3xl border-0 bg-gray-50 px-10 py-4 font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 hover:border-0">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting || !isFormReady} className="justify-center rounded-3xl px-14 py-4 font-black uppercase tracking-widest">
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create School'}
            </PrimaryButton>
          </div>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          title="School Created"
          message="The school has been successfully onboarded."
          variant="success"
          onClose={() => { setShowSuccessModal(false); router.push('/super-admin/school'); }}
        />
      )}
    </PageWrapper>
  );
}
