import { Skeleton } from '@/components/ui/skeleton';

export function PelangganDetailSkeleton() {
  return (
    <div className='mx-auto flex min-h-svh md:min-h-0 w-full max-w-xl md:max-w-6xl lg:max-w-7xl min-w-0 flex-col gap-6 bg-background pb-12'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between py-2'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-48 rounded-lg' />
          <Skeleton className='h-4 w-72 rounded-lg' />
        </div>
        <Skeleton className='h-9 w-24 rounded-xl' />
      </div>

      {/* Hero Banner Skeleton */}
      <Skeleton className='h-52 md:h-64 lg:h-72 w-full rounded-3xl' />

      {/* Stats Band Skeleton */}
      <Skeleton className='h-20 w-full rounded-2xl' />

      {/* 2-Column Content Skeleton */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 pt-2 items-start'>
        <div className='lg:col-span-7 flex flex-col gap-4'>
          <Skeleton className='h-80 w-full rounded-2xl' />
        </div>
        <div className='lg:col-span-5 flex flex-col gap-4'>
          <Skeleton className='h-64 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}

