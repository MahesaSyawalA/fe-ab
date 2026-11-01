import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProspekFormBannerProps {
  errorCount: number;
  mode: 'create' | 'edit';
}

/** Banner error validasi; di mode create tanpa error menampilkan info status tiket baru. */
export function ProspekFormBanner({ errorCount, mode }: ProspekFormBannerProps) {
  if (errorCount > 0) {
    return (
      <Alert className='flex items-start gap-2.5 rounded-xl border-destructive/30 bg-destructive/8 px-3.5 py-3 text-destructive'>
        <AlertTriangle className='mt-0.5 size-4 shrink-0 text-destructive' />
        <AlertDescription className='text-xs font-medium text-destructive'>
          Ada {errorCount} isian yang perlu diperbaiki sebelum tiket disimpan.
        </AlertDescription>
      </Alert>
    );
  }

  if (mode !== 'create') return null;

  return (
    <Alert className='flex items-start gap-2.5 rounded-xl border-primary/20 bg-primary/8 px-3.5 py-3 text-primary'>
      <Info className='mt-0.5 size-4 shrink-0 text-primary' />
      <AlertDescription className='text-xs font-medium text-primary'>
        Tiket baru otomatis berstatus OPEN dan masuk ke tahap Prospek.
      </AlertDescription>
    </Alert>
  );
}
