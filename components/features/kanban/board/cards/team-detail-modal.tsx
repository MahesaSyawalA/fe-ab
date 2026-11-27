import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { cn } from '@/lib/utils';
import { TeamContributionItem } from '@/types/ticket.types';

interface TeamDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  squadLabel?: string;
  members: TeamContributionItem[];
  totalTickets: number;
  totalEstimasiLabel: string;
  totalRevenueLabel: string;
}

// Mobile: nama di baris sendiri, angka berlabel di bawahnya. Desktop: satu baris tabel.
const ROW =
  'grid grid-cols-4 sm:grid-cols-[minmax(0,1fr)_3rem_4rem_6rem_6rem] gap-x-2 gap-y-1 py-2.5 text-xs sm:text-sm';
const NAME = 'col-span-4 sm:col-span-1 truncate font-semibold text-foreground';
const REVENUE = 'font-bold text-emerald-700 dark:text-emerald-400';

function Cell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn('sm:text-right', className)}>
      <span className='block sm:sr-only text-[11px] font-normal text-muted-foreground'>
        {label}
      </span>
      {children}
    </span>
  );
}

export function TeamDetailModal({
  open,
  onOpenChange,
  squadLabel,
  members,
  totalTickets,
  totalEstimasiLabel,
  totalRevenueLabel,
}: TeamDetailModalProps) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title='Rincian Kontribusi Tim'
      description={`${squadLabel ? `${squadLabel} · ` : ''}mengikuti filter kanban`}
      className='max-w-2xl'
    >
      <div className='mt-2 text-foreground'>
        <div
          aria-hidden
          className={cn(ROW, 'hidden sm:grid border-b border-border font-medium text-muted-foreground')}
        >
          <span>Nama</span>
          <span className='text-right'>Tiket</span>
          <span className='text-right'>Closing</span>
          <span className='text-right'>Estimasi</span>
          <span className='text-right'>Revenue</span>
        </div>
        <ul className='max-h-[55dvh] overflow-y-auto divide-y divide-border/60'>
          {members.map((m) => (
            <li key={m.id} className={ROW}>
              <span className={NAME}>{m.name}</span>
              <Cell label='Tiket'>{m.ticketCount}</Cell>
              <Cell label='Closing'>{m.closingRate}%</Cell>
              <Cell label='Estimasi'>{m.valueLabel}</Cell>
              <Cell label='Revenue' className={REVENUE}>
                {m.revenueLabel ?? 'Rp0'}
              </Cell>
            </li>
          ))}
        </ul>
        <div className={cn(ROW, 'border-t border-border font-bold')}>
          <span className={NAME}>Total</span>
          <Cell label='Tiket'>{totalTickets}</Cell>
          <span />
          <Cell label='Estimasi'>{totalEstimasiLabel}</Cell>
          <Cell label='Revenue' className={REVENUE}>
            {totalRevenueLabel}
          </Cell>
        </div>
      </div>
    </ResponsiveModal>
  );
}
