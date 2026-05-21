'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { formCls } from '@/styles/form';
import { FormFieldProps } from "@/types/components/FormField";

/** Wrapper: label + field + error message. Eliminates repeated label/error markup. */
export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn(formCls.fieldWrapper, className)}>
      <label className={formCls.label}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className={formCls.errorText}>{error}</p>}
    </div>
  );
}
