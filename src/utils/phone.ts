/** Format raw digits to XXX-XXX-XXXX, max 10 digits */
export function formatPhone(val: string): string {
  const d = val.replace(/\D/g, '').slice(0, 10);
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
}

/** Strip formatting, return raw digits */
export function rawPhone(val: string): string {
  return val.replace(/\D/g, '');
}

/** True if value is a valid 10-digit phone (with or without hyphens) */
export function isValidPhone(val: string): boolean {
  return rawPhone(val).length === 10;
}
