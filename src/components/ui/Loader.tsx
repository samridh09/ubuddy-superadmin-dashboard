import React from 'react';
import { LoaderProps } from "@/types/components/Loader";

const SIZE_CLASSES: Record<NonNullable<LoaderProps['size']>, string> = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function Loader({ className = '', size = 'md' }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-4 border-gray-100 border-t-[#0F172A]`} />
    </div>
  );
}
