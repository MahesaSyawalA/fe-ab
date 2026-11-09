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

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const meta = query.meta as { suppressToast?: boolean } | undefined;
            if (meta?.suppressToast) return;

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
