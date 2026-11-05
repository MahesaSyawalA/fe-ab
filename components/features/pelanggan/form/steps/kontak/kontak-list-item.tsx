import { Trash2, UserRound } from 'lucide-react';
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
            <UserRound className='size-4' />
          </AvatarFallback>
        </Avatar>
        <div className='flex min-w-0 flex-1 flex-col'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-xs font-semibold text-foreground truncate'>
              {contact.nama}
            </span>
          </div>
          {contact.jabatan && (
            <span className='text-[11px] text-secondary-foreground truncate'>
              {contact.jabatan}
            </span>
          )}
          <span className='text-[11px] text-secondary-foreground leading-snug'>
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
