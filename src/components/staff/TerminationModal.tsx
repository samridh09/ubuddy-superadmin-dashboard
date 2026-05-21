'use client';

import { useState } from 'react';
import { X, UserX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TerminationModalProps } from "@/types/components/TerminationModal";

export function TerminationModal({
  isOpen,
  staffName,
  onConfirm,
  onClose,
}: TerminationModalProps) {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-zoomIn border border-neutral-100">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Terminate Staff</h3>
              <p className="text-xs text-neutral-500">Staff Member: {staffName}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-tight flex justify-between">
              <span>Termination Remarks *</span>
              {error && <span className="text-red-500 lowercase font-normal italic">{error}</span>}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (e.target.value) setError('');
              }}
              placeholder="Enter reason for termination..."
              className={`w-full h-32 px-3 py-2 border ${error ? 'border-red-500 bg-red-50/10' : 'border-neutral-200'} rounded-xl text-sm focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] outline-none transition-all resize-none`}
              autoFocus
            />
            <p className="text-[10px] text-neutral-400">
              Once terminated, this staff member will be moved to the Ex-Staff list.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setRemarks('');
                setError('');
                onClose();
              }}
              className="px-5 h-10 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!remarks.trim()) {
                  setError('Remarks required');
                  return;
                }
                onConfirm(remarks);
                setRemarks('');
                setError('');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 h-10 rounded-xl font-semibold transition-all active:scale-95"
            >
              Terminate Staff
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
