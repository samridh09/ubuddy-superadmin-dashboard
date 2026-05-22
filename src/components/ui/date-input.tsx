'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import type { Matcher } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Slot indices: 0-1 = dd, 2-3 = mm, 4-7 = yyyy
// Display format: DD-MM-YYYY (10 chars with hyphens at positions 2 and 5)
function slotToDisplayPos(slot: number): number {
  if (slot <= 2) return slot;
  if (slot <= 4) return slot + 1;
  return slot + 2;
}

function buildDisplay(slots: string[]): string {
  if (slots.every(s => !s)) return '';
  const dd   = (slots[0] || '_') + (slots[1] || '_');
  const mm   = (slots[2] || '_') + (slots[3] || '_');
  const yyyy = (slots[4] || '_') + (slots[5] || '_') + (slots[6] || '_') + (slots[7] || '_');
  return `${dd}/${mm}/${yyyy}`;
}

function slotsToISO(slots: string[]): string {
  if (slots.some(s => !s)) return '';
  return `${slots.slice(4, 8).join('')}-${slots.slice(2, 4).join('')}-${slots.slice(0, 2).join('')}`;
}

function isoToSlots(iso: string): string[] {
  const empty = Array(8).fill('') as string[];
  if (!iso) return empty;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return empty;
  return [...m[3], ...m[2], ...m[1]];
}

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}

function dateToISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface DateInputProps {
  value?: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  compact?: boolean;
  calendarDisabled?: Matcher | Matcher[];
}

export function DateInput({
  value,
  onChange,
  onBlur,
  placeholder = 'DD/MM/YYYY',
  error = false,
  className,
  compact = false,
  calendarDisabled,
}: DateInputProps) {
  const [slots, setSlots]       = useState<string[]>(() => isoToSlots(value || ''));
  const [writePos, setWritePos] = useState(() => (value ? 8 : 0));
  const [open, setOpen]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const selfChanged             = useRef(false);

  useEffect(() => {
    if (selfChanged.current) { selfChanged.current = false; return; }
    setSlots(isoToSlots(value || ''));
    setWritePos(value ? 8 : 0);
  }, [value]);

  const display = buildDisplay(slots);

  const moveCursor = (slot: number) => {
    const pos = slotToDisplayPos(Math.min(slot, 8));
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(pos, pos));
  };

  const emit = (newSlots: string[]) => {
    selfChanged.current = true;
    onChange(slotsToISO(newSlots));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') return;
    e.preventDefault();

    if (/^\d$/.test(e.key)) {
      const idx = Math.min(writePos, 7);
      const newSlots = [...slots];
      newSlots[idx] = e.key;
      const newPos = Math.min(idx + 1, 8);
      setSlots(newSlots);
      setWritePos(newPos);
      moveCursor(newPos);
      emit(newSlots);
    } else if (e.key === 'Backspace' && writePos > 0) {
      const idx = writePos - 1;
      const newSlots = [...slots];
      newSlots[idx] = '';
      setSlots(newSlots);
      setWritePos(idx);
      moveCursor(idx);
      emit(newSlots);
    } else if (e.key === 'Delete') {
      const cleared = Array(8).fill('') as string[];
      setSlots(cleared);
      setWritePos(0);
      moveCursor(0);
      selfChanged.current = true;
      onChange('');
    }
  };

  const handleFocusOrClick = () => {
    // Don't reset position when clicking back into a filled field
    const filledSlots = slots.filter(s => s !== '').length;
    if (filledSlots === 0) {
      setWritePos(0);
      moveCursor(0);
    } else {
      moveCursor(writePos);
    }
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const iso = dateToISO(date);
      setSlots(isoToSlots(iso));
      setWritePos(8);
      selfChanged.current = true;
      onChange(iso);
    } else {
      setSlots(Array(8).fill(''));
      setWritePos(0);
      selfChanged.current = true;
      onChange('');
    }
    setOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="text"
        value={display}
        readOnly
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onFocus={handleFocusOrClick}
        onClick={handleFocusOrClick}
        onBlur={handleBlur}
        className={cn(
          'w-full bg-white border transition-all outline-none cursor-text',
          compact
            ? 'rounded-lg px-2 py-1 pr-7 text-[12px] font-medium'
            : 'rounded-xl px-4 py-3 pr-10 text-[13px] font-bold',
          error
            ? 'bg-red-50/50 border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300'
            : 'border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5 text-blue-900 placeholder-gray-300',
        )}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors',
              compact ? 'right-1.5 p-0.5' : 'right-3 p-1',
            )}
          >
            <CalendarIcon size={compact ? 12 : 14} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={isoToDate(value || '')}
            onSelect={handleCalendarSelect}
            disabled={calendarDisabled}
            defaultMonth={isoToDate(value || '') ?? new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function formatDateDisplay(iso: string): string {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}
