import * as React from 'react';
import { PelangganWithDetails } from '@/types/customer.types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PelangganCardContact } from './pelanggan-card-contact';
import { PelangganCardNoContact } from './pelanggan-card-no-contact';

interface PelangganCardProps {
  pelanggan: PelangganWithDetails;
  onClick?: () => void;
  onAddContact?: (e: React.MouseEvent) => void;
  className?: string;
}

export function PelangganCard({
  pelanggan,
  onClick,
  onAddContact,
  className,
}: PelangganCardProps) {
  const primaryContact = pelanggan.kontak_list?.[0];
  const ticketCount = pelanggan.tiket_aktif ?? 0;

  return (
    <Card
      size='sm'
      onClick={onClick}
      className={cn(
        'group w-full min-w-0 rounded-2xl border border-border ring-0 py-3.5 shadow-2xs transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer',
        className
      )}
    >
      <CardContent className='gap-2.5 px-3.5'>

        <div className='flex items-center justify-between gap-2'>
          <div className='flex min-w-0 items-center gap-2'>
            <Badge className='h-5 rounded-md bg-primary-default px-2 py-0.5 text-[11px] font-medium text-white'>
              {pelanggan.tipe_outlet}
            </Badge>
            {pelanggan.jarak_km && (
              <span className='text-xs text-secondary-foreground truncate'>
                {pelanggan.jarak_km}
              </span>
            )}
          </div>

          <Badge
            className={cn(
              'h-5 shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium text-white',
              ticketCount > 0 ? 'bg-kanban-green' : 'bg-slate-400'
            )}
          >
            {ticketCount} tiket
          </Badge>
        </div>

        <h3 className='text-sm sm:text-base font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors'>
          {pelanggan.nama_outlet}
        </h3>

        {primaryContact ? (
          <PelangganCardContact contact={primaryContact} />
        ) : (
          <PelangganCardNoContact onAddContact={onAddContact} />
        )}
      </CardContent>
    </Card>
  );
}
