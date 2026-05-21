'use client';

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

import { forceLogout } from '@/lib/api-client';

/**
 * Custom hook for monitoring user inactivity.
 * STRICT mode: Logs out after 10 minutes of inactivity.
 */

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const WARNING_TIMEOUT = 9 * 60 * 1000;     // 9 minutes
const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
  'focus',
  'visibilitychange',
];

export const useInactivityTimer = (isEnabled: boolean) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const hasWarnedRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (!isEnabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      if (!hasWarnedRef.current) {
        toast.warning('Your session will expire in 1 minute due to inactivity.', {
          autoClose: 5000,
          position: 'top-center',
        });
        hasWarnedRef.current = true;
      }
    }, WARNING_TIMEOUT);

    timerRef.current = setTimeout(() => {
      forceLogout('Session expired due to inactivity');
    }, INACTIVITY_TIMEOUT);

    hasWarnedRef.current = false;
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      return;
    }

    resetTimer();

    const handleActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isEnabled, resetTimer]);

  return { resetTimer };
};
