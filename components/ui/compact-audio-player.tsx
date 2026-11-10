'use client';

import * as React from 'react';
import { Play, Pause, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CompactAudioPlayerProps {
  src: string;
  title?: string;
  durationLabel?: string;
  className?: string;
}

function parseDurationLabel(label?: string): number {
  if (!label) return 0;
  const parts = label.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Compact HTML5 Audio Player untuk rekaman suara lapangan / voice note aktivitas prospek.
 * Menampilkan kontrol Play/Pause, scrubber bar interaktif, dan format durasi mm:ss / mm:ss.
 */
export function CompactAudioPlayer({
  src,
  title = 'Rekaman Suara Lapangan',
  durationLabel,
  className,
}: CompactAudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(() => parseDurationLabel(durationLabel));
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const effectiveDuration = duration > 0 ? duration : parseDurationLabel(durationLabel);

  const togglePlay = async () => {
    if (!audioRef.current || hasError) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
    setIsLoading(false);
    setHasError(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressPercent =
    effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  if (!src) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-3 rounded-xl border border-primary/20 bg-background/90 shadow-2xs',
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload='metadata'
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onEnded={handleEnded}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {/* Header Info */}
      <div className='flex items-center justify-between text-xs'>
        <div className='flex items-center gap-1.5 font-semibold text-foreground truncate'>
          <Volume2 className='size-3.5 text-primary shrink-0' />
          <span className='truncate'>{title}</span>
        </div>
        <div className='font-mono text-[11px] text-muted-foreground shrink-0'>
          {hasError ? (
            <span className='text-rose-500 flex items-center gap-1 text-[10px] font-sans'>
              <AlertCircle className='size-3' /> Gagal memutar
            </span>
          ) : (
            <span>
              {formatDuration(currentTime)} / {formatDuration(effectiveDuration)}
            </span>
          )}
        </div>
      </div>

      {/* Control & Scrubber Bar */}
      <div className='flex items-center gap-2.5 pt-0.5'>
        <Button
          type='button'
          size='icon'
          onClick={togglePlay}
          disabled={hasError}
          className='size-8 rounded-full bg-primary text-white hover:bg-primary/90 shrink-0 cursor-pointer shadow-xs transition-transform active:scale-95 disabled:opacity-50'
          title={isPlaying ? 'Jeda' : 'Putar Audio'}
          aria-label={isPlaying ? 'Jeda' : 'Putar Audio'}
        >
          {isLoading ? (
            <Loader2 className='size-3.5 animate-spin' />
          ) : isPlaying ? (
            <Pause className='size-3.5 fill-current' />
          ) : (
            <Play className='size-3.5 fill-current ml-0.5' />
          )}
        </Button>

        {/* Mini Scrubber Slider */}
        <div className='relative flex-1 flex items-center'>
          <input
            type='range'
            min={0}
            max={effectiveDuration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={hasError || effectiveDuration === 0}
            className='w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed focus:outline-none'
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progressPercent}%, var(--muted) ${progressPercent}%, var(--muted) 100%)`,
            }}
            aria-label='Audio progress scrubber'
          />
        </div>
      </div>
    </div>
  );
}
