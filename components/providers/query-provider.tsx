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

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const meta = query.meta as { suppressToast?: boolean } | undefined;
            if (meta?.suppressToast) return;

            if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
              return;
            }

            toast.danger('Terjadi Kesalahan Jaringan', {
              description: (
                <span className='text-xs text-secondary-foreground'>
                  {error.message || 'Gagal memproses data dari server'}
                </span>
              ),
            });
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            const meta = mutation.meta as { suppressToast?: boolean } | undefined;
            if (meta?.suppressToast) return;

            if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
              return;
            }

            toast.danger('Terjadi Kesalahan Jaringan', {
              description: (
                <span className='text-xs text-secondary-foreground'>
                  {error.message || 'Gagal memproses data dari server'}
                </span>
              ),
            });
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
