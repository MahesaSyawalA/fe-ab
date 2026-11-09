'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RotateCw, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { getDefaultHome } from '@/lib/rbac';

export interface ErrorStateProps {
  variant?: 'error' | 'not-found';
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  onReset?: () => void;
  showReset?: boolean;
  homeHref?: string;
  className?: string;
}

export function ErrorState({
  variant = 'error',
  imageSrc,
  imageAlt,
  title,
  description,
  onReset,
  showReset,
  homeHref,
  className,
}: ErrorStateProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = React.useTransition();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const isNotFound = variant === 'not-found';

  const defaultImageSrc = isNotFound
    ? '/assets/images/illustrations/ab-medical-not-found.png'
    : '/assets/images/illustrations/ab-medical-standard-error.png';

  const defaultTitle = isNotFound
    ? 'Halaman Tidak Ditemukan'
    : 'Terjadi Kesalahan';

  const defaultDescription = isNotFound
    ? 'Maaf, halaman yang anda cari tidak ditemukan atau telah dipindahkan'
    : 'Maaf, terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.';

  const resolvedImageSrc = imageSrc || defaultImageSrc;
  const resolvedImageAlt = imageAlt || defaultTitle;
  const resolvedTitle = title || defaultTitle;
  const resolvedDescription = description || defaultDescription;
  const shouldShowReset = showReset ?? !isNotFound;
  const resolvedHomeHref = homeHref || getDefaultHome(session?.user?.role);

  const handleReset = () => {
    setIsRetrying(true);
    startTransition(() => {
      router.refresh();
      if (onReset) {
        onReset();
      }
      setTimeout(() => setIsRetrying(false), 500);
    });
  };

  return (
    <div
      className={cn(
        'flex flex-1 w-full flex-col items-center justify-center p-4 sm:p-6 text-center my-auto',
        className,
      )}
    >
      <div className='relative mb-5 flex items-center justify-center select-none'>
        <Image
          src={resolvedImageSrc}
          alt={resolvedImageAlt}
          width={280}
          height={220}
          priority
          style={{ width: 'auto', height: 'auto' }}
          className='max-h-[160px] sm:max-h-[200px] max-w-[200px] sm:max-w-[260px] object-contain drop-shadow-xs'
        />
      </div>

      <h1 className='text-xl sm:text-2xl font-bold text-foreground text-center tracking-tight mb-2'>
        {resolvedTitle}
      </h1>

      <p className='text-xs sm:text-sm text-secondary-foreground max-w-sm sm:max-w-md mx-auto text-center leading-relaxed mb-6 sm:mb-8'>
        {resolvedDescription}
      </p>

      <div className='flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center sm:items-center'>
        {shouldShowReset && (
          <button
            type='button'
            onClick={handleReset}
            disabled={isRetrying || isPending}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold shadow-xs transition-all cursor-pointer select-none',
              'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]',
              'disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto',
            )}
          >
            <RotateCw
              className={cn('size-4', (isRetrying || isPending) && 'animate-spin')}
            />
            <span>Coba Lagi</span>
          </button>
        )}

        <Link
          href={resolvedHomeHref}
          className={cn(
            buttonVariants({ variant: isNotFound ? 'default' : 'outline' }),
            'inline-flex items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-all select-none w-full sm:w-auto',
            isNotFound
              ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-xs'
              : 'border border-border bg-background hover:bg-muted text-foreground',
          )}
        >
          <ArrowLeft className='size-4' />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </div>
    </div>
  );
}

