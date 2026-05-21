import React from 'react';
import { BadgeProps, BadgeVariant } from "@/types/components/Badge";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-orange-50 text-orange-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-[#0F172A]',
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-blue-50 text-[#0F172A] border border-blue-100',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const base = 'inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-semibold tracking-wide';
  return (
    <span className={`${base} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  );
};
