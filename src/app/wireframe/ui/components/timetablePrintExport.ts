/**
 * Utility helpers for timetable print / export actions.
 * No external dependencies – uses browser-native APIs only.
 */

export interface TimetableDetail {
  id: number;
  date: string;
  subjects: string[];
}

export interface TimetableData {
  className: string;
  term: string;
  session: string;
  details: TimetableDetail[];
}

// ---------------------------------------------------------------------------
// Print / PDF  (browser "Save as PDF" covers the PDF case)
// ---------------------------------------------------------------------------

export function printTimetable(data: TimetableData): void {
  const rows = data.details
    .map(
      (row, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.date}</td>
          <td>${row.subjects.join(', ')}</td>
        </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Time Table – ${data.className} – ${data.term}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
        h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
        .meta { font-size: 12px; color: #64748b; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #0f172a; color: #fff; padding: 10px 14px; text-align: left; font-weight: 700; }
        td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) td { background: #f8fafc; }
        @media print { body { padding: 16px; } }
      </style>
    </head>
    <body>
      <h1>Time Table Details</h1>
      <p class="meta">Session: ${data.session} &nbsp;|&nbsp; Term: ${data.term} &nbsp;|&nbsp; Class: ${data.className}</p>
      <table>
        <thead>
          <tr><th>S. No.</th><th>Exam Date</th><th>Subjects</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

// ---------------------------------------------------------------------------
// CSV / Excel download
// ---------------------------------------------------------------------------

export function exportTimetableCSV(data: TimetableData): void {
  const header = ['S. No.', 'Exam Date', 'Subjects'];
  const csvRows = [
    [`Time Table – ${data.className} – ${data.term} – Session ${data.session}`],
    [],
    header,
    ...data.details.map((row, idx) => [
      String(idx + 1),
      row.date,
      row.subjects.join('; '),
    ]),
  ];

  const csv = csvRows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `timetable_${data.className}_${data.term}.csv`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Full-view (table view) helpers
// ---------------------------------------------------------------------------

export interface FullViewRow {
  date: string;
  day: string;
  schedule: Record<string, string>; // class → subjects
}

export function printFullTimetable(
  rows: FullViewRow[],
  classes: string[],
  title = 'Exam Schedule Overview'
): void {
  const headerCells = ['Date', 'Day', ...classes]
    .map((c) => `<th>${c}</th>`)
    .join('');

  const bodyRows = rows
    .map(
      (r) => `
      <tr>
        <td>${r.date}</td>
        <td>${r.day}</td>
        ${classes.map((c) => `<td>${r.schedule[c] || '–'}</td>`).join('')}
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
        h1 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #0f172a; color: #fff; padding: 8px 12px; text-align: left; font-weight: 700; }
        td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; }
        td:first-child, td:nth-child(2) { text-align: left; }
        tr:nth-child(even) td { background: #f8fafc; }
        @media print { body { padding: 16px; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </body>
    </html>`;

  const win = window.open('', '_blank', 'width=1100,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function exportFullTimetableCSV(
  rows: FullViewRow[],
  classes: string[],
  title = 'Exam Schedule Overview'
): void {
  const header = ['Date', 'Day', ...classes];
  const csvRows = [
    [title],
    [],
    header,
    ...rows.map((r) => [r.date, r.day, ...classes.map((c) => r.schedule[c] || '')]),
  ];

  const csv = csvRows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exam_schedule.csv';
  a.click();
  URL.revokeObjectURL(url);
}
