'use client';

import * as React from 'react';
import { Modal } from '@heroui/react';
import { Download, X } from 'lucide-react';
import { Button } from './button';
import { sanitizeSafeUrl } from '@/lib/utils';

export interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
}

/**
 * Image Lightbox Modal responsif menggunakan HeroUI Modal.
 * Menampilkan preview resolusi penuh dengan backdrop blur dan aksi download.
 */
export function MediaLightbox({
  isOpen,
  onClose,
  src,
  alt = 'Preview Gambar',
  title,
}: MediaLightboxProps) {
  const safeSrc = sanitizeSafeUrl(src, {
    allowBlob: true,
    allowRelative: true,
    allowDataImage: true,
  });

  const handleDownload = React.useCallback(() => {
    if (!safeSrc) return;
    const link = document.createElement('a');
    link.href = safeSrc;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const fallbackName = (safeSrc.split('/').pop() || 'image').split('?')[0];
    link.download = title || alt || fallbackName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [safeSrc, title, alt]);

  if (!safeSrc) return null;

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      variant='blur'
      className='bg-black/85 backdrop-blur-md z-50 p-2 sm:p-6'
    >
      <Modal.Container className='flex min-h-dvh h-full w-full items-center justify-center p-2 sm:p-4'>
        <Modal.Dialog
          data-placement='center'
          className='relative flex flex-col max-w-4xl w-full max-h-[90vh] !my-auto overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 p-3 sm:p-5 shadow-2xl text-white'
        >
          {/* Header Bar */}
          <div className='flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0'>
            <div className='flex flex-col min-w-0 pr-2'>
              <h3 className='text-xs sm:text-sm font-semibold truncate text-white/90'>
                {title || alt}
              </h3>
            </div>
            <div className='flex items-center gap-1.5 shrink-0'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={handleDownload}
                className='size-8 text-white/80 hover:text-white hover:bg-white/15 rounded-lg cursor-pointer'
                title='Unduh Gambar'
                aria-label='Unduh Gambar'
              >
                <Download className='size-4' />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='size-8 text-white/80 hover:text-white hover:bg-white/15 rounded-lg cursor-pointer'
                title='Tutup (Esc)'
                aria-label='Tutup'
              >
                <X className='size-4' />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className='flex-1 flex items-center justify-center overflow-auto p-2 sm:p-4 min-h-[220px]'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeSrc}
              alt={alt}
              className='object-contain max-h-[75vh] w-auto mx-auto rounded-lg shadow-xl select-none'
            />
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

