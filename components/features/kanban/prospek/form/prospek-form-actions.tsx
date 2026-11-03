import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProspekFormActionsProps {
  onCancel: () => void;
  className?: string;
}

export function ProspekFormActions({
  onCancel,
  className,
}: ProspekFormActionsProps) {
  return (
    <>
      {/* 1. Mobile Fixed CTA Bar (< md): Mengikuti pola persistensi Halaman Detail Prospek */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/85 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md shadow-lg md:hidden',
          className,
        )}
      >
        <div className='mx-auto w-full max-w-lg'>
          <div className='grid grid-cols-2 gap-3 w-full'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='h-11 rounded-xl border-border bg-card text-xs font-semibold text-foreground shadow-none hover:bg-muted/50 cursor-pointer'
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
        </div>
      </div>

      {/* 2. Desktop Static Actions (>= md): Posisi statis di dalam kartu form */}
      <div className='hidden md:flex items-center justify-end gap-3 pt-5 border-t border-border/60 mt-2'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='h-10 w-32 rounded-xl border-border bg-card text-xs font-semibold text-foreground shadow-none hover:bg-muted/50 cursor-pointer'
        >
          Batal
        </Button>
        <Button
          type='submit'
          className='h-10 w-36 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer'
        >
          Simpan
        </Button>
      </div>
    </>
  );
}


