'use client';

import * as React from 'react';
import { ErrorState } from '@/components/ui/error-state';

export default function DirectorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Director Route Error:', error);
  }, [error]);

  return (
    <div className='flex flex-1 min-h-[calc(100vh-140px)] min-h-[calc(100dvh-140px)] w-full items-center justify-center p-4 my-auto'>
      <ErrorState
        variant='error'
        imageSrc='/assets/images/illustrations/ab-medical-error-boundary-role.png'
        onReset={reset}
      />
    </div>
  );
}

