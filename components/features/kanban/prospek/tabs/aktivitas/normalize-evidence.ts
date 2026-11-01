import { AktivitasWithDetails } from '@/types/ticket.types';

export type AktivitasEvidence = NonNullable<AktivitasWithDetails['evidence']>;

/** Evidence punya dua nama field untuk beberapa hal (mis. tipe/jenis); satukan di sini. */
export function normalizeEvidence(ev: AktivitasEvidence, fallbackTime: string) {
  return {
    type: ev.tipe || ev.jenis || 'foto',
    description: ev.deskripsi || ev.catatan || '',
    fileName: ev.nama_file,
    size: ev.ukuran_file || ev.file_size,
    duration:
      ev.durasi_audio ||
      (ev.durasi_detik
        ? `00:${String(ev.durasi_detik).padStart(2, '0')}`
        : undefined),
    preview: ev.url_preview || ev.url_file,
    uploadedAt: ev.waktu_upload || fallbackTime,
  };
}
