import * as React from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange?: (fileUrl: string, file?: File) => void;
  onRemove?: () => void;
  className?: string;
  accept?: string;
}

export function FileUpload({
  label,
  helperText = 'Unggah 1 foto beresolusi jelas yang memperlihatkan identitas outlet resmi',
  value,
  onChange,
  onRemove,
  className,
  accept = 'image/*',
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange?.(result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-1.5', className)}>
      {label && <Label className='text-xs font-medium text-foreground'>{label}</Label>}
      {helperText && (
        <p className='text-[11px] text-secondary-foreground leading-relaxed'>
          {helperText}
        </p>
      )}

      {value ? (
        <div className='relative mt-1 h-44 sm:h-52 md:h-60 w-full overflow-hidden rounded-xl border border-border bg-secondary/40'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt='Preview' className='size-full object-cover' />
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className='absolute top-2 right-2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white cursor-pointer'
          >
            <X className='size-3.5' />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className='group mt-1 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 p-6 md:p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/4'
        >
          <div className='mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105'>
            <UploadCloud className='size-4' />
          </div>
          <p className='text-xs font-medium text-foreground'>
            Klik untuk unggah foto outlet
          </p>
          <p className='mt-0.5 text-[10px] text-muted-foreground'>
            Format JPG, PNG, atau WEBP (Maks. 5MB)
          </p>
          <input
            ref={inputRef}
            type='file'
            accept={accept}
            className='hidden'
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
