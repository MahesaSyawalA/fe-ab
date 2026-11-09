'use client';

import * as React from 'react';
import { ErrorState } from '@/components/ui/error-state';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Root App Error:', error);
  }, [error]);

  return (
    <main className='flex flex-1 min-h-screen min-h-dvh w-full flex-col items-center justify-center p-4'>
      <ErrorState variant='error' onReset={reset} />
    </main>
  );
}

