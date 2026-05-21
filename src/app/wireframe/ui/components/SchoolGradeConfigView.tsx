'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBasePath } from './use-base-path';
import { Plus, Minus, Save, AlertCircle } from 'lucide-react';
import { PageWrapper, PageHeader, PrimaryButton, ErrorBanner } from './ui';
import { GradeRow, GradeRowErrors, SchoolGradeConfigViewProps } from '@/types';
import { GRADE_INPUT_OK as inputOk, GRADE_INPUT_ERR as inputErr } from './styles';

function validateRows(rows: GradeRow[]): Record<string, GradeRowErrors> {
  const errors: Record<string, GradeRowErrors> = {};

  rows.forEach((row, idx) => {
    const rowErr: GradeRowErrors = {};
    const from = parseInt(row.fromMarks);
    const to = parseInt(row.toMarks);

    if (row.fromMarks.trim() === '' || isNaN(from) || from < 0) {
      rowErr.fromMarks = 'Required, must be ≥ 0';
    }

    if (row.toMarks.trim() === '' || isNaN(to)) {
      rowErr.toMarks = 'Required number';
    } else if (!isNaN(from) && to <= from) {
      rowErr.toMarks = 'Must be > From Marks';
    }

    if (!row.grade.trim()) {
      rowErr.grade = 'Required';
    }

    // Gap/overlap check: fromMarks must equal previous toMarks + 1
    if (idx > 0) {
      const prevTo = parseInt(rows[idx - 1].toMarks);
      if (!isNaN(prevTo) && !isNaN(from) && from !== prevTo + 1) {
        rowErr.fromMarks = `Must be ${prevTo + 1} (no gap/overlap)`;
      }
    }

    if (Object.keys(rowErr).length > 0) {
      errors[row.id] = rowErr;
    }
  });

  // Duplicate grade check
  const gradeCounts: Record<string, string[]> = {};
  rows.forEach((row) => {
    const g = row.grade.trim().toUpperCase();
    if (g) {
      if (!gradeCounts[g]) gradeCounts[g] = [];
      gradeCounts[g].push(row.id);
    }
  });
  Object.values(gradeCounts).forEach((ids) => {
    if (ids.length > 1) {
      ids.forEach((id) => {
        errors[id] = { ...errors[id], grade: 'Duplicate grade' };
      });
    }
  });

  return errors;
}

