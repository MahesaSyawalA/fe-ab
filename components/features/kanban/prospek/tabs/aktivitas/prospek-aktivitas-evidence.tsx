import {
  AlignLeft,
  Camera,
  FileText,
  Mic,
  Paperclip,
  Volume2,
} from 'lucide-react';
import { AktivitasEvidence, normalizeEvidence } from './normalize-evidence';

interface ProspekAktivitasEvidenceProps {
  evidence: AktivitasEvidence;
  fallbackTime: string;
}

export function ProspekAktivitasEvidence({
  evidence,
  fallbackTime,
}: ProspekAktivitasEvidenceProps) {
  const ev = normalizeEvidence(evidence, fallbackTime);

  return (
    <div className='mt-1 flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs sm:text-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5 font-semibold text-primary text-xs'>
          {ev.type === 'foto' && <Camera className='size-3.5' />}
          {ev.type === 'audio' && <Mic className='size-3.5' />}
          {ev.type === 'dokumen' && <FileText className='size-3.5' />}
          {ev.type === 'teks' && <AlignLeft className='size-3.5' />}
          <span>File Bukti ({ev.type.toUpperCase()})</span>
        </div>
        <span className='text-[10px] sm:text-xs text-muted-foreground'>
          {ev.uploadedAt}
        </span>
      </div>

      {ev.fileName && (
        <div className='flex items-center gap-1.5 text-xs text-foreground font-medium'>
          <Paperclip className='size-3.5 text-muted-foreground' />
          <span className='truncate'>{ev.fileName}</span>
          {ev.size && (
            <span className='text-[11px] text-muted-foreground'>
              ({ev.size})
            </span>
          )}
        </div>
      )}

      {ev.duration && (
        <div className='flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 border border-border/50'>
          <Volume2 className='size-4 text-primary' />
          <span className='text-xs font-semibold text-foreground'>
            Rekaman Suara Lapangan
          </span>
          <span className='text-xs font-mono text-muted-foreground ml-auto'>
            {ev.duration}
          </span>
        </div>
      )}

      {ev.description && (
        <p className='text-xs text-foreground/80 italic bg-background/60 p-2 rounded-lg border border-border/40'>
          &quot;{ev.description}&quot;
        </p>
      )}

      {ev.preview && (
        <div className='mt-1 overflow-hidden rounded-xl border border-border/60 max-w-xs sm:max-w-sm'>
          <img
            src={ev.preview}
            alt='Evidence'
            className='h-36 sm:h-44 w-full object-cover hover:scale-105 transition-transform duration-300'
          />
        </div>
      )}
    </div>
  );
}
