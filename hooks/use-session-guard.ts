'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { isAxiosError } from 'axios';
import { toast } from '@heroui/react';
import { api } from '@/lib/axios';
import { logoutUser } from '@/lib/auth-helpers';

const SESSION_POLL_INTERVAL_MS = 30_000;
const MUST_CHANGE_TOAST_PREFIX = 'must-change-pwd-notified:';

interface AuthMeResponse {
  success?: boolean;
  data?: {
    id_user?: string;
    is_active?: boolean;
    must_change_password?: boolean;
  };
}

function getMustChangeStorageKey(userId?: string): string {
  if (!userId) return '';
  return `${MUST_CHANGE_TOAST_PREFIX}${userId}`;
}

function clearMustChangeStorageKeys() {
  if (typeof window === 'undefined') return;
  try {
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith(MUST_CHANGE_TOAST_PREFIX)) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch {
    return;
  }
}

export function useSessionGuard() {
  const { data: session, status } = useSession();
  const isCheckingRef = React.useRef(false);
  const isLoggingOutRef = React.useRef(false);
  const hasNotifiedMustChangeRef = React.useRef(false);
  const [mustChangeFromServer, setMustChangeFromServer] = React.useState(false);

  const userId = session?.user?.id_user || session?.user?.id || '';
  const sessionKey = getMustChangeStorageKey(userId);
  const shouldNotifyMustChange = Boolean(
    session?.user?.must_change_password || mustChangeFromServer,
  );

  React.useEffect(() => {
    if (status !== 'authenticated' || !shouldNotifyMustChange || !sessionKey) return;
    if (hasNotifiedMustChangeRef.current) return;

    try {
      if (window.sessionStorage.getItem(sessionKey) === '1') {
        hasNotifiedMustChangeRef.current = true;
        return;
      }
    } catch {
      return;
    }

    const timerId = window.setTimeout(() => {
      if (hasNotifiedMustChangeRef.current) return;
      hasNotifiedMustChangeRef.current = true;
      try {
        window.sessionStorage.setItem(sessionKey, '1');
      } catch {}
      toast.warning('Segera Ganti Password Sementara', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Akun Anda masih menggunakan password sementara. Segera ganti password di halaman Pengaturan.',
        ),
      });
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [status, shouldNotifyMustChange, sessionKey]);

  const triggerLogout = React.useCallback(async () => {
    if (typeof window === 'undefined' || window.location.pathname.startsWith('/login')) {
      return;
    }
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    clearMustChangeStorageKeys();
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
      } else {
        setMustChangeFromServer(Boolean(user.must_change_password));
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

    const initialTimerId = window.setTimeout(() => {
      void verifySession();
    }, 0);

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
      window.clearTimeout(initialTimerId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [status, verifySession]);
}
