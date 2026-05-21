'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Save, 
  Trash2, 
  School, 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  FileText,
  Upload,
  UserPlus,
  Hash
} from 'lucide-react';
import { FormSelect } from '@/components/ui/form-select';
import { DateInput } from '@/components/ui/date-input';
import { SuccessModal } from '@/components/staff';
import { PageHeader, PageWrapper } from '@/app/wireframe/ui/components/ui';
import { POC } from "@/types/components/page";

const cls = "w-full px-4 py-3 border border-gray-100 rounded-xl text-[13px] font-bold bg-gray-50/50 text-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300";
const labelCls = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block";

export default function CreateSchoolPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedUCode, setAssignedUCode] = useState('');
  
  const [pocs, setPocs] = useState<POC[]>([]);
  const [principalGender, setPrincipalGender] = useState('MALE');
  const [directorGender, setDirectorGender] = useState('MALE');
  const [principalDob, setPrincipalDob] = useState('');
  const [directorDob, setDirectorDob] = useState('');
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const addPoc = () => {
    setPocs([...pocs, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: '', 
      gender: 'MALE', 
      designation: '', 
      contactNumber: '', 
      alternateNumber: '', 
      remarks: '' 
    }]);
  };

  const removePoc = (id: string) => {
    setPocs(pocs.filter(p => p.id !== id));
  };

  const updatePoc = (id: string, field: keyof POC, value: any) => {
    setPocs(pocs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and U-Code assignment
    setTimeout(() => {
      const uCode = '1210'; // Starting from 1210
      setAssignedUCode(uCode);
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push('/wireframes/ui/school');
      }, 3000);
    }, 1500);
  };

  return (
    <PageWrapper>
      <PageHeader title="Create New School" showBack />
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 pb-20 pt-6">
        
        {/* Consolidated Single Form Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-10 sm:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-500 space-y-12">
          
          {/* School Basic Details Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className={labelCls}>School Name <span className="text-red-500">*</span></label>
              <div className="relative group/input">
                <School size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
                <input 
                  name="schoolName" 
                  type="text" 
                  required 
                  placeholder="Enter school name" 
                  pattern="^[a-zA-Z0-9.\-\' ]+$"
                  className={`${cls} pl-10`} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>UDISE Code</label>
              <div className="relative group/input">
                <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
                <input 
                  name="udiseCode" 
                  type="text" 
                  placeholder="11 digit code" 
                  pattern="^\d{11}$"
                  maxLength={11}
                  className={`${cls} pl-10`} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>School Code</label>
              <div className="relative group/input">
                <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
                <input name="schoolCode" type="text" placeholder="Internal code" className={`${cls} pl-10`} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Affiliation Code</label>
              <div className="relative group/input">
                <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
                <input name="affiliationCode" type="text" placeholder="Affiliation code" className={`${cls} pl-10`} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          {/* Leadership Details Fields */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className={labelCls}>Principal Name</label>
                <div className="relative group/input">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input name="principalName" type="text" placeholder="Principal name" pattern="^[a-zA-Z.\-\' ]+$" className={`${cls} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Principal Gender</label>
                <FormSelect 
                  value={principalGender} 
                  onValueChange={setPrincipalGender} 
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' }
                  ]} 
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Principal DOB</label>
                <DateInput value={principalDob} onChange={setPrincipalDob} calendarDisabled={{ after: new Date() }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className={labelCls}>Director Name</label>
                <div className="relative group/input">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-blue-500 transition-colors" />
                  <input name="directorName" type="text" placeholder="Director name" pattern="^[a-zA-Z.\-\' ]+$" className={`${cls} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Director Gender</label>
                <FormSelect 
                  value={directorGender} 
                  onValueChange={setDirectorGender} 
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' }
                  ]} 
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Director DOB</label>
                <DateInput value={directorDob} onChange={setDirectorDob} calendarDisabled={{ after: new Date() }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          {/* Contact & Location Fields */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelCls}>State <span className="text-red-500">*</span></label>
                <input name="state" type="text" required placeholder="e.g. Madhya Pradesh" pattern="^[a-zA-Z ]+$" className={cls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>City <span className="text-red-500">*</span></label>
                <input name="city" type="text" required placeholder="e.g. Indore" pattern="^[a-zA-Z ]+$" className={cls} />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelCls}>Full Address <span className="text-red-500">*</span></label>
              <textarea 
                name="address" 
                required 
                maxLength={200} 
                placeholder="Enter complete building address" 
                className={`${cls} h-20 resize-none`} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className={labelCls}>Website</label>
                <div className="relative group">
                  <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input name="website" type="text" placeholder="www.school.com" className={`${cls} pl-10`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="phone" 
                    type="tel" 
                    required 
                    placeholder="801-987-9800" 
                    pattern="\d{3}-\d{3}-\d{4}"
                    className={`${cls} pl-10`} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Alternate Phone</label>
                <div className="relative group">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="alternatePhone" 
                    type="tel" 
                    placeholder="801-987-9800" 
                    pattern="\d{3}-\d{3}-\d{4}"
                    className={`${cls} pl-10`} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          {/* Authentication & Branding Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-1">
                <label className={labelCls}>Login Username <span className="text-red-500">*</span></label>
                <input 
                  name="username" 
                  type="text" 
                  required 
                  placeholder="Minimum 6 characters" 
                  pattern="^[a-zA-Z0-9]{6,}$"
                  className={cls} 
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Remarks</label>
                <textarea 
                  name="remarks" 
                  maxLength={300} 
                  placeholder="Any additional notes..." 
                  className={`${cls} h-24 resize-none`} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelCls}>School Logo</label>
              <div className="relative h-44 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-4 transition-all hover:border-blue-200 group">
                {logoPreview ? (
                  <div className="relative w-full h-full p-2">
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain rounded-2xl" />
                    <button 
                      type="button"
                      onClick={() => setLogoPreview(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur shadow-xl rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                    <Upload size={24} />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg,image/png"
                  onChange={handleLogoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          {/* Points of Contact (POCs) Fields */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={labelCls}>Points of Contact</h3>
              <button 
                type="button"
                onClick={addPoc}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus size={14} />
                Add POC
              </button>
            </div>

            <div className="space-y-6">
              {pocs.length === 0 ? (
                <div className="py-8 border-2 border-dashed border-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">No POCs added</p>
                </div>
              ) : (
                pocs.map((poc, idx) => (
                  <div key={poc.id} className="p-6 bg-gray-50/30 border border-gray-100 rounded-2xl relative group/poc">
                    <button 
                      type="button"
                      onClick={() => removePoc(poc.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className={labelCls}>POC Name</label>
                        <input 
                          required
                          value={poc.name} 
                          onChange={e => updatePoc(poc.id, 'name', e.target.value)}
                          placeholder="Full name" 
                          className={cls} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Gender</label>
                        <FormSelect 
                          value={poc.gender} 
                          onValueChange={val => updatePoc(poc.id, 'gender', val)}
                          options={[
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' }
                          ]} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>DOB</label>
                        <DateInput value={poc.dob || ''} onChange={val => updatePoc(poc.id, 'dob', val)} calendarDisabled={{ after: new Date() }} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Designation</label>
                        <input 
                          required
                          value={poc.designation} 
                          onChange={e => updatePoc(poc.id, 'designation', e.target.value)}
                          placeholder="e.g. Admin" 
                          className={cls} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Contact</label>
                        <input 
                          type="tel"
                          required
                          value={poc.contactNumber} 
                          onChange={e => updatePoc(poc.id, 'contactNumber', e.target.value)}
                          placeholder="Phone" 
                          className={cls} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="sticky bottom-8 left-0 right-0 z-50 animate-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-fit mx-auto bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[40px] p-4 flex items-center justify-center px-10 gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-10 py-4 bg-gray-50 text-gray-500 rounded-3xl font-black text-[13px] uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 px-14 py-4 bg-blue-600 text-white rounded-3xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create School'
              )}
            </button>
          </div>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          title="Onboarding Successful"
          message={`The school has been successfully registered. Assigned U-Code: ${assignedUCode}`}
          variant="success"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </PageWrapper>
  );
}
