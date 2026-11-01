'use client';

import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { TambahKolomForm } from './tambah-kolom-form';

interface TambahKolomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TambahKolomDialog({ open, onOpenChange }: TambahKolomDialogProps) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title='Tambah Kolom Board Baru'
      description='Atur nama kolom dan tipe tahap kanban sesuai alur CRM'
    >
      <TambahKolomForm onClose={() => onOpenChange(false)} />
    </ResponsiveModal>
  );
}
