'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PrimaryButton, SecondaryButton } from '@/app/wireframe/ui/components/ui';
import { DateInput } from '@/components/ui/date-input';
import { Session } from '@/lib/services/session-service';

interface SessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Session;
  mode: 'create' | 'view' | 'edit';
  onEdit?: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  existingSessions?: Session[];
}

export const SessionDialog: React.FC<SessionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  onEdit,
  onDelete,
  isSubmitting = false,
  existingSessions = [],
}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setStartDate(initialData.start_date ? initialData.start_date.split('T')[0] : '');
      setEndDate(initialData.end_date ? initialData.end_date.split('T')[0] : '');
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Session name is mandatory';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
      newErrors.name = 'Only alphabets, numbers, spaces, and hyphens are allowed';
    } else {
      const isDuplicate = existingSessions.some(
        (s) => s.name.toLowerCase() === name.trim().toLowerCase() && s.id !== initialData?.id
      );
      if (isDuplicate) {
        newErrors.name = 'Session name must be unique within the school';
      }
    }

    if (!startDate) {
      newErrors.startDate = 'Starting date is mandatory';
    }

    if (endDate && startDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (end <= start) {
        newErrors.endDate = 'Ending date must be greater than the starting date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    if (validate()) {
      await onSubmit({
        name: name.trim(),
        start_date: startDate,
        end_date: endDate || null,
      });
    }
  };

  const title = mode === 'create' ? 'Create New Session' : mode === 'edit' ? 'Edit Session' : 'Session Details';
  const subtitle = mode === 'create' 
    ? 'Add a new academic year to the institution' 
    : mode === 'edit' 
      ? 'Update session information' 
      : 'View academic year details';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border border-gray-100 shadow-none rounded-[32px]">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-[20px] font-bold text-blue-900 tracking-tight">{title}</h3>
            <p className="text-[12px] font-medium text-gray-400 mt-1 uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Session Name</label>
            <input 
              type="text" 
              placeholder="e.g., 2025-26" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mode === 'view'}
              className={`w-full h-14 bg-gray-50/50 border ${errors.name ? 'border-red-300' : 'border-gray-100'} rounded-2xl px-6 text-[14px] font-bold text-blue-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-200 focus:bg-white transition-all shadow-none disabled:opacity-70`} 
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 px-1 mt-1 uppercase tracking-wider">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Starting Date</label>
              <DateInput 
                value={startDate} 
                onChange={setStartDate} 
                disabled={mode === 'view'}
                error={!!errors.startDate}
              />
              {errors.startDate && <p className="text-[10px] font-bold text-red-500 px-1 mt-1 uppercase tracking-wider">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Ending Date</label>
              <DateInput 
                value={endDate} 
                onChange={setEndDate} 
                disabled={mode === 'view'}
                error={!!errors.endDate}
              />
              {errors.endDate && <p className="text-[10px] font-bold text-red-500 px-1 mt-1 uppercase tracking-wider">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            {mode === 'view' ? (
              <>
                <PrimaryButton type="button" className="h-14 px-12 text-[15px] shadow-none flex items-center gap-2" onClick={(e) => { e.preventDefault(); if (onEdit) onEdit(); }}>
                  <Pencil size={18} />
                  Edit Session
                </PrimaryButton>
                <SecondaryButton type="button" className="h-14 px-10 text-[15px] border-red-100 text-red-500 hover:bg-red-50 shadow-none flex items-center gap-2" onClick={(e) => { e.preventDefault(); if (onDelete) onDelete(); }}>
                  <Trash2 size={18} />
                  Delete
                </SecondaryButton>
              </>
            ) : (
              <>
                <PrimaryButton type="submit" className="h-14 px-12 text-[15px] shadow-none" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Session' : 'Save Changes'}
                </PrimaryButton>
                <SecondaryButton type="button" className="h-14 px-10 text-[15px] border-gray-100 text-gray-500 shadow-none" onClick={onClose}>
                  Cancel
                </SecondaryButton>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sessionName: string;
  isDeleting?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionName,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border border-gray-100 shadow-none rounded-[32px]">
        <div className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Trash2 size={40} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[20px] font-bold text-blue-900 tracking-tight">Delete Session?</h3>
            <p className="text-[14px] font-medium text-gray-500 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-blue-900">{sessionName}</span>? This action cannot be undone.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={onConfirm} 
              disabled={isDeleting}
              className="h-14 w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Session'}
            </button>
            <button 
              onClick={onClose} 
              className="h-14 w-full bg-white border border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
