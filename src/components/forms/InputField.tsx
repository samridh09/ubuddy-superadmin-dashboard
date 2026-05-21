import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  requiredHint?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, requiredHint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label className="text-[13px] font-medium text-[#0F172A]">
          {label} {requiredHint && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg text-[13px] text-[#0F172A] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400 bg-red-50/30'
              : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-400'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
InputField.displayName = 'InputField';
