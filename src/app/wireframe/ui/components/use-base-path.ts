'use client';

import { usePathname } from 'next/navigation';

export function useBasePath(): string {
  const pathname = usePathname();
  return pathname.startsWith('/wireframes/ui') ? '/wireframes/ui' : '/super-admin';
}
