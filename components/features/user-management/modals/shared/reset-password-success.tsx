'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyPasswordButton } from './copy-password-button';

interface ResetPasswordSuccessProps {
  userName: string;
  temporaryPassword: string;
  onClose?: () => void;
}

export function ResetPasswordSuccess({
  userName,
  temporaryPassword,
  onClose,
}: ResetPasswordSuccessProps) {
  return (
    <div className='flex flex-col items-center text-center gap-5 py-2 w-full'>
      <div className='flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs'>
        <Check className='size-8 stroke-[2.5]' />
      </div>

      <div className='flex flex-col gap-1.5'>
        <h3 className='text-base sm:text-lg font-bold text-foreground'>
          Password Berhasil Direset
        </h3>
        <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm'>
          Bagikan password sementara ini ke <strong className='text-foreground'>{userName}</strong>. Password hanya ditampilkan sekali.
        </p>
      </div>

      <div className='flex items-center justify-between gap-3 w-full rounded-2xl border border-primary/20 dark:border-primary/30 bg-[#F4F7FF] dark:bg-primary-950/25 p-4 sm:p-5 shadow-2xs'>
        <span className='font-mono font-bold text-lg sm:text-xl text-foreground tracking-wider select-all overflow-x-auto no-scrollbar'>
          {temporaryPassword}
        </span>
        <CopyPasswordButton
          textToCopy={temporaryPassword}
          className='h-9.5 px-4'
        />
      </div>

      <span className='text-xs font-semibold text-amber-600 dark:text-amber-400'>
        Wajib diganti saat login berikutnya.
      </span>

      {onClose && (
        <Button
          type='button'
          onClick={onClose}
          className='w-full h-10 sm:h-9 rounded-md font-semibold text-xs text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer'
        >
          Selesai
        </Button>
      )}
    </div>
  );
}
