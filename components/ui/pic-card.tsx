import * as React from 'react';
import { Phone, Mail, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PicCardProps {
  nama: string;
  jabatan: string;
  noTelp: string;
  email?: string;
  kategoriPeran?: string | null;
  inisial?: string | null;
  className?: string;
}

function getInitials(name: string, customInitials?: string | null): string {
  if (customInitials) return customInitials;
  const cleaned = name
    .replace(/^(dr\.|drs\.|prof\.|ir\.|h\.|hj\.)\s*/i, '')
    .split(',')[0]
    .trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase() || 'PIC';
}

export function PicCard({
  nama,
  jabatan,
  noTelp,
  email,
  kategoriPeran = 'KOL / Penentu Klinis',
  inisial,
  className,
}: PicCardProps) {
  const displayInitials = getInitials(nama, inisial);
  const cleanPhone = noTelp.replace(/[^0-9]/g, '');

  return (
    <Card
      size='sm'
      className={cn(
        'w-full min-w-0 rounded-2xl border border-border ring-0 py-4 shadow-2xs',
        className
      )}
    >
      <CardContent className='gap-3 px-4'>
        {/* Top Info: Avatar + Name + Badge + Position */}
        <div className='flex items-start gap-3'>
          <Avatar
            size='lg'
            className='rounded-xl after:rounded-xl after:border-0'
          >
            <AvatarFallback className='rounded-xl bg-kanban-purple text-xs font-semibold text-white'>
              {displayInitials}
            </AvatarFallback>
          </Avatar>

          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <h4 className='text-xs sm:text-sm font-bold text-foreground leading-snug'>
              {nama}
            </h4>

            {kategoriPeran && (
              <Badge className='h-5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary'>
                {kategoriPeran}
              </Badge>
            )}

            {jabatan && (
              <p className='mt-0.5 text-xs text-secondary-foreground leading-relaxed'>
                {jabatan}
              </p>
            )}
          </div>
        </div>

        {/* Middle Contact Details Box */}
        <div className='flex flex-col gap-2 rounded-xl bg-secondary/60 p-3'>
          {noTelp && (
            <div className='flex items-center gap-2.5 text-xs font-medium text-foreground/85'>
              <Phone className='size-3.5 shrink-0 text-secondary-foreground' />
              <span className='truncate'>{noTelp}</span>
            </div>
          )}
          {email && (
            <div className='flex items-center gap-2.5 text-xs text-secondary-foreground'>
              <Mail className='size-3.5 shrink-0 text-secondary-foreground' />
              <span className='truncate'>{email}</span>
            </div>
          )}
        </div>

        {/* Bottom 3 Action Buttons: Telepon, WhatsApp, Email */}
        <div className='grid grid-cols-3 gap-2'>
          <Button
            variant='ghost'
            size='sm'
            nativeButton={false}
            className='h-9 w-full gap-1.5 rounded-lg bg-blue-50/90 hover:bg-blue-100/80 text-xs font-semibold text-primary hover:text-primary'
            render={<a href={noTelp ? `tel:${noTelp}` : '#'} />}
          >
            <Phone className='size-3.5 shrink-0' />
            <span className='truncate'>Telepon</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            nativeButton={false}
            className='h-9 w-full gap-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-xs font-semibold text-emerald-700 hover:text-emerald-700'
            render={
              <a
                href={cleanPhone ? `https://wa.me/${cleanPhone}` : '#'}
                target='_blank'
                rel='noreferrer'
              />
            }
          >
            <MessageSquareText className='size-3.5 shrink-0' />
            <span className='truncate'>WhatsApp</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            nativeButton={false}
            className='h-9 w-full gap-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-xs font-semibold text-amber-500 hover:text-amber-500'
            render={<a href={email ? `mailto:${email}` : '#'} />}
          >
            <Mail className='size-3.5 shrink-0' />
            <span className='truncate'>Email</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
