'use client';

import React from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { DuplicateMatch, Props } from "@/types/components/DuplicateWarningBanner";

export function DuplicateWarningBanner({ matches, onDismiss, onViewExisting }: Props) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-bold text-amber-800">
              Possible Duplicate{matches.length > 1 ? 's' : ''} Found
            </h4>
            <button
              onClick={onDismiss}
              className="p-1 text-amber-400 hover:text-amber-600 transition-colors rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[12px] text-amber-700 mb-3">
            A similar enquiry already exists. You can still proceed if this is a different student.
          </p>
          <div className="space-y-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between bg-white/60 border border-amber-100 rounded-lg px-3 py-2"
              >
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold text-amber-900 block truncate">
                    {match.student_name}
                  </span>
                  <span className="text-[11px] text-amber-600">
                    {match.contact_number} · {match.status.replace('_', ' ')} · {new Date(match.created_at).toLocaleDateString()}
                  </span>
                </div>
                {onViewExisting && (
                  <button
                    onClick={() => onViewExisting(match.id)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors shrink-0 ml-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={onDismiss}
            className="mt-3 text-[11px] font-bold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors"
          >
            Dismiss & Proceed Anyway →
          </button>
        </div>
      </div>
    </div>
  );
}
