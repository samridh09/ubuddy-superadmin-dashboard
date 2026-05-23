"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Matcher } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DatePickerProps } from "@/types/components/date-picker";

const TRIGGER_BASE =
  "w-full bg-white border rounded-xl px-4 py-3 text-[13px] font-bold transition-all outline-none flex items-center justify-between cursor-pointer text-left"
const TRIGGER_DEFAULT =
  "border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5"
const TRIGGER_ERROR =
  "bg-red-50/50 border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  error = false,
  disabled,
  defaultMonth,
  displayFormat = "dd-MM-yyyy",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(TRIGGER_BASE, error ? TRIGGER_ERROR : TRIGGER_DEFAULT)}
        >
          <span className={cn("font-bold", value ? "text-blue-900" : "text-gray-300")}>
            {value ? format(value, displayFormat) : placeholder}
          </span>
          <CalendarIcon size={14} className="text-gray-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          disabled={disabled}
          defaultMonth={value ?? defaultMonth}
        />
      </PopoverContent>
    </Popover>
  )
}
