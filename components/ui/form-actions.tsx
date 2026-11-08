import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormActionsProps {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

/** Footer form: tombol batal + simpan (sticky di mobile, inline di desktop). */
export function FormActions({
  onCancel,
  cancelLabel = 'Batal',
  submitLabel = 'Simpan',
  isSubmitting,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-30 -mx-5 px-5 py-3 border-t border-border bg-card/90 backdrop-blur-md shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]',
        'sm:static sm:z-auto sm:mx-0 sm:px-0 sm:border-t sm:border-border/60 sm:bg-transparent sm:backdrop-blur-none sm:shadow-none sm:pt-5 sm:pb-0 sm:mt-2',
        className,
      )}
    >
      <div className='grid grid-cols-2 gap-3 w-full sm:flex sm:justify-end sm:gap-3'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='h-11 sm:h-10 sm:w-32 rounded-md border-border bg-card text-xs font-semibold text-foreground shadow-none hover:bg-muted/50 cursor-pointer'
        >
          {cancelLabel}
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='h-11 sm:h-10 sm:w-36 rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 size-4 animate-spin' />
              {submitLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </div>
  );
}
