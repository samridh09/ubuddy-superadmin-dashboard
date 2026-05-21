'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UnderDevelopmentProps } from "@/types/components/UnderDevelopment";

export function UnderDevelopment({
  title,
  description,
}: UnderDevelopmentProps) {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center px-4">
        <p className="text-[13px] font-medium text-gray-400 uppercase tracking-widest mb-3">
          In Development
        </p>
        {title && (
          <h1 className="text-[22px] font-semibold text-[#0F172A] mb-2">{title}</h1>
        )}
        {description && (
          <p className="text-[13px] text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
        )}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-[#0F172A] hover:bg-gray-50 transition-colors mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
