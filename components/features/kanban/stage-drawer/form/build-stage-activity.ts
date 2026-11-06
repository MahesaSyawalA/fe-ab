import { JenisTahap } from '@/types/kanban-stage.types';
import { PelangganWithDetails } from '@/types/customer.types';
import { AktivitasWithDetails, TiketWithDetails } from '@/types/ticket.types';
import { KanbanStageColumn } from '@/constants/kanban-constants';
import { StageActivityForm } from './use-stage-activity-form';
import { StageActivityDrawerProps, detectFileType } from '../types';

type StageForm = Pick<
  StageActivityForm,
  | 'evidenceFile'
  | 'tanggalAktivitas'
  | 'jadwalFollowUp'
  | 'picDitemui'
  | 'catatan'
  | 'nilaiQuotation'
  | 'nominalPo'
  | 'realisasiRevenue'
  | 'estimasiNilai'
  | 'targetClosing'
  | 'statusClosing'
  | 'spesifikasiKebutuhan'
>;

type JenisKegiatan = AktivitasWithDetails['jenis_kegiatan'];

const toKegiatan = (stage: KanbanStageColumn) =>
  (stage.jenis_tahap || 'visit') as JenisKegiatan;

/** Nilai rupiah dari input tahap aktif, sebagai angka. */
function parseNilai(f: StageForm, stageType: JenisTahap): number {
  const raw =
    stageType === 'quotation'
      ? f.nilaiQuotation
      : stageType === 'po'
        ? f.nominalPo
        : stageType === 'revenue'
          ? f.realisasiRevenue
          : f.estimasiNilai;
  return Number(raw.replace(/\D/g, '')) || 0;
}

function buildEvidence(f: StageForm): AktivitasWithDetails['evidence'] {
  const file = f.evidenceFile;
  return {
    tipe: file ? detectFileType(file.name) : 'dokumen',
    nama_file: file?.name || 'bukti_aktivitas.pdf',
    file_size: file?.size || '500 KB',
    deskripsi: file?.name || 'Bukti aktivitas',
    waktu_upload: 'Baru saja',
    url_preview: file?.url,
  };
}

interface CreateArgs {
  form: StageForm &
    Pick<
      StageActivityForm,
      | 'selectedPelangganId'
      | 'judulProspek'
      | 'jabatanPic'
      | 'noTelpPic'
      | 'prioritas'
    >;
  targetStage: KanbanStageColumn;
  pelangganList: PelangganWithDetails[];
}

export function buildCreatedTicket({
  form: f,
  targetStage,
  pelangganList,
}: CreateArgs): TiketWithDetails {
  const stageType = targetStage.jenis_tahap ?? 'visit';
  const selectedPelanggan =
    pelangganList.find((p) => p.id_pelanggan === f.selectedPelangganId) ||
    pelangganList[0];

  const newId = `tkt-${Date.now()}`;
  const kodeTiket = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

  const newActivity: AktivitasWithDetails = {
    id_aktivitas: `akt-${Date.now()}`,
    id_user: 'usr-1',
    id_tiket: newId,
    tanggal: f.tanggalAktivitas,
    catatan:
      f.catatan.trim() ||
      `Tiket baru dibuat pada tahap ${targetStage.nama_tahap} oleh Sales.`,
    jenis_kegiatan: toKegiatan(targetStage),
    jadwal_follow_up: f.jadwalFollowUp || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nama_petugas: 'Rina Putri',
    pic_ditemui: f.picDitemui || 'PIC Outlet',
    waktu_label: 'Baru saja',
    evidence: buildEvidence(f),
  };

  return {
    id_tiket: newId,
    id_pelanggan: selectedPelanggan?.id_pelanggan || 'plg-1',
    id_user: 'usr-1',
    id_tahap: targetStage.id_tahap,
    id_kontak: null,
    judul:
      f.judulProspek.trim() ||
      `Pengadaan Alkes - ${selectedPelanggan?.nama_outlet || 'RS'}`,
    estimasi_nilai: parseNilai(f, stageType),
    estimasi_closing:
      f.targetClosing ||
      new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: stageType === 'revenue' ? f.statusClosing : 'open',
    kebutuhan_pelanggan: f.spesifikasiKebutuhan || '',
    prioritas: f.prioritas,
    posisi: 0,
    tanggal_penawaran_awal: null,
    tanggal_closing: stageType === 'revenue' ? f.tanggalAktivitas : null,
    alasan_lost: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    kode_tiket: kodeTiket,
    nama_outlet: selectedPelanggan?.nama_outlet || 'Rumah Sakit',
    nama_pic: f.picDitemui || 'PIC Outlet',
    jabatan_pic: f.jabatanPic || 'Kepala Pengadaan',
    no_telp_pic: f.noTelpPic || '0812-0000-0000',
    nama_sales: 'Rina Putri',
    inisial_sales: 'RP',
    aktivitas_list: [newActivity],
    riwayat_list: [
      {
        id_riwayat: `rw-${Date.now()}`,
        id_tiket: newId,
        id_tahap_asal: null,
        id_tahap_tujuan: targetStage.id_tahap,
        nama_tahap_asal: null,
        nama_tahap_tujuan: targetStage.nama_tahap,
        id_user: 'usr-1',
        nama_user: 'Rina Putri',
        waktu_pindah: new Date().toISOString(),
        waktu_label: 'Baru saja',
      },
    ],
  };
}

