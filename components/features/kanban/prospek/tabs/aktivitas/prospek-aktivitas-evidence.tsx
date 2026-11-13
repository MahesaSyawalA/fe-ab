'use client';

import * as React from 'react';
import {
  AlignLeft,
  Camera,
  FileText,
  Mic,
  Paperclip,
  ZoomIn,
} from 'lucide-react';
import { AktivitasEvidence, normalizeEvidence } from './normalize-evidence';
import { MediaLightbox } from '@/components/ui/media-lightbox';
import { DocumentPreviewCard } from '@/components/ui/document-preview-card';
import { CompactAudioPlayer } from '@/components/ui/compact-audio-player';
import { formatRelativeTime } from '@/lib/date-utils';

interface ProspekAktivitasEvidenceProps {
  evidence: AktivitasEvidence;
  fallbackTime: string;
}

export function ProspekAktivitasEvidence({
  evidence,
  fallbackTime,
}: ProspekAktivitasEvidenceProps) {
  const ev = normalizeEvidence(evidence, fallbackTime);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const isImage = ev.category === 'image';
  const isAudio = ev.category === 'audio';
  const isDocument = ev.category === 'document' || ev.category === 'text';

  const typeLabel = isImage
    ? 'FOTO'
    : isAudio
      ? 'AUDIO'
      : isDocument
        ? 'DOKUMEN'
        : ev.type.toUpperCase();

  const previewUrl = ev.preview || ev.url;

  const formattedUploadedAt = React.useMemo(() => {
    if (!ev.uploadedAt) return fallbackTime;
    if (ev.uploadedAt.includes('lalu') || ev.uploadedAt === 'Baru saja') {
      return ev.uploadedAt;
    }
    const d = new Date(ev.uploadedAt);
    if (!isNaN(d.getTime())) {
      return formatRelativeTime(d);
    }
    return ev.uploadedAt;
  }, [ev.uploadedAt, fallbackTime]);

  return (
    <div className='mt-1 flex flex-col gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs sm:text-sm'>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5 font-semibold text-primary text-xs'>
          {isImage && <Camera className='size-3.5' />}
          {isAudio && <Mic className='size-3.5' />}
          {isDocument && <FileText className='size-3.5' />}
          {!isImage && !isAudio && !isDocument && <AlignLeft className='size-3.5' />}
          <span>File Bukti ({typeLabel})</span>
        </div>
        <span className='text-[10px] sm:text-xs text-muted-foreground'>
          {formattedUploadedAt}
        </span>
      </div>

      {ev.fileName && !isDocument && (
        <div className='flex items-center gap-1.5 text-xs text-foreground font-medium'>
          <Paperclip className='size-3.5 text-muted-foreground shrink-0' />
          <span className='truncate'>{ev.fileName}</span>
          {ev.size && (
            <span className='text-[11px] text-muted-foreground shrink-0'>
              ({ev.size})
            </span>
          )}
        </div>
      )}

      {ev.description && (
        <p className='text-xs text-foreground/85 italic bg-background/70 p-2.5 rounded-lg border border-border/50 leading-relaxed'>
          &quot;{ev.description}&quot;
        </p>
      )}

      {previewUrl && isImage && (
        <>
          <div
            onClick={() => setIsLightboxOpen(true)}
            className='group relative mt-1 overflow-hidden rounded-xl border border-border/70 max-w-xs sm:max-w-sm cursor-pointer bg-background/60 shadow-2xs'
            title='Klik untuk memperbesar gambar'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={ev.fileName || 'Bukti Aktivitas'}
              className='h-36 sm:h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />

            <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[1px]'>
              <ZoomIn className='size-4' />
              <span>Perbesar Foto</span>
            </div>
          </div>

          <MediaLightbox
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            src={previewUrl}
            alt={ev.fileName || 'Foto Bukti Aktivitas'}
            title={ev.fileName || 'Foto Bukti Aktivitas'}
          />
        </>
      )}

      {previewUrl && isAudio && (
        <div className='mt-1'>
          <CompactAudioPlayer
            src={previewUrl}
            title={ev.fileName || 'Rekaman Suara Lapangan'}
            durationLabel={ev.duration}
          />
        </div>
      )}

      {previewUrl && isDocument && (
        <div className='mt-1'>
          <DocumentPreviewCard
            url={previewUrl}
            fileName={ev.fileName}
            fileSize={ev.size}
          />
        </div>
      )}
    </div>
  );
}
