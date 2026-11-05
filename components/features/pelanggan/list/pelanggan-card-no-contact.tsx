import * as React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertTitle,
  AlertAction,
} from '@/components/ui/alert';

interface PelangganCardNoContactProps {
  onAddContact?: (e: React.MouseEvent) => void;
}

/** Peringatan "Belum ada kontak" beserta tombol tambah kontak. */
export function PelangganCardNoContact({ onAddContact }: PelangganCardNoContactProps) {
  return (
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
  );
}
