import { Button } from '@/components/ui/button';

export function ProspekFormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className='grid grid-cols-2 gap-3 pt-4 pb-2'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        className='h-11 rounded-xl border-border bg-card text-xs font-semibold text-foreground shadow-none cursor-pointer'
      >
        Batal
      </Button>
      <Button
        type='submit'
        className='h-11 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
      >
        Simpan
      </Button>
    </div>
  );
}
