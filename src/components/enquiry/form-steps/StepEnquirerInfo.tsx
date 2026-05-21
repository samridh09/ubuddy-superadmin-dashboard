'use client';

import React from 'react';
import { UserPlus, Lock, CalendarDays } from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';
import type { CreateEnquiryPayload, DuplicateCheckResult } from '@/types/enquiry';
import { DuplicateWarningBanner } from '../DuplicateWarningBanner';
import { StepEnquirerInfoProps } from "@/types/components/StepEnquirerInfo";

const RELATION_OPTIONS = [
  { value: 'SELF', label: 'Self' },
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'BROTHER', label: 'Brother' },
  { value: 'SISTER', label: 'Sister' },
  { value: 'UNCLE', label: 'Uncle' },
  { value: 'AUNT', label: 'Aunt' },
  { value: 'OTHER', label: 'Other' },
];

export function StepEnquirerInfo({
  formData,
  fieldErrors,
  contactDisplay,
  altContactDisplay,
  enquirerNameLocked,
  duplicateResult,
  duplicateDismissed,
  onDuplicateDismiss,
  onEnquirerChange,
  onInputChange,
  inputClass,
  labelClass,
}: StepEnquirerInfoProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Duplicate Warning */}
      {duplicateResult?.isDuplicate && duplicateResult.matches && !duplicateDismissed && (
        <DuplicateWarningBanner
          matches={duplicateResult.matches}
          onDismiss={onDuplicateDismiss}
        />
      )}

      {/* ─── Enquirer Section Header ─── */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <UserPlus className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-[#0F172A]">Enquirer Details</h3>
          <p className="text-[11px] text-gray-500">
            Who is making this enquiry on behalf of the student?
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
            Duplicate Check
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relation */}
        <div className="space-y-1.5">
          <label className={labelClass}>Relation to Student *</label>
          <select
            required
            value={formData.primary_enquirer.relation}
            onChange={(e) => onEnquirerChange('relation', e.target.value)}
            className={inputClass('primary_enquirer.relation')}
          >
            {RELATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors['primary_enquirer.relation'] && (
            <p className="text-[10px] text-red-500 font-medium">
              {fieldErrors['primary_enquirer.relation']}
            </p>
          )}
        </div>

        {/* Enquirer Name (with autofill logic) */}
        <div className="space-y-1.5">
          <label className={labelClass}>
            Enquirer Name *
            {enquirerNameLocked && (
              <span className="inline-flex items-center gap-1 ml-2 text-[9px] text-blue-500 font-normal normal-case tracking-normal">
                <Lock className="w-2.5 h-2.5" />
                Auto-filled
              </span>
            )}
          </label>
          <input
            required
            type="text"
            value={formData.primary_enquirer.name}
            onChange={(e) => onEnquirerChange('name', e.target.value)}
            readOnly={enquirerNameLocked}
            className={`${inputClass('primary_enquirer.name')} ${
              enquirerNameLocked ? 'bg-blue-50/50 border-blue-200 cursor-not-allowed' : ''
            }`}
            placeholder="E.g. Rajesh Sharma"
          />
          {enquirerNameLocked && (
            <p className="text-[10px] text-blue-500 font-medium">
              {formData.primary_enquirer.relation === 'SELF'
                ? 'Name set to student name'
                : `Name auto-filled from ${formData.primary_enquirer.relation.toLowerCase()}'s name`}
            </p>
          )}
          {fieldErrors['primary_enquirer.name'] && (
            <p className="text-[10px] text-red-500 font-medium">
              {fieldErrors['primary_enquirer.name']}
            </p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-1.5">
          <label className={labelClass}>Contact Number *</label>
          <input
            required
            type="tel"
            value={contactDisplay}
            onChange={(e) => onEnquirerChange('contact_number', e.target.value)}
            maxLength={12}
            className={inputClass('primary_enquirer.contact_number')}
            placeholder="xxx-xxx-xxxx"
          />
          {fieldErrors['primary_enquirer.contact_number'] && (
            <p className="text-[10px] text-red-500 font-medium">
              {fieldErrors['primary_enquirer.contact_number']}
            </p>
          )}
        </div>

        {/* Alternate Number */}
        <div className="space-y-1.5">
          <label className={labelClass}>Alternate Number</label>
          <input
            type="tel"
            value={altContactDisplay}
            onChange={(e) => onEnquirerChange('alternate_contact_number', e.target.value)}
            maxLength={12}
            className={inputClass('primary_enquirer.alternate_contact_number')}
            placeholder="xxx-xxx-xxxx (Optional)"
          />
        </div>
      </div>

      {/* Follow-up + Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="space-y-1.5">
          <label className={labelClass}>
            <CalendarDays className="w-3 h-3 inline mr-1" />
            Follow-up Date
          </label>
          <DateInput
            value={formData.follow_up_date || ''}
            onChange={(v) => onInputChange('follow_up_date', v)}
            calendarDisabled={{ before: new Date() }}
          />
        </div>
        <div className="space-y-1.5 md:col-span-1">
          <label className={labelClass}>Special Notes</label>
          <textarea
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => onInputChange('notes', e.target.value)}
            className={`${inputClass('notes')} resize-none`}
            placeholder="Any requirements or comments..."
          />
        </div>
      </div>
    </div>
  );
}
