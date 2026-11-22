'use client';

import * as React from 'react';
import {
  FileText,
  FileSpreadsheet,
  File,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, sanitizeSafeUrl } from '@/lib/utils';

export interface DocumentPreviewCardProps {
  url: string;
  fileName?: string;
  fileSize?: string;
  className?: string;
}

interface DocMeta {
  extension: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  badgeClass: string;
  canViewInBrowser: boolean;
}

function getDocMeta(fileNameOrUrl: string): DocMeta {
  const cleanStr = fileNameOrUrl.split('?')[0].toLowerCase();
  const ext = cleanStr.split('.').pop() || '';

  if (ext === 'pdf') {
    return {
      extension: 'PDF',
      label: 'Dokumen PDF',
      icon: FileText,
      iconBgClass: 'bg-rose-50 border-rose-200/80',
      iconColorClass: 'text-rose-600',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      canViewInBrowser: true,
    };
  }

  if (['doc', 'docx'].includes(ext)) {
    return {
      extension: ext.toUpperCase(),
      label: 'Dokumen Word',
      icon: FileText,
      iconBgClass: 'bg-blue-50 border-blue-200/80',
      iconColorClass: 'text-blue-600',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      canViewInBrowser: false,
    };
  }

  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return {
      extension: ext.toUpperCase(),
      label: 'Lembar Kerja Excel',
      icon: FileSpreadsheet,
      iconBgClass: 'bg-emerald-50 border-emerald-200/80',
      iconColorClass: 'text-emerald-600',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      canViewInBrowser: false,
    };
  }

  if (['txt', 'notes', 'md'].includes(ext)) {
    return {
      extension: ext.toUpperCase(),
      label: 'Catatan Teks',
      icon: FileText,
      iconBgClass: 'bg-slate-100 border-slate-200',
      iconColorClass: 'text-slate-600',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      canViewInBrowser: true,
    };
  }

  return {
    extension: ext ? ext.toUpperCase() : 'DOC',
    label: 'Dokumen Berkas',
    icon: File,
    iconBgClass: 'bg-primary/10 border-primary/20',
    iconColorClass: 'text-primary',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    canViewInBrowser: false,
  };
}

/**
 * Universal Document Opener Card untuk berkas .pdf, .doc, .docx, .xls, .xlsx, .txt.
 * Mendukung buka tab baru (PDF/TXT) atau unduh langsung (DOCX/XLSX).
 */
export function DocumentPreviewCard({
  url,
  fileName,
  fileSize,
  className,
}: DocumentPreviewCardProps) {
  const safeUrl = sanitizeSafeUrl(url);
  if (!safeUrl) return null;

  let decodedFallback = 'Dokumen';
  try {
    decodedFallback = decodeURIComponent(safeUrl.split('/').pop()?.split('?')[0] || 'Dokumen');
  } catch {
    decodedFallback = safeUrl.split('/').pop()?.split('?')[0] || 'Dokumen';
  }
  const displayName = fileName || decodedFallback;
  const meta = getDocMeta(fileName || safeUrl);
  const IconComponent = meta.icon;

  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-background/80 hover:bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200',
        className,
      )}
    >
      <div className='flex items-center gap-3 min-w-0 flex-1'>
        {/* Icon Berkas dengan Theme Color Sesuai Ekstensi */}
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg border',
            meta.iconBgClass,
          )}
        >
          <IconComponent className={cn('size-5', meta.iconColorClass)} />
        </div>

        {/* Informasi Berkas */}
        <div className='flex flex-col min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span
              className='text-xs sm:text-sm font-semibold text-foreground truncate'
              title={displayName}
            >
              {displayName}
            </span>
            <Badge
              variant='outline'
              className={cn(
                'h-4.5 px-1.5 text-[9px] font-bold uppercase rounded-md border shrink-0',
                meta.badgeClass,
              )}
            >
              {meta.extension}
            </Badge>
          </div>
          <div className='flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5'>
            <span>{meta.label}</span>
            {fileSize && (
              <>
                <span className='size-1 rounded-full bg-muted-foreground/40' />
                <span>{fileSize}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Interaksi Aksi */}
      <div className='shrink-0 pl-1'>
        {meta.canViewInBrowser ? (
          <a
            href={safeUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold border border-primary/20 transition-colors cursor-pointer'
            title='Buka Dokumen di Tab Baru'
          >
            <ExternalLink className='size-3.5' />
            <span className='hidden sm:inline'>Buka</span>
          </a>
        ) : (
          <a
            href={safeUrl}
            download={displayName}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-muted/80 hover:bg-primary hover:text-white text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer'
            title='Unduh Berkas Dokumen'
          >
            <Download className='size-3.5' />
            <span className='hidden sm:inline'>Unduh</span>
          </a>
        )}
      </div>
    </div>
  );
}

