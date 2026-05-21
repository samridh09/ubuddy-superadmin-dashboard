'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CustomSelectProps } from '@/types';

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, isSmall = false, disabled = false }) => {
  return (
    <div className={`flex-1 relative ${isSmall ? 'w-full max-w-[190px]' : 'space-y-1'}`}>
      {label && <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.05em] px-0.5">{label}</label>}
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger 
          disabled={disabled}
          className={`w-full transition-all duration-150 rounded-lg text-blue-900 border-gray-200 hover:border-gray-300 shadow-none focus-visible:ring-0 focus-visible:border-blue-500 h-auto ${
            isSmall ? 'px-3 py-2 text-[12px] font-semibold bg-white' : 'px-4 py-2.5 text-[13px] font-medium bg-white/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : ''}`}
        >
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-gray-200 shadow-xl shadow-blue-950/5 animate-in fade-in slide-in-from-top-1 px-1 py-1">
          {options.map((option) => (
            <SelectItem 
              key={option} 
              value={option}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 focus:bg-blue-50/50 focus:text-blue-600 rounded-lg cursor-pointer"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
