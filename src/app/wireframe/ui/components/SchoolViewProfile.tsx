'use client';

import React from 'react';
import {
  Pencil,
  School,
  ChevronLeft,
  Clock,
  User,
  MapPin,
  Phone,
  Globe,
  ShieldCheck,
  FileText,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { PageWrapper, PrimaryButton } from './ui';
import { SchoolViewProfilePOC, SchoolProfileViewData, SchoolViewProfileProps } from '@/types';
import { formatToDisplayDate } from '@/utils/date';

function Field({ label, value }: { label: string; value?: string }) {
  const empty = !value;
  return (
    <div className="pb-3 border-b border-gray-50">
      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <p className={`text-[13px] font-bold py-1 ${empty ? 'text-gray-300 italic font-medium' : 'text-blue-900'}`}>
        {empty ? 'Not provided' : value}
      </p>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-6">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
  );
}

const formatPhone = (val: string) => {
  if (!val) return '';
  const d = val.replace(/\D/g, '').slice(0, 10);
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
};

export const SchoolViewProfile: React.FC<SchoolViewProfileProps> = ({ data }) => {
  const router = useRouter();
  const base = useBasePath();

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push(`${base}/school`)}
            className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-900 hover:border-gray-200 transition-all duration-200 active:scale-95 shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[24px] font-bold text-blue-900 tracking-tight">School Management | View Profile</h2>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[40px] border border-gray-100 p-10 sm:p-12 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-10 text-center sm:text-left">
            <div className="w-36 h-36 rounded-[40px] bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <School size={48} className="text-gray-200" />
              )}
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <h1 className="text-[32px] font-black text-blue-900 tracking-tighter leading-tight uppercase">{data.name}</h1>
                <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${data.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {data.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">U-Code:</span>
                  <span className="text-[15px] font-black text-blue-700">{data.uCode}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl">
              <Clock size={18} className="text-gray-300" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Last Updated</span>
                <span className="text-[13px] font-bold text-gray-600 tracking-tight">Today, 10:45 AM</span>
              </div>
            </div>
            <PrimaryButton
              onClick={() => router.push(`${base}/school/view/${data.id}/edit`)}
              className="px-10 py-4 rounded-2xl text-[14px] font-black uppercase tracking-widest bg-blue-900 hover:bg-blue-800"
            >
              <Pencil size={18} />
              Edit Profile
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-10 space-y-12 pb-20">

        {/* School Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
          <Field label="School Name" value={data.name} />
          <Field label="UDISE Code" value={data.udiseCode} />
          <Field label="School Code" value={data.schoolCode} />
          <Field label="Affiliation Code" value={data.affiliationCode} />
        </div>

        <div className="h-px bg-gray-50" />

        {/* Leadership */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4">
            <Field label="Principal Name" value={data.principalName} />
            <Field label="Principal Gender" value={data.principalGender} />
            <Field label="Principal DOB" value={formatToDisplayDate(data.principalDob)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4">
            <Field label="Director Name" value={data.directorName} />
            <Field label="Director Gender" value={data.directorGender} />
            <Field label="Director DOB" value={formatToDisplayDate(data.directorDob)} />
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Contact & Location */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
          <Field label="State" value={data.state} />
          <Field label="City" value={data.city} />
          <Field label="Email" value={data.email} />
          <Field label="Website" value={data.website} />
          <Field label="Phone Number" value={formatPhone(data.phone)} />
          <Field label="Alternate Phone" value={formatPhone(data.alternatePhone)} />
          <div className="col-span-2 md:col-span-4">
            <Field label="Full Address" value={data.address} />
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Admin Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
          <div className="col-span-2 md:col-span-4">
            <Field label="Remarks" value={data.remarks} />
          </div>
        </div>

        {/* Points of Contact */}
        <div>
          <SectionHeading icon={<FileText size={15} />} title="Points of Contact" />
          {data.pocs.length === 0 ? (
            <div className="py-10 border-2 border-dashed border-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">No POCs added</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {data.pocs.map((poc) => (
                <div key={poc.id} className="p-6 bg-gray-50/30 border border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{poc.designation || 'POC'}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-4">
                    <Field label="Name" value={poc.name} />
                    <Field label="Gender" value={poc.gender ? poc.gender.charAt(0) + poc.gender.slice(1).toLowerCase() : ''} />
                    <Field label="Date of Birth" value={formatToDisplayDate(poc.dob)} />
                    <Field label="Designation" value={poc.designation} />
                    <Field label="Contact" value={formatPhone(poc.contactNumber)} />
                    <Field label="Alternate Contact" value={formatPhone(poc.alternateNumber || '')} />
                    {poc.remarks && (
                      <div className="col-span-2 md:col-span-3">
                        <Field label="Remarks" value={poc.remarks} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
};
