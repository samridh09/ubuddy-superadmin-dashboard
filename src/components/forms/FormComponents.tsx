import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormSelect } from '@/components/ui/form-select';
import { DateInput } from '@/components/ui/date-input';

// ─── Styles ───────────────────────────────────────────────────────────────────
const BASE_INPUT = "w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5 transition-all placeholder-gray-300 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#1e3a8a]";
const ERROR_INPUT = "w-full bg-red-50/50 border border-red-200 rounded-xl px-4 py-3 text-[13px] font-bold text-red-900 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder-red-300 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_#fff1f2_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#7f1d1d]";

// ─── Sub-Components ───────────────────────────────────────────────────────────

export const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

export const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 flex items-center gap-1">
      <AlertCircle size={10} />
      {msg}
    </p>
  ) : null;

// ─── Main Components ──────────────────────────────────────────────────────────

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextInput = ({ label, error, required, className = '', ...props }: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="w-full">
    <FieldLabel label={label} required={required} />
    <input
      className={`${error ? ERROR_INPUT : BASE_INPUT} ${className}`}
      {...props}
    />
    <ErrorMsg msg={error} />
  </div>
);

export const SelectInput = ({ label, error, required, options, value, onValueChange, placeholder }: BaseProps & { options: { value: string; label: string }[]; value: string; onValueChange: (val: string) => void; placeholder?: string }) => (
  <div className="w-full">
    <FieldLabel label={label} required={required} />
    <FormSelect
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      error={!!error}
    />
    <ErrorMsg msg={error} />
  </div>
);

export const DatePickerInput = ({ label, error, required, value, onChange, onBlur }: BaseProps & { value: string; onChange: (iso: string) => void; onBlur?: () => void }) => (
  <div className="w-full">
    <FieldLabel label={label} required={required} />
    <DateInput
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      calendarDisabled={{ after: new Date() }}
    />
    <ErrorMsg msg={error} />
  </div>
);

export const TextAreaInput = ({ label, error, required, maxChar, className = '', ...props }: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { maxChar?: number }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-1.5 ml-1">
      <FieldLabel label={label} required={required} />
      {maxChar && (
        <span className={`text-[10px] font-bold ${props.value && String(props.value).length >= maxChar ? "text-red-500" : "text-gray-400"}`}>
          {props.value ? String(props.value).length : 0} / {maxChar}
        </span>
      )}
    </div>
    <textarea
      className={`${error ? ERROR_INPUT : BASE_INPUT} ${className}`}
      {...props}
    />
    <ErrorMsg msg={error} />
  </div>
);
