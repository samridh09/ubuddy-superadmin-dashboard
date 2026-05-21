'use client';

import React from 'react';
import type { CreateEnquiryPayload } from '@/types/enquiry';
import { DateInput } from '@/components/ui/date-input';
import type { AcademicClass } from '@/lib/services/academic-service';
import type { Session } from '@/lib/services/session-service';
import { StepStudentInfoProps } from "@/types/components/StepStudentInfo";

export function StepStudentInfo({
  formData,
  fieldErrors,
  classes,
  sessions,
  onInputChange,
  onSessionChange,
  inputClass,
  labelClass,
}: StepStudentInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ─── Core Required Fields ─── */}
      <div className="space-y-1.5 md:col-span-2">
        <label className={labelClass}>Student Name *</label>
        <input
          required
          type="text"
          value={formData.student_name}
          onChange={(e) => onInputChange('student_name', e.target.value)}
          className={inputClass('student_name')}
          placeholder="E.g. Aarav Sharma"
        />
        {fieldErrors.student_name && (
          <p className="text-[10px] text-red-500 font-medium">{fieldErrors.student_name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Session *</label>
        <select
          required
          value={formData.session_id}
          onChange={(e) => onSessionChange(e.target.value)}
          className={inputClass('session_id')}
        >
          <option value="">Select Session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name ||
                `${new Date(session.start_date).getFullYear()}-${new Date(session.end_date).getFullYear()}`}
              {session.is_active ? ' (Active)' : ''}
            </option>
          ))}
        </select>
        {fieldErrors.session_id && (
          <p className="text-[10px] text-red-500 font-medium">{fieldErrors.session_id}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>
          Class *
          {!formData.session_id && (
            <span className="text-[9px] text-amber-500 ml-2 font-normal normal-case tracking-normal">
              Select session first
            </span>
          )}
        </label>
        <select
          required
          value={formData.class_id}
          onChange={(e) => onInputChange('class_id', e.target.value)}
          disabled={!formData.session_id}
          className={`${inputClass('class_id')} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.display_name || `${cls.name}${cls.section ? ' - ' + cls.section : ''}`}
            </option>
          ))}
        </select>
        {fieldErrors.class_id && (
          <p className="text-[10px] text-red-500 font-medium">{fieldErrors.class_id}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Gender *</label>
        <select
          required
          value={formData.gender}
          onChange={(e) => onInputChange('gender', e.target.value)}
          className={inputClass('gender')}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Source of Enquiry *</label>
        <select
          required
          value={formData.source}
          onChange={(e) => onInputChange('source', e.target.value)}
          className={inputClass('source')}
        >
          <option value="WALK_IN">Walk In</option>
          <option value="WEBSITE">Website</option>
          <option value="PHONE">Phone</option>
          <option value="REFERRAL">Referral</option>
          <option value="SOCIAL_MEDIA">Social Media</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* ─── Optional Fields ─── */}
      <div className="md:col-span-2 mt-2 mb-1">
        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-100 flex-1" />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Optional Details
          </span>
          <div className="h-px bg-gray-100 flex-1" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Date of Birth</label>
        <DateInput
          value={formData.dateOfBirth || ''}
          onChange={(v) => onInputChange('dateOfBirth', v)}
          calendarDisabled={{ after: new Date() }}
        />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Father&apos;s Name</label>
        <input
          type="text"
          value={formData.father_name || ''}
          onChange={(e) => onInputChange('father_name', e.target.value)}
          className={inputClass('father_name')}
          placeholder="Father's full name"
        />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Mother&apos;s Name</label>
        <input
          type="text"
          value={formData.mother_name || ''}
          onChange={(e) => onInputChange('mother_name', e.target.value)}
          className={inputClass('mother_name')}
          placeholder="Mother's full name"
        />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Last Class Attended</label>
        <input
          type="text"
          value={formData.last_class || ''}
          onChange={(e) => onInputChange('last_class', e.target.value)}
          className={inputClass('last_class')}
          placeholder="E.g. 5th"
        />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Last School</label>
        <input
          type="text"
          value={formData.last_school || ''}
          onChange={(e) => onInputChange('last_school', e.target.value)}
          className={inputClass('last_school')}
          placeholder="Previous school name"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <label className={labelClass}>Address</label>
        <textarea
          rows={2}
          value={formData.address || ''}
          onChange={(e) => onInputChange('address', e.target.value)}
          className={`${inputClass('address')} resize-none`}
          placeholder="Full address"
        />
      </div>
    </div>
  );
}
