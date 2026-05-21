import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormWrapperProps } from "@/types/components/FormWrapper";

export const FormWrapper = ({
  title,
  description,
  error,
  children,
  className = '',
  ...props
}: FormWrapperProps) => {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      
      {children}
    </form>
  );
};
