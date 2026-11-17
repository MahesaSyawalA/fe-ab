'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { toast } from '@heroui/react';
import { isAxiosError } from 'axios';
import { getErrorMessage } from '@/lib/axios';

function showRequestErrorToast(error: Error, fallbackMessage: string) {
  if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    return;
  }

  const isNetworkError = !isAxiosError(error) || !error.response;
  const title = isNetworkError ? 'Terjadi Kesalahan Jaringan' : 'Gagal Memproses Permintaan';
  const message = getErrorMessage(error) || fallbackMessage;

  toast.danger(title, {
    description: (
      <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
        {message}
      </span>
    ),
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const meta = query.meta as { suppressToast?: boolean } | undefined;
            if (meta?.suppressToast) return;
            showRequestErrorToast(error, 'Gagal memproses data dari server');
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            const meta = mutation.meta as { suppressToast?: boolean } | undefined;
            if (meta?.suppressToast) return;
            showRequestErrorToast(error, 'Gagal memproses data dari server');
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
