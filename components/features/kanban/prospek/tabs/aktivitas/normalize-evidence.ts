import { EvidenceItem } from '@/types/activity.types';

export type AktivitasEvidence = EvidenceItem;

export type EvidenceMediaCategory = 'image' | 'audio' | 'document' | 'text';

export interface NormalizedEvidence {
  type: string;
  category: EvidenceMediaCategory;
  description: string;
  fileName?: string;
  size?: string;
  duration?: string;
  url?: string;
  preview?: string;
  uploadedAt: string;
}

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif']);
const AUDIO_EXTENSIONS = new Set([
  'mp3',
  'm4a',
  'wav',
  'aac',
  'ogg',
  'oga',
  'opus',
  'amr',
  '3gp',
  'wma',
  'flac',
]);

function extractExt(str?: string): string {
  if (!str) return '';
  const clean = str.split('?')[0].toLowerCase();
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) return '';
  return clean.slice(lastDot + 1);
}

function detectCategory(
  rawType: string,
  fileName?: string,
  url?: string,
): EvidenceMediaCategory {
  const extName = extractExt(fileName);
  const extUrl = extractExt(url);
  const ext = (extName && extName.length <= 5 ? extName : extUrl) || extUrl;

  if (ext) {
    if (IMAGE_EXTENSIONS.has(ext)) return 'image';
    if (AUDIO_EXTENSIONS.has(ext)) return 'audio';
    if (['txt', 'notes', 'md'].includes(ext)) return 'text';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'].includes(ext)) return 'document';
  }

  const normalizedType = rawType.toLowerCase();
  if (normalizedType === 'foto' || normalizedType === 'image') return 'image';
  if (normalizedType === 'audio') return 'audio';
  if (normalizedType === 'teks' || normalizedType === 'text') return 'text';
  return 'document';
}

export function normalizeEvidence(
  ev: AktivitasEvidence,
  fallbackTime: string,
): NormalizedEvidence {
  const rawType = ev.tipe || ev.jenis || 'foto';
  const fileUrl = ev.url_file || ev.url_preview;
  const fileName = ev.nama_file;
  const category = detectCategory(rawType, fileName, fileUrl);

  return {
    type: rawType,
    category,
    description: ev.deskripsi || ev.catatan || '',
    fileName,
    size: ev.ukuran_file || ev.file_size,
    duration:
      ev.durasi_audio ||
      (ev.durasi_detik
        ? `00:${String(ev.durasi_detik).padStart(2, '0')}`
        : undefined),
    url: fileUrl,
    preview: fileUrl,
    uploadedAt: ev.waktu_upload || fallbackTime,
  };
}
