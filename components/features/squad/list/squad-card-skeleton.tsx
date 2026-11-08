import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SquadCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      size='sm'
      className={cn('rounded-2xl border border-border ring-0 shadow-2xs', className)}
    >
      <CardContent className='flex flex-col gap-3 p-4'>
        {/* Top: Name & Avatars */}
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 flex flex-col gap-1.5'>
            <Skeleton className='h-4 w-32 rounded' />
            <Skeleton className='h-3 w-16 rounded' />
          </div>

          <div className='flex -space-x-2'>
            <Skeleton className='size-7 rounded-full border-2 border-card' />
            <Skeleton className='size-7 rounded-full border-2 border-card' />
            <Skeleton className='size-7 rounded-full border-2 border-card' />
          </div>
        </div>

        {/* Progress Bar Shimmer */}
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-3 w-12 rounded' />
            <Skeleton className='h-3 w-8 rounded' />
          </div>
          <Skeleton className='h-2 w-full rounded-full' />
        </div>

        {/* Bottom: Date & Edit Button */}
        <div className='flex items-center justify-between gap-2 pt-1'>
          <div className='flex items-center gap-1.5'>
            <Skeleton className='size-3.5 rounded' />
            <Skeleton className='h-3 w-24 rounded' />
          </div>
          <Skeleton className='h-7 w-20 rounded-md' />
        </div>
      </CardContent>
    </Card>
  );
}