export const SchoolGradeConfigView: React.FC<SchoolGradeConfigViewProps> = ({
  schoolName,
  schoolId,
  sessionId,
  sessionYear,
}) => {
  const router = useRouter();
  const base = useBasePath();
  const [rows, setRows] = useState<GradeRow[]>([
    { id: '1', fromMarks: '0', toMarks: '40', grade: 'D', remarks: '' },
    { id: '2', fromMarks: '41', toMarks: '50', grade: 'C', remarks: '' },
    { id: '3', fromMarks: '51', toMarks: '60', grade: 'C+', remarks: '' },
    { id: '4', fromMarks: '61', toMarks: '70', grade: 'B', remarks: '' },
    { id: '5', fromMarks: '71', toMarks: '80', grade: 'B+', remarks: '' },
    { id: '6', fromMarks: '81', toMarks: '90', grade: 'A', remarks: '' },
    { id: '7', fromMarks: '91', toMarks: '100', grade: 'A+', remarks: '' },
  ]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const allErrors = validateRows(rows);
  const hasErrors = Object.keys(allErrors).length > 0;

  const getErr = (id: string, field: keyof GradeRowErrors): string | undefined => {
    if (!submitAttempted && !touched[`${id}.${field}`]) return undefined;
    return allErrors[id]?.[field];
  };

  const markTouched = (id: string, field: keyof GradeRowErrors) => {
    setTouched((prev) => ({ ...prev, [`${id}.${field}`]: true }));
  };

  const addRow = () => {
    if (hasErrors) return;
    const lastRow = rows[rows.length - 1];
    const nextFrom =
      lastRow && !isNaN(parseInt(lastRow.toMarks))
        ? (parseInt(lastRow.toMarks) + 1).toString()
        : '';
    const newId = (Math.max(...rows.map((r) => parseInt(r.id)), 0) + 1).toString();
    setRows([...rows, { id: newId, fromMarks: nextFrom, toMarks: '', grade: '', remarks: '' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      const newRows = rows.filter((r) => r.id !== id);
      // Re-sync fromMarks after removal
      const synced = newRows.map((r, i) => {
        if (i === 0) return r;
        const prevTo = parseInt(newRows[i - 1].toMarks);
        if (!isNaN(prevTo)) return { ...r, fromMarks: (prevTo + 1).toString() };
        return r;
      });
      setRows(synced);
    }
  };

  const updateRow = (id: string, field: keyof GradeRow, value: string) => {
    const newRows = [...rows];
    const idx = newRows.findIndex((r) => r.id === id);
    if (idx === -1) return;
    newRows[idx] = { ...newRows[idx], [field]: value };

    if (field === 'toMarks') {
      const toVal = parseInt(value);
      if (idx < newRows.length - 1 && !isNaN(toVal)) {
        newRows[idx + 1] = { ...newRows[idx + 1], fromMarks: (toVal + 1).toString() };
      }
    }

    setRows(newRows);
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (hasErrors) return;
    // proceed with save
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Grade Configuration"
        subtitle={sessionYear ? `${schoolName} | ${sessionYear}` : schoolName}
        showBack
        onBack={() =>
          router.push(
            `${base}/school/manage-sessions/module/result?schoolId=${schoolId}&sessionId=${sessionId}`
          )
        }
      />

      <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4 max-w-4xl mx-auto">
        {/* Table Headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr_2.5fr_1fr] gap-6 px-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">From Marks</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">To Marks</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Grade</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Remarks</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {rows.map((row) => {
            const fmErr = getErr(row.id, 'fromMarks');
            const tmErr = getErr(row.id, 'toMarks');
            const grErr = getErr(row.id, 'grade');
            const rowHasErr = !!(fmErr || tmErr || grErr);

            return (
              <div
                key={row.id}
                className={`grid grid-cols-[1fr_1fr_1fr_2.5fr_1fr] gap-6 items-start bg-white border rounded-2xl p-3 transition-all ${
                  rowHasErr ? 'border-red-200' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {/* From Marks */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={row.fromMarks}
                    onChange={(e) => updateRow(row.id, 'fromMarks', e.target.value)}
                    onBlur={() => markTouched(row.id, 'fromMarks')}
                    className={fmErr ? inputErr : inputOk}
                  />
                  {fmErr && <p className="text-[10px] text-red-500 font-semibold text-center leading-tight">{fmErr}</p>}
                </div>

                {/* To Marks */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={row.toMarks}
                    onChange={(e) => updateRow(row.id, 'toMarks', e.target.value)}
                    onBlur={() => markTouched(row.id, 'toMarks')}
                    className={tmErr ? inputErr : inputOk}
                  />
                  {tmErr && <p className="text-[10px] text-red-500 font-semibold text-center leading-tight">{tmErr}</p>}
                </div>

                {/* Grade */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={row.grade}
                    onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                    onBlur={() => markTouched(row.id, 'grade')}
                    className={`${grErr ? inputErr : inputOk} font-black`}
                  />
                  {grErr && <p className="text-[10px] text-red-500 font-semibold text-center leading-tight">{grErr}</p>}
                </div>

                {/* Remarks */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Remark (e.g. Excellent)"
                    value={row.remarks}
                    onChange={(e) => updateRow(row.id, 'remarks', e.target.value)}
                    className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl px-4 text-[13px] font-medium text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-2 pt-0.5">
                  <button
                    onClick={addRow}
                    disabled={hasErrors}
                    title={hasErrors ? 'Fix errors before adding row' : 'Add row'}
                    className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <Plus size={18} />
                  </button>
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 active:scale-90 transition-all"
                    >
                      <Minus size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global error summary on submit attempt */}
        {submitAttempted && hasErrors && (
          <div className="flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-100 rounded-2xl">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-[12px] font-bold text-red-500">Fix all errors before saving.</p>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-blue-600 text-white rounded-2xl text-[16px] font-bold flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save size={20} />
            Save Grade Configuration
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};
