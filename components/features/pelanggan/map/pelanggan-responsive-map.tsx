import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PelangganMap } from './pelanggan-map';
import { PelangganMapProps } from './pelanggan-map-inner';

interface MapVariant {
  interactive: boolean;
  height: string;
}

interface PelangganResponsiveMapProps
  extends Omit<PelangganMapProps, 'interactive' | 'height'> {
  mobile: MapVariant;
  desktop: MapVariant;

  badgeClassName?: string;
}

export function PelangganResponsiveMap({
  mobile,
  desktop,
  badgeClassName,
  ...mapProps
}: PelangganResponsiveMapProps) {
  return (
    <div className='relative w-full overflow-hidden rounded-xl border border-border/80'>
      <div className='block md:hidden'>
        <PelangganMap {...mapProps} {...mobile} />
      </div>
      <div className='hidden md:block'>
        <PelangganMap {...mapProps} {...desktop} />
      </div>
      <Badge
        className={cn(
          'absolute z-10 rounded-md bg-kanban-green py-0.5 font-semibold text-white shadow-xs',
          badgeClassName,
        )}
      >
        GPS Siap
      </Badge>
    </div>
  );
}