type ConfirmMoveParams = Parameters<
  NonNullable<StageActivityDrawerProps['onConfirmMove']>
>[0];

interface MoveArgs {
  form: StageForm;
  ticket: TiketWithDetails;
  fromStage?: KanbanStageColumn | null;
  targetStage: KanbanStageColumn;
  targetIndex?: number;
}

export function buildMoveParams({
  form: f,
  ticket,
  fromStage,
  targetStage,
  targetIndex,
}: MoveArgs): ConfirmMoveParams {
  const stageType = targetStage.jenis_tahap ?? 'visit';

  const ticketUpdates: Partial<TiketWithDetails> = {
    prioritas: ticket.prioritas, // Prioritas tidak bisa diganti saat pindah tiket
    estimasi_nilai: parseNilai(f, stageType),
  };

  if (f.targetClosing) {
    ticketUpdates.estimasi_closing = f.targetClosing;
  }

  if (stageType === 'revenue') {
    ticketUpdates.status = f.statusClosing;
    ticketUpdates.tanggal_closing = f.tanggalAktivitas;
  }

  if (stageType === 'kebutuhan' && f.spesifikasiKebutuhan) {
    ticketUpdates.kebutuhan_pelanggan = f.spesifikasiKebutuhan;
  }

  if (stageType === 'quotation' && f.evidenceFile) {
    ticketUpdates.file_penawaran = f.evidenceFile;
    ticketUpdates.tanggal_penawaran_awal = f.tanggalAktivitas;
  }

  if (stageType === 'po' && f.evidenceFile) {
    ticketUpdates.file_penawaran = f.evidenceFile;
  }

  const effectiveFromStageId = fromStage?.id_tahap || ticket.id_tahap;
  const isSameStage = effectiveFromStageId === targetStage.id_tahap;
  const sales = ticket.nama_sales || 'Sales';

  const activity: AktivitasWithDetails = {
    id_aktivitas: `akt-${Date.now()}`,
    id_user: ticket.id_user || 'usr-1',
    id_tiket: ticket.id_tiket,
    tanggal: f.tanggalAktivitas,
    catatan:
      f.catatan.trim() ||
      (isSameStage
        ? `Aktivitas tahap ${targetStage.nama_tahap} oleh ${sales}.`
        : `Perpindahan tahap ke ${targetStage.nama_tahap} oleh ${sales}.`),
    jenis_kegiatan: toKegiatan(targetStage),
    jadwal_follow_up: f.jadwalFollowUp || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nama_petugas: ticket.nama_sales || 'Sales Representative',
    pic_ditemui: f.picDitemui || ticket.nama_pic || 'PIC Outlet',
    waktu_label: 'Baru saja',
    evidence: buildEvidence(f),
  };

  return {
    id_tiket: ticket.id_tiket,
    fromStageId: effectiveFromStageId,
    toStageId: targetStage.id_tahap,
    targetIndex,
    ticketUpdates,
    activity,
  };
}
