import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/ui/responsive-modal';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

/** Modal konfirmasi aksi berisiko (batal/hapus): tombol kembali + tombol konfirmasi merah. */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Kembali',
  confirmLabel,
  onConfirm,
  isLoading,
}: ConfirmModalProps) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={title}>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive'>
          <AlertTriangle className='size-6' />
        </div>
        <p className='text-xs text-muted-foreground'>{description}</p>
        <div className='grid w-full grid-cols-2 gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='h-10 rounded-md text-xs font-semibold cursor-pointer'
          >
            {cancelLabel}
          </Button>
          <Button
            type='button'
            disabled={isLoading}
            onClick={onConfirm}
            className='h-10 rounded-md bg-destructive text-xs font-semibold text-white hover:bg-destructive/90 cursor-pointer'
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
