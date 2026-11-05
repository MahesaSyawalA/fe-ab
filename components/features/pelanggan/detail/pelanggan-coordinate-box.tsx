import { Crosshair } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PelangganCoordinateBoxProps {
  latitude: number;
  longitude: number;
  radius: number;
}

export function PelangganCoordinateBox({
  latitude,
  longitude,
  radius,
}: PelangganCoordinateBoxProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-[#F8FAFC] p-3.5'>
      <div className='flex items-center gap-3 min-w-0'>
        <Avatar className='rounded-lg after:rounded-lg after:border-0 shrink-0'>
          <AvatarFallback className='rounded-lg bg-accent/10 text-accent'>
            <Crosshair className='size-4' />
          </AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-col'>
          <span className='text-xs font-bold text-foreground leading-tight'>
            Titik koordinat GPS
          </span>
          <span className='mt-0.5 truncate font-mono text-[11px] sm:text-xs text-secondary-foreground'>
            Lat: {latitude.toFixed(6)} &nbsp;|&nbsp; Long: {longitude.toFixed(6)}
          </span>
        </div>
      </div>

      <div className='text-left sm:text-right text-[11px] text-muted-foreground border-t sm:border-t-0 pt-2 sm:pt-0'>
        Radius Check-in:{' '}
        <span className='font-semibold text-foreground'>{radius} m</span>
      </div>
    </div>
  );
}
