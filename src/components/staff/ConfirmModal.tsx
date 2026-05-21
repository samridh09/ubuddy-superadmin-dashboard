'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmModalProps } from "@/types/components/ConfirmModal";

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  variant = 'warning',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <X className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-100',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      button: 'bg-[#0F172A] hover:bg-[#1e293b] text-white',
    },
    info: {
      icon: <AlertTriangle className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      button: 'bg-[#0F172A] hover:bg-[#1e293b] text-white',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-zoomIn border border-neutral-100">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center shrink-0`}>
              {style.icon}
            </div>
            <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-5 h-10 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`${style.button} px-5 h-10 rounded-xl font-semibold transition-all active:scale-95`}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
