'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { STAFF_FIELDS } from '@/types/staff';
import { StaffSettingsProps } from "@/types/components/StaffSettings";

export function StaffSettings({
  selectedFields,
  onFieldToggle,
  onBack,
  onSave,
}: StaffSettingsProps) {
  // Get only custom (optional) fields that can be toggled
  const customFields = Object.entries(STAFF_FIELDS)
    .filter(([, field]) => field.selection === 'Custom')
    .map(([key, field]) => ({
      id: key,
      label: field.fieldName,
      remarks: field.remarks,
    }));

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold">Staff Form Settings</h2>
            <p className="text-xs text-neutral-500">
              Select the optional fields to include in the staff form (Auto fields are
              selected automatically).
            </p>
          </div>
        </div>
        <Button onClick={onSave} className="bg-[#0F172A] hover:bg-[#0f2233] text-white">
          Save Settings
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Auto Fields Info */}

        {/* Optional Fields Selection */}
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">
            Optional Fields
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customFields.map((field) => (
              <label
                key={field.id}
                className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={selectedFields[field.id] || false}
                  onChange={(e) => onFieldToggle(field.id, e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0F172A] rounded border-neutral-300 focus:ring-[#0F172A] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-neutral-700 block">
                    {field.label}
                  </span>
                  {field.remarks && (
                    <span className="text-xs text-neutral-500 mt-1 block">
                      {field.remarks}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
