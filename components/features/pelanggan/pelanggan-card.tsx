import * as React from 'react';
import { PelangganWithDetails } from '@/types/customer.types';
import { cn } from '@/lib/utils';
import { Phone, ChevronRight, AlertTriangle, Plus, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from '@/components/ui/alert';

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
  const hasContact = Boolean(primaryContact);
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
        {/* Top Meta: Type Badge, Distance, Ticket Badge */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex min-w-0 items-center gap-2'>
            <Badge className='h-5 rounded-md bg-primary-default px-2 py-0.5 text-[11px] font-medium text-white'>
              {pelanggan.tipe_faskes}
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

        {/* Outlet Name */}
        <h3 className='text-sm sm:text-base font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors'>
          {pelanggan.nama_faskes}
        </h3>

        {/* PIC Sub-Card or Empty Contact Warning */}
        {hasContact && primaryContact ? (
          <div className='flex items-center justify-between gap-2.5 rounded-xl bg-[#F6F8FD] p-2.5'>
            <div className='flex min-w-0 flex-1 items-center gap-2.5'>
              <Avatar className='after:border-0'>
                <AvatarFallback className='bg-blue-100/80 text-slate-800'>
                  <UserRound className='size-4' />
                </AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-xs font-bold text-foreground truncate'>
                  {primaryContact.nama}
                </span>
                <span className='text-[11px] text-secondary-foreground line-clamp-2 leading-tight mt-0.5'>
                  {primaryContact.jabatan || 'Penanggung Jawab'}
                </span>
              </div>
            </div>

            <div className='flex shrink-0 items-center gap-1.5 pl-1'>
              {primaryContact.no_telp && (
                <Button
                  variant='ghost'
                  size='icon-xs'
                  onClick={(e) => e.stopPropagation()}
                  className='text-primary hover:bg-primary/10 hover:text-primary'
                  title='Hubungi PIC'
                  render={<a href={`tel:${primaryContact.no_telp}`} />}
                >
                  <Phone className='size-3.5' />
                </Button>
              )}
              <ChevronRight className='size-4 text-foreground/70 group-hover:translate-x-0.5 transition-transform' />
            </div>
          </div>
        ) : (
          <Alert className='flex items-center justify-between gap-2.5 rounded-xl border-0 bg-amber-50/50 p-2.5 has-data-[slot=alert-action]:pr-2.5'>
            <div className='flex min-w-0 flex-1 items-center gap-2.5'>
              <Avatar className='after:border-0'>
                <AvatarFallback className='bg-amber-100/80 text-amber-500'>
                  <AlertTriangle className='size-4' />
                </AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-1 flex-col'>
                <AlertTitle className='text-xs font-semibold text-amber-500 leading-tight'>
                  Belum ada kontak
                </AlertTitle>
                <AlertDescription className='text-[11px] text-secondary-foreground leading-tight mt-0.5'>
                  Tambahkan APA / Tenaga Teknis
                </AlertDescription>
              </div>
            </div>

            <AlertAction className='static top-auto right-auto shrink-0'>
              <Button
                type='button'
                variant='outline'
                size='xs'
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContact?.(e);
                }}
                className='h-7 gap-1 rounded-xl border-border bg-white px-3 text-[11px] font-medium text-amber-500 shadow-xs hover:bg-amber-50 hover:text-amber-600 cursor-pointer'
              >
                <Plus className='size-3' />
                Kontak
              </Button>
            </AlertAction>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
