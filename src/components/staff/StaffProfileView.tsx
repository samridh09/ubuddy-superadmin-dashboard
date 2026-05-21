'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Circle,
  Settings,
  Edit2
} from 'lucide-react';
import type { Staff } from '@/types/staff';
import { formatDateDisplay, formatMobileNumber } from '@/lib/utils/staff-formatting';
import { EditableField } from './EditableField';
import { StaffProfileViewProps } from "@/types/components/StaffProfileView";

function ProfileAvatar({ name, imageUrl }: { name?: string; imageUrl?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NA';

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt="profile"
        className="w-full h-full object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-500 font-bold">{initials}</div>;
}

export function StaffProfileView({
  staff: initialStaff,
  selectedFields,
  onBack,
  onEdit,
  onLastUpdate,
}: StaffProfileViewProps) {
  const [staff, setStaff] = useState(initialStaff);
  const isTerminated = staff.status === 'TERMINATED';

  const updateStaff = (key: keyof Staff, value: string) => {
    setStaff(prev => ({ ...prev, [key]: value }));
    // In a real app, we would call an API here
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ─── Profile Header Card ─── */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 rounded-[40px] border-4 border-gray-50 overflow-hidden shrink-0 bg-gray-100 relative">
          <ProfileAvatar name={staff.name} imageUrl={staff.profileImageUrl} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <h1 className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none">{staff.name}</h1>
            <div className="flex justify-center md:justify-start">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${
                isTerminated 
                  ? 'bg-rose-50 text-rose-600 border-rose-100' 
                  : staff.status === 'INACTIVE'
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {staff.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Employee ID:</span>
              <span className="text-[14px] font-black text-gray-600">{staff.employeeId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Category:</span>
              <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">{staff.staffType}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {onLastUpdate && (
            <button 
              onClick={onLastUpdate}
              className="px-6 py-2.5 bg-white border border-gray-200 text-[#0F172A] rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <Clock size={14} />
              Last Updated
            </button>
          )}
          {onEdit && (
            <button 
              onClick={onEdit}
              className="px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#1e293b] transition-all active:scale-95 flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Identity & Personal (AUTO) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <User size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">Identity & Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <EditableField label="Full Name" value={staff.name} onSave={(v) => updateStaff('name', v)} />
              <EditableField label="Gender" value={staff.gender} onSave={(v) => updateStaff('gender', v as any)} />
              <EditableField label="Email Address" value={staff.email} onSave={(v) => updateStaff('email', v)} />
              <EditableField label="D.O.B." value={staff.dob || ''} format={formatDateDisplay} onSave={(v) => updateStaff('dob', v)} />
              <EditableField label="Primary Mobile" value={staff.mobileNumber} format={formatMobileNumber} onSave={(v) => updateStaff('mobileNumber', v)} />
              <EditableField label="Marital Status" value={staff.maritalStatus || ''} onSave={(v) => updateStaff('maritalStatus', v as any)} />
              <EditableField label="Alternate Mobile" value={staff.alternateMobileNumber || ''} format={formatMobileNumber} onSave={(v) => updateStaff('alternateMobileNumber', v)} />
              <div className="md:col-span-2">
                <EditableField label="Permanent Address" value={staff.address || ''} rows={2} onSave={(v) => updateStaff('address', v)} />
              </div>
              <div className="md:col-span-2">
                <EditableField label="Remarks / Notes" value={staff.remarks || ''} rows={2} onSave={(v) => updateStaff('remarks', v)} />
              </div>
            </div>
          </section>

          {/* Section 2: Professional Details (AUTO + CUSTOM) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500 delay-75">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">Professional Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Employee ID (System)</p>
                <p className="text-[14px] font-black text-[#0F172A]">{staff.employeeId}</p>
                <p className="text-[10px] text-gray-400">Non-editable system sequence</p>
              </div>
              <EditableField label="Joining Date" value={staff.dateOfJoining || ''} format={formatDateDisplay} onSave={(v) => updateStaff('dateOfJoining', v)} />
              <EditableField label="Staff Type" value={staff.staffType} onSave={(v) => updateStaff('staffType', v as any)} />
              <EditableField label="Designation" value={staff.designation || 'N/A'} onSave={(v) => updateStaff('designation', v)} />
              <EditableField label="Experience" value={staff.experience || 'N/A'} onSave={(v) => updateStaff('experience', v)} />
              <EditableField label="Qualification" value={staff.qualification || 'N/A'} onSave={(v) => updateStaff('qualification', v)} />
            </div>
          </section>

          {/* Section 3: Family & Emergency (CUSTOM) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">Family & Emergency</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest">Parents Info</h4>
                <EditableField label="Father Name" value={staff.fatherName || 'N/A'} onSave={(v) => updateStaff('fatherName', v)} />
                <EditableField label="Mother Name" value={staff.motherName || 'N/A'} onSave={(v) => updateStaff('motherName', v)} />
              </div>
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Emergency Contact</h4>
                <EditableField label="Contact Name" value={staff.emergencyContact?.name || 'N/A'} onSave={(v) => setStaff(s => ({...s, emergencyContact: {...(s.emergencyContact || {number: '', relation: '', name: ''}), name: v}}))} />
                <EditableField label="Contact Number" value={staff.emergencyContact?.number || 'N/A'} format={formatMobileNumber} onSave={(v) => setStaff(s => ({...s, emergencyContact: {...(s.emergencyContact || {number: '', relation: '', name: ''}), number: v}}))} />
                <EditableField label="Relation" value={staff.emergencyContact?.relation || 'N/A'} onSave={(v) => setStaff(s => ({...s, emergencyContact: {...(s.emergencyContact || {number: '', relation: '', name: ''}), relation: v}}))} />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          {/* Bank Details (CUSTOM) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">Bank Details</h3>
            </div>

            <div className="space-y-8">
              <EditableField label="Bank Name" value={staff.bankDetails?.bankName || 'N/A'} onSave={(v) => setStaff(s => ({...s, bankDetails: {...(s.bankDetails || {ifsc: '', accountNumber: '', accountHolderName: '', bankName: ''}), bankName: v}}))} />
              <EditableField label="IFSC Code" value={staff.bankDetails?.ifsc || 'N/A'} onSave={(v) => setStaff(s => ({...s, bankDetails: {...(s.bankDetails || {ifsc: '', accountNumber: '', accountHolderName: '', bankName: ''}), ifsc: v}}))} />
              <EditableField label="Account Holder" value={staff.bankDetails?.accountHolderName || 'N/A'} onSave={(v) => setStaff(s => ({...s, bankDetails: {...(s.bankDetails || {ifsc: '', accountNumber: '', accountHolderName: '', bankName: ''}), accountHolderName: v}}))} />
              <EditableField label="Account Number" value={staff.bankDetails?.accountNumber || 'N/A'} onSave={(v) => setStaff(s => ({...s, bankDetails: {...(s.bankDetails || {ifsc: '', accountNumber: '', accountHolderName: '', bankName: ''}), accountNumber: v}}))} />
            </div>
          </section>

          {/* Legal Identification (CUSTOM) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">ID Verification</h3>
            </div>

            <div className="space-y-8">
              <EditableField label="Aadhaar Number" value={staff.aadhaarNumber || ''} onSave={(v) => updateStaff('aadhaarNumber', v)} />
              <EditableField label="PAN Number" value={staff.panNumber || ''} onSave={(v) => updateStaff('panNumber', v)} />
            </div>
          </section>

          {/* Documentary Vault (AUTO + CUSTOM) */}
          <section className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 animate-in slide-in-from-bottom-4 duration-500 delay-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest">Vault</h3>
            </div>

            <div className="space-y-3">
              <DocumentRow label="Aadhaar Card" isUploaded={!!staff.aadhaarUrl} />
              <DocumentRow label="PAN Card" isUploaded={!!staff.panUrl} />
              <DocumentRow label="Bank Passbook" isUploaded={!!staff.bankPassbookUrl} />
              <DocumentRow label="Bank Cheque" isUploaded={!!staff.bankChequeUrl} />
              <DocumentRow label="10th Marksheet" isUploaded={!!staff.x_marksheetUrl} />
              <DocumentRow label="12th Marksheet" isUploaded={!!staff.xii_marksheetUrl} />
              <DocumentRow label="Graduation" isUploaded={!!staff.graduation_marksheetUrl} />
              <DocumentRow label="Post-Graduation" isUploaded={!!staff.pg_marksheetUrl} />
              <div className="pt-2 border-t border-gray-100 mt-4">
                <DocumentRow label="Professional Resume" isUploaded={!!staff.resumeUrl} isMandatory />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ label, isUploaded, isMandatory }: { label: string; isUploaded: boolean; isMandatory?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:bg-white transition-all group cursor-default">
      <div className="flex items-center gap-3 min-w-0">
        <FileText size={16} className="text-gray-400 group-hover:text-[#0F172A] shrink-0" />
        <span className="text-[12px] font-bold text-[#0F172A] truncate">
          {label} {isMandatory && <span className="text-red-500">*</span>}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[9px] font-black uppercase tracking-widest ${isUploaded ? 'text-green-500' : 'text-gray-300'}`}>
          {isUploaded ? 'Safe' : 'Pending'}
        </span>
      </div>
    </div>
  );
}
