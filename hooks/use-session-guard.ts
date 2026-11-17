'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { isAxiosError } from 'axios';
import { api } from '@/lib/axios';
import { logoutUser } from '@/lib/auth-helpers';

const SESSION_POLL_INTERVAL_MS = 30_000;

interface AuthMeResponse {
  success?: boolean;
  data?: {
    id_user?: string;
    is_active?: boolean;
  };
}

export function useSessionGuard() {
  const { status } = useSession();
  const isCheckingRef = React.useRef(false);
  const isLoggingOutRef = React.useRef(false);

  const triggerLogout = React.useCallback(async () => {
    if (typeof window === 'undefined' || window.location.pathname.startsWith('/login')) {
      return;
    }
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    try {
      await logoutUser();
    } finally {
      isLoggingOutRef.current = false;
    }
  }, []);

  const verifySession = React.useCallback(async () => {
    if (status !== 'authenticated') return;
    if (typeof window === 'undefined' || window.location.pathname.startsWith('/login')) return;
    if (isCheckingRef.current || isLoggingOutRef.current) return;

    isCheckingRef.current = true;
    try {
      const response = await api.get<AuthMeResponse>('/auth/me');
      const user = response.data?.data;
      if (!user?.id_user || user.is_active === false) {
        await triggerLogout();
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        await triggerLogout();
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [status, triggerLogout]);

  React.useEffect(() => {
    if (status !== 'authenticated') return;

    const handleFocus = () => {
      void verifySession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void verifySession();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void verifySession();
      }
    }, SESSION_POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [status, verifySession]);
}
