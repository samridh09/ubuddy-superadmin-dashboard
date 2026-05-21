"use client"

import React, { useState } from "react"
import { DayPicker, type MonthCaptionProps, useDayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { CalendarProps } from "@/types/components/calendar";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (val: number) => void;
  options: { label: string; value: number }[];
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none bg-blue-50 border-0 rounded-xl px-3 py-2 pr-7 text-[12px] font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer transition-all hover:bg-blue-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
      />
    </div>
  );
}

function CustomCaption({ calendarMonth, displayIndex }: MonthCaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();
  const currentYear = new Date().getFullYear();
  const month = calendarMonth.date.getMonth();
  const year = calendarMonth.date.getFullYear();

  const monthOptions = MONTHS.map((label, idx) => ({ label, value: idx }));
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => ({ label: String(currentYear - i), value: currentYear - i })
  );

  const handleMonthChange = (newMonth: number) => {
    goToMonth(new Date(year, newMonth, 1));
  };

  const handleYearChange = (newYear: number) => {
    goToMonth(new Date(newYear, month, 1));
  };

  return (
    <div className="flex items-center gap-2 px-1 mb-2">
      <button
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className="h-8 w-8 shrink-0 flex items-center justify-center rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30"
      >
        <ChevronLeft size={14} />
      </button>

      <div className="flex gap-1.5 flex-1">
        <StyledSelect
          value={month}
          onChange={handleMonthChange}
          options={monthOptions}
        />
        <StyledSelect
          value={year}
          onChange={handleYearChange}
          options={yearOptions}
        />
      </div>

      <button
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className="h-8 w-8 shrink-0 flex items-center justify-center rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 select-none min-w-[290px]", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-2",
        month_caption: "hidden",
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday: "text-[10px] font-black text-gray-300 uppercase w-9 text-center py-1 tracking-widest",
        week: "flex",
        day: "p-[2px]",
        day_button: cn(
          "h-8 w-8 rounded-xl text-[12px] font-bold text-blue-900 transition-all",
          "hover:bg-blue-50 hover:text-blue-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        ),
        selected: "[&>button]:!bg-blue-600 [&>button]:!text-white [&>button]:hover:!bg-blue-700 [&>button]:hover:!text-white",
        today: "[&>button]:ring-1 [&>button]:ring-blue-300 [&>button]:ring-offset-1",
        outside: "[&>button]:!text-gray-200 [&>button]:hover:!bg-transparent",
        disabled: "[&>button]:!text-gray-200 [&>button]:cursor-not-allowed [&>button]:hover:!bg-transparent",
        hidden: "invisible",
        nav: "hidden",
        ...classNames,
      }}
      components={{
        MonthCaption: CustomCaption,
      }}
      {...props}
    />
  )
}
