import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PelangganCardSkeleton() {
  return (
    <Card size='sm' className='w-full min-w-0 rounded-2xl border border-border py-3.5 shadow-2xs'>
      <CardContent className='gap-2.5 px-3.5'>
        {/* Top Meta */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-20 rounded-md' />
            <Skeleton className='h-4 w-12 rounded' />
          </div>
          <Skeleton className='h-5 w-14 rounded-md' />
        </div>

        {/* Outlet Name */}
        <Skeleton className='h-5 w-3/4 rounded mt-1' />

        {/* PIC Contact Skeleton */}
        <div className='flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5'>
          <Skeleton className='size-8 rounded-full shrink-0' />
          <div className='flex flex-1 flex-col gap-1.5'>
            <Skeleton className='h-3.5 w-1/2 rounded' />
            <Skeleton className='h-3 w-1/3 rounded' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

