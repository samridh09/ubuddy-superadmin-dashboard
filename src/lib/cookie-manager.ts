const COOKIE_OPTIONS = 'path=/; SameSite=Strict; max-age=604800'; // 7 days

export const cookieManager = {
  set(name: string, value: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${COOKIE_OPTIONS}`;
  },

  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },

  remove(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

export const SUPER_ADMIN_COOKIE_KEYS = {
  access: 'sa_access_token',
  refresh: 'sa_refresh_token',
};

export const SCHOOL_ADMIN_COOKIE_KEYS = {
  access: 'sca_access_token',
  refresh: 'sca_refresh_token',
};
