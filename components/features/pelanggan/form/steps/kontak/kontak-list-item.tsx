import { Trash2, CircleUser } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { KontakInputItem } from '../../types';

interface KontakListItemProps {
  contact: KontakInputItem;
  onRemove: () => void;
}

export function KontakListItem({ contact, onRemove }: KontakListItemProps) {
  return (
    <div className='flex items-center justify-between gap-2.5 rounded-xl border border-primary/40 bg-[#F5F8FF] p-3'>
      <div className='flex min-w-0 flex-1 items-center gap-2.5'>
        <Avatar className='after:border-primary/30 shrink-0'>
          <AvatarFallback className='bg-primary/10 text-primary'>
            <CircleUser className='size-4 ' />
          </AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-1 flex-col'>
          <div className='flex items-baseline gap-1.5 min-w-0 flex-wrap justify-between'>
            <span className='text-xs font-bold text-secondary-foreground truncate'>
              {contact.nama}
            </span>
            {contact.jabatan && (
              <span className='text-[11px] text-secondary-foreground truncate'>
                ({contact.jabatan})
              </span>
            )}
          </div>
          <span className='text-[11px] text-secondary-foreground leading-snug mt-0.5'>
            {contact.no_telp}
          </span>
          {contact.email && (
            <span className='text-[11px] text-secondary-foreground truncate leading-snug'>
              {contact.email}
            </span>
          )}
        </div>
      </div>

      <Button
        type='button'
        variant='ghost'
        size='icon-xs'
        onClick={onRemove}
        className='text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer'
        title='Hapus kontak'
      >
        <Trash2 className='size-4' />
      </Button>
    </div>
  );
}
