'use client';

import { useMemo, useState, useEffect } from 'react';
import { X, Printer, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { STAFF_FIELDS } from '@/types/staff';
import { ExportModalProps } from "@/types/components/ExportModal";

export function ExportModal({
  isOpen,
  isExiting,
  selectedFields,
  isExporting = false,
  onClose,
  onExport,
  onFieldToggle,
  onSelectAllCustom,
  onClearCustom,
}: ExportModalProps) {

  const allFieldsList = useMemo(() => {
    const fields = [
      { id: 'employeeId', label: 'Employee ID' },
      ...Object.entries(STAFF_FIELDS).map(([key, field]) => ({
        id: key,
        label: field.fieldName
      }))
    ];
    return fields;
  }, []);

  const selectedCount = allFieldsList.filter((field) => selectedFields[field.id]).length;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${
        isExiting ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${
          isExiting ? 'animate-zoomOut' : 'animate-zoomIn'
        }`}
      >
        {/* Header */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold text-neutral-900">Export Staff Data</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">

          {/* Fields Preview */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h4 className="text-sm font-semibold text-neutral-700">
                Fields to be exported
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-xs text-neutral-500 font-medium">
                  {selectedCount} fields selected
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSelectAllCustom}
                    className="h-8 px-3 text-xs border-neutral-200"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClearCustom}
                    className="h-8 px-3 text-xs border-neutral-200"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allFieldsList.map((field) => (
                <div
                  key={field.id}
                  onClick={() => onFieldToggle?.(field.id, !selectedFields[field.id])}
                  className={`flex items-center gap-3 p-2.5 border rounded-lg transition-all cursor-pointer hover:border-[#0F172A]/30 ${
                    selectedFields[field.id]
                      ? 'border-neutral-200 bg-white'
                      : 'border-neutral-100 bg-neutral-50/50 opacity-40 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      selectedFields[field.id]
                        ? 'bg-[#0F172A] border-[#0F172A]'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {selectedFields[field.id] && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`text-[13px] font-medium truncate ${
                      selectedFields[field.id] ? 'text-neutral-900' : 'text-neutral-400'
                    }`}
                  >
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-2.5 justify-end p-6 border-t border-neutral-100 bg-neutral-50/30 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="px-5 h-10 text-neutral-600 hover:bg-neutral-50 border-neutral-200 rounded-xl text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onExport('print')}
            disabled={isExporting}
            className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2 px-5 h-10 rounded-xl transition-all text-sm font-bold"
          >
            <Printer className="w-4 h-4" />
            {isExporting ? 'Preparing...' : 'Print PDF'}
          </Button>
          <Button
            onClick={() => onExport('excel')}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-6 h-10 rounded-xl transition-all text-sm font-bold"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </Button>
          <Button
            onClick={() => onExport('pdf')}
            disabled={isExporting}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-5 h-10 rounded-xl transition-all text-sm font-bold"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Preparing...' : 'Export to PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}
