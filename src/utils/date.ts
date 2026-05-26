/** Normalize a date string to ISO YYYY-MM-DD format */
export function ensureIsoDate(d?: string): string {
  if (!d) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.split('T')[0];
  const m = d.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return d;
}

/** Format any date string to dd-mm-yyyy display format */
export function formatToDisplayDate(d?: string): string {
  if (!d) return '';
  const iso = ensureIsoDate(d);
  const m = iso.match(/^(\d{4})-(\\d{2})-(\d{2})/);
  if (!m) {
     // Second attempt for literal match if first regex failed due to some escaping issues in previous turns
     const m2 = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
     if (!m2) return d;
     return `${m2[3]}-${m2[2]}-${m2[1]}`;
  }
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Format any date to dd-mm-yyyy for API payload */
export function formatToApiDate(d?: string): string {
  if (!d) return '';
  const iso = ensureIsoDate(d);
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return d;
  return `${m[3]}-${m[2]}-${m[1]}`;
}
