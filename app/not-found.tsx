'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function NotFound() {
  return (
    <main className='flex flex-1 min-h-screen min-h-dvh w-full flex-col items-center justify-center p-4'>
      <ErrorState variant='not-found' />
    </main>
  );
}

