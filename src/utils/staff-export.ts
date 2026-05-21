import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { Staff } from '@/types/staff';
import { STAFF_FIELDS } from '@/types/staff';

export const BASE_EXPORT_FIELDS: string[] = [
  'name',
  'employeeId',
  'gender',
  'mobileNumber',
  'email',
  'staffType',
  'status',
];

export function toHeaderLabel(field: string): string {
  const baseLabels: Record<string, string> = {
    name: 'Name',
    employeeId: 'Employee ID',
    gender: 'Gender',
    mobileNumber: 'Mobile Number',
    email: 'Email',
    staffType: 'Staff Type',
    status: 'Status',
  };
  return baseLabels[field] ?? STAFF_FIELDS[field]?.fieldName ?? field;
}

export function formatExportValue(field: string, value: unknown): string {
  const isImageField = field.toLowerCase().includes('url') || field.toLowerCase().includes('image');
  if (isImageField) return (value === null || value === undefined || value === '') ? 'No' : 'Yes';
  if (value === null || value === undefined || value === '') return '';

  if (field === 'emergencyContact' && typeof value === 'object') {
    const c = value as { name?: string; number?: string; relation?: string };
    return [
      c.name && `Name: ${c.name}`,
      c.number && `Number: ${c.number}`,
      c.relation && `Relation: ${c.relation}`,
    ].filter(Boolean).join(', ');
  }

  if (field === 'bankDetails' && typeof value === 'object') {
    const b = value as {
      bankName?: string;
      ifsc?: string;
      accountHolderName?: string;
      accountNumber?: string;
    };
    return [
      b.bankName && `Bank: ${b.bankName}`,
      b.accountNumber && `A/C: ${b.accountNumber}`,
      b.ifsc && `IFSC: ${b.ifsc}`,
      b.accountHolderName && `Holder: ${b.accountHolderName}`,
    ].filter(Boolean).join(', ');
  }

  if (typeof value === 'object') return JSON.stringify(value);
  if (field === 'status' && typeof value === 'string') return value.charAt(0) + value.slice(1).toLowerCase();
  if (typeof value === 'string' && field.toLowerCase().includes('date')) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString('en-GB');
  }
  return String(value);
}

export function hasMeaningfulExportValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const n = value.trim();
    return n.length > 0 && n.toUpperCase() !== 'N/A';
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(hasMeaningfulExportValue);
  }
  return true;
}

export function exportToDelimitedFile(
  data: Staff[],
  fields: string[],
  delimiter: string,
  filename: string,
): void {
  const header = fields.map(toHeaderLabel).join(delimiter);
  const rows = data.map((s) =>
    fields.map((f) => {
      const str = formatExportValue(f, s[f as keyof Staff]);
      return str.includes(delimiter) || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(delimiter)
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadPDF(data: Staff[], fields: string[]): void {
  const minWidth = 842;
  const dynamicWidth = Math.max(minWidth, fields.length * 85);
  const doc = new jsPDF({ orientation: 'l', unit: 'pt', format: [595, dynamicWidth] });
  const headers = ['S. No.', ...fields.map(toHeaderLabel)];
  const rows = data.map((s, i) => [
    (i + 1).toString(),
    ...fields.map((f) => formatExportValue(f, s[f as keyof Staff])),
  ]);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Staff Directory Export', 40, 40);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated on ${new Date().toLocaleString()} | Total Staff: ${data.length} | Ubuddy School Management System`,
    40,
    60,
  );

  autoTable(doc, {
    startY: 80,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 6, overflow: 'linebreak', textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 80, left: 40, right: 40, bottom: 40 },
  });

  doc.save(`staff-export-${new Date().getTime()}.pdf`);
}

export function openPrintView(data: Staff[], fields: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window.open('', '_blank');
    if (!win) { reject(new Error('Popup blocked. Please allow popups for export.')); return; }

    const tableRows = data.map((s, i) =>
      `<tr>${[i + 1, ...fields.map((f) => formatExportValue(f, s[f as keyof Staff]))].map((c) => `<td>${c}</td>`).join('')}</tr>`
    ).join('');
    const headers = ['S. No.', ...fields.map(toHeaderLabel)].map((h) => `<th>${h}</th>`).join('');

    win.document.write(`<html><head><title>Staff Export</title><style>
      body{font-family:Arial,sans-serif;margin:16px;color:#0f172a}
      h2{margin:0 0 10px 0;font-size:18px}
      .meta{margin-bottom:10px;font-size:12px;color:#475569}
      table{border-collapse:collapse;width:100%}
      th,td{border:1px solid #e2e8f0;padding:6px;font-size:11px;vertical-align:top}
      th{background:#f8fafc;text-align:left;font-weight:700;white-space:nowrap}
      @media print{thead{display:table-header-group}tr{page-break-inside:avoid}@page{size:A4 landscape;margin:10mm}body{margin:0}}
    </style></head><body>
      <h2>Staff Export</h2>
      <div class="meta">Generated on ${new Date().toLocaleString()} | Rows: ${data.length}</div>
      <table><thead><tr>${headers}</tr></thead><tbody>${tableRows}</tbody></table>
    </body></html>`);
    win.document.close();

    let printed = false;
    const printNow = () => {
      if (printed) return;
      printed = true;
      try { win.focus(); win.print(); resolve(); }
      catch (err) { reject(err instanceof Error ? err : new Error('Failed to open print preview')); }
    };
    win.onload = () => setTimeout(printNow, 120);
    setTimeout(printNow, 600);
  });
}
