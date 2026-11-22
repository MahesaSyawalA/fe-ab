import { ChevronRight, Phone, UserRound } from 'lucide-react';
import { Kontak } from '@/types/contact.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { sanitizePhoneHref } from '@/lib/utils';

export function PelangganCardContact({ contact }: { contact: Kontak }) {
  return (
    <div className='flex items-center justify-between gap-2.5 rounded-xl bg-[#F6F8FD] p-2.5'>
      <div className='flex min-w-0 flex-1 items-center gap-2.5'>
        <Avatar className='after:border-0'>
          <AvatarFallback className='bg-blue-100/80 text-slate-800'>
            <UserRound className='size-4' />
          </AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-1 flex-col'>
          <span className='text-xs font-bold text-foreground truncate'>
            {contact.nama}
          </span>
          <span className='text-[11px] text-secondary-foreground line-clamp-2 leading-tight mt-0.5'>
            {contact.jabatan || 'Penanggung Jawab'}
          </span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1.5 pl-1'>
        {contact.no_telp && (
          <Button
            variant='ghost'
            size='icon-xs'
            nativeButton={false}
            onClick={(e) => e.stopPropagation()}
            className='text-primary hover:bg-primary/10 hover:text-primary'
            title='Hubungi PIC'
            render={<a href={sanitizePhoneHref(contact.no_telp) || '#'} />}
          >
            <Phone className='size-3.5' />
          </Button>
        )}
        <ChevronRight className='size-4 text-foreground/70 group-hover:translate-x-0.5 transition-transform' />
      </div>
    </div>
  );
}
