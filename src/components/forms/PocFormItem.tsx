'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

import { FormSelect } from '@/components/ui/form-select';
import { DateInput } from '@/components/ui/date-input';
import { cn } from '@/lib/utils';
import { formatPhone, isValidPhone } from '@/utils/phone';
import { PATTERNS } from '@/utils/validation';
import type { SchoolPOCFormData } from '@/types/school';
import { formCls } from '@/styles/form';

import { FormField } from './FormField';
import { PocFormItemProps } from "@/types/components/PocFormItem";

export function PocFormItem({ poc, index, errors, onRemove, onUpdate, onError }: PocFormItemProps) {
  const key = (field: string) => `poc_${poc.id}_${field}`;

  return (
    <div className="relative p-6 bg-gray-50/30 border border-gray-100 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className={formCls.label}>POC {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(poc.id)}
          className="flex items-center gap-1.5 text-[10px] font-black text-gray-300 uppercase tracking-widest transition-all hover:text-red-500"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FormField label="Name" required error={errors[key('name')]}>
          <input
            value={poc.name}
            onChange={(e) => {
              onUpdate(poc.id, 'name', e.target.value);
              if (errors[key('name')]) {
                onError(
                  key('name'),
                  e.target.value
                    ? (!PATTERNS.NAME.test(e.target.value) ? 'Only letters, dot, hyphen, apostrophe' : '')
                    : 'Name is required',
                );
              }
            }}
            onBlur={(e) => {
              const v = e.target.value;
              onError(
                key('name'),
                !v ? 'Name is required' : (!PATTERNS.NAME.test(v) ? 'Only letters, dot, hyphen, apostrophe' : ''),
              );
            }}
            placeholder="Full name"
            className={cn(formCls.input, errors[key('name')] && formCls.inputError)}
          />
        </FormField>

        <FormField label="Gender" required>
          <FormSelect
            value={poc.gender}
            onValueChange={(val) => onUpdate(poc.id, 'gender', val)}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
            ]}
          />
        </FormField>

        <FormField label="Date of Birth">
          <DateInput
            value={poc.dob || ''}
            onChange={(val) => onUpdate(poc.id, 'dob', val)}
            calendarDisabled={{ after: new Date() }}
          />
        </FormField>

        <FormField label="Designation" required error={errors[key('designation')]}>
          <input
            value={poc.designation}
            onChange={(e) => {
              onUpdate(poc.id, 'designation', e.target.value);
              if (errors[key('designation')]) {
                onError(key('designation'), e.target.value ? '' : 'Designation is required');
              }
            }}
            onBlur={(e) => onError(key('designation'), e.target.value ? '' : 'Designation is required')}
            placeholder="e.g. Coordinator"
            className={cn(formCls.input, errors[key('designation')] && formCls.inputError)}
          />
        </FormField>

        <FormField label="Contact Number" required error={errors[key('contact')]}>
          <input
            type="tel"
            inputMode="numeric"
            value={poc.contactNumber}
            onChange={(e) => {
              const v = formatPhone(e.target.value);
              onUpdate(poc.id, 'contactNumber', v);
              if (errors[key('contact')]) {
                onError(key('contact'), isValidPhone(v) ? '' : 'Must be 10 digits');
              }
            }}
            onBlur={(e) => onError(key('contact'), isValidPhone(e.target.value) ? '' : 'Must be 10 digits')}
            placeholder="801-987-9800"
            maxLength={12}
            className={cn(formCls.input, errors[key('contact')] && formCls.inputError)}
          />
        </FormField>

        <FormField label="Alternate Number" error={errors[key('alt')]}>
          <input
            type="tel"
            inputMode="numeric"
            value={poc.alternateNumber}
            onChange={(e) => {
              const v = formatPhone(e.target.value);
              onUpdate(poc.id, 'alternateNumber', v);
              if (errors[key('alt')]) {
                onError(key('alt'), v && !isValidPhone(v) ? 'Must be 10 digits' : '');
              }
            }}
            onBlur={(e) => {
              const v = e.target.value;
              onError(key('alt'), v && !isValidPhone(v) ? 'Must be 10 digits' : '');
            }}
            placeholder="801-987-9800"
            maxLength={12}
            className={cn(formCls.input, errors[key('alt')] && formCls.inputError)}
          />
        </FormField>

        <FormField label="Remarks" className="md:col-span-2 lg:col-span-3">
          <textarea
            maxLength={300}
            value={poc.remarks}
            onChange={(e) => onUpdate(poc.id, 'remarks', e.target.value)}
            placeholder="Optional notes..."
            className={cn(formCls.input, 'h-16 resize-none')}
          />
          <p className={cn(formCls.errorText, 'mt-1 mr-1 text-right text-gray-300')}>
            {poc.remarks.length}/300
          </p>
        </FormField>
      </div>
    </div>
  );
}
