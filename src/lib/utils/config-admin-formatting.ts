import { ConfigAdminStatus } from '@/types';

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    let h = d.getHours();
    const min = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${dd}/${mm}/${yyyy} ${h}:${min}${ampm}`;
  } catch {
    return '—';
  }
};

export const mapStatus = (s: string): ConfigAdminStatus => {
  if (s === 'ACTIVE') return 'Active';
  if (s === 'INACTIVE') return 'Inactive';
  if (s === 'TERMINATED') return 'Terminated';
  return 'Inactive';
};
