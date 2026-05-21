"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormSelectOption, FormSelectProps } from "@/types/components/form-select";

const TRIGGER_BASE =
  "w-full bg-white border rounded-xl px-4 py-3 text-[13px] font-bold transition-all outline-none flex items-center justify-between cursor-pointer select-none"
const TRIGGER_DEFAULT =
  "border-gray-100 text-blue-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5"
const TRIGGER_ERROR =
  "bg-red-50/50 border-red-200 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
const TRIGGER_PLACEHOLDER = "text-gray-300"

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  error = false,
  disabled = false,
}: FormSelectProps) {
  const selected = options.find(o => o.value === value)

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(val) => { if (val) onValueChange(val); }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          TRIGGER_BASE,
          error ? TRIGGER_ERROR : TRIGGER_DEFAULT,
          !value && TRIGGER_PLACEHOLDER
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {selected?.label ?? placeholder}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon>
          <ChevronDown size={14} className="text-gray-400 shrink-0" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={6} className="z-[9999]">
          <SelectPrimitive.Popup className="w-(--anchor-width) bg-white border border-gray-100 rounded-2xl py-1.5 overflow-hidden shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <SelectPrimitive.List>
              {options.map(opt => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center justify-between px-4 py-2.5 text-[13px] font-bold text-blue-900 cursor-pointer outline-none hover:bg-blue-50 data-highlighted:bg-blue-50 transition-colors"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check size={12} className="text-blue-600" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
