'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyPasswordButtonProps {
  textToCopy: string;
  disabled?: boolean;
  className?: string;
  onCopySuccess?: () => void;
}

export function CopyPasswordButton({
  textToCopy,
  disabled = false,
  className,
  onCopySuccess,
}: CopyPasswordButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textToCopy || disabled) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      onCopySuccess?.();

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <Tooltip delay={0} closeDelay={150}>
      <Tooltip.Trigger className='inline-flex'>
        <Button
          type='button'
          variant='outline'
          disabled={disabled}
          onClick={handleCopy}
          className={cn(
            'h-10 rounded-md px-3.5 text-xs font-semibold cursor-pointer shrink-0 shadow-2xs transition-all',
            isCopied
              ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'text-primary border-border/80 bg-card hover:bg-muted',
            className
          )}
        >
          {isCopied ? (
            <span className='inline-flex items-center gap-1.5'>
              <Check className='size-3.5' />
              <span>Disalin</span>
            </span>
          ) : (
            <span>Salin</span>
          )}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        showArrow
        placement='top'
        className='rounded-xl border border-border/80 bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md font-medium'
      >
        <Tooltip.Arrow />
        <span>{isCopied ? 'Password berhasil disalin!' : 'Salin ke clipboard'}</span>
      </Tooltip.Content>
    </Tooltip>
  );
}
