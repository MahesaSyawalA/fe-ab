import { PelangganWithDetails } from '@/types/customer.types';
import { Kontak } from '@/types/contact.types';
import { TiketPrioritas, TiketWithDetails } from '@/types/ticket.types';
import { FilePenawaran } from '../types';

export interface ProspekFormValues {
  judul: string;
  outletId: string;
  estimasiDisplay: string;
  targetClosing: string;
  prioritas: TiketPrioritas;
  filePenawaran: FilePenawaran | null;
}

interface BuildArgs {
  values: ProspekFormValues;
  outlet?: PelangganWithDetails;
  kontak?: Kontak;
}

const parseEstimasi = (display: string) =>
  Number(display.replace(/\D/g, '')) || 50_000_000;

function formatClosingLabel(dateStr: string) {
  if (!dateStr) return { full: '05 Des 2026', short: '05 Des' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { full: dateStr, short: dateStr.slice(0, 6) };
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return {
      full: `${day} ${month} ${year}`,
      short: `${day} ${month}`,
    };
  } catch {
    return { full: dateStr, short: dateStr.slice(0, 6) };
  }
}

export function buildTicketUpdates({
  values: v,
  outlet,
  kontak,
  ticket,
}: BuildArgs & { ticket: TiketWithDetails }): Partial<TiketWithDetails> {
  const closingLabels = formatClosingLabel(v.targetClosing);
  return {
    judul: v.judul.trim(),
    id_pelanggan: v.outletId,
    nama_outlet: outlet?.nama_outlet ?? outlet?.nama_faskes ?? ticket.nama_outlet,
    nama_faskes: outlet?.nama_faskes ?? outlet?.nama_outlet ?? ticket.nama_faskes,
    id_kontak: kontak?.id_kontak ?? ticket.id_kontak,
    nama_pic: kontak?.nama ?? ticket.nama_pic,
    jabatan_pic: kontak?.jabatan ?? ticket.jabatan_pic,
    no_telp_pic: kontak?.no_telp ?? ticket.no_telp_pic,
    estimasi_nilai: parseEstimasi(v.estimasiDisplay),
    estimasi_closing: v.targetClosing || '2026-12-05',
    closing_full_label: closingLabels.full,
    closing_short_label: closingLabels.short,
    prioritas: v.prioritas,
    file_penawaran: v.filePenawaran,
  };
}

export function buildNewTicket({
  values: v,
  outlet,
  kontak,
  stageId,
}: BuildArgs & { stageId: string }): TiketWithDetails {
  const randomNum = Math.floor(130 + Math.random() * 70);
  const closingLabels = formatClosingLabel(v.targetClosing);
  return {
    id_tiket: `tkt-0${randomNum}-${Date.now().toString().slice(-3)}`,
    kode_tiket: `TKT-0${randomNum}`,
    id_pelanggan: v.outletId,
    id_user: 'usr-1',
    id_tahap: stageId || 'visit',
    id_kontak: kontak?.id_kontak ?? null,
    judul: v.judul.trim(),
    nama_outlet: outlet?.nama_outlet ?? outlet?.nama_faskes ?? 'RS Harapan Sehat',
    nama_faskes: outlet?.nama_faskes ?? outlet?.nama_outlet ?? 'RS Harapan Sehat',
    nama_pic: kontak?.nama ?? 'Bpk. Hendra Wijaya',
    jabatan_pic: kontak?.jabatan ?? 'Direktur Umum',
    no_telp_pic: kontak?.no_telp ?? '0812-3456-7890',
    nama_sales: 'Rina Putri',
    inisial_sales: 'MT',
    estimasi_nilai: parseEstimasi(v.estimasiDisplay),
    estimasi_closing: v.targetClosing || '2026-11-12',
    closing_short_label: closingLabels.short,
    closing_full_label: closingLabels.full,
    status: 'open',
    kebutuhan_pelanggan: v.judul.trim(),
    prioritas: v.prioritas,
    posisi: 1,
    tanggal_penawaran_awal: new Date().toISOString(),
    tanggal_closing: null,
    alasan_lost: null,
    file_penawaran: v.filePenawaran,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aktivitas_list: [],
    riwayat_list: [],
  };
}
