'use client';

import * as React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  File,
  FileCheck2,
  FileText,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Package,
  Paperclip,
  Pause,
  PhoneCall,
  Play,
  Plus,
  Radio,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Square,
  TrendingUp,
  Upload,
  UploadCloud,
  UserCheck,
  Volume2,
  X,
  FileBox,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { NativeSelect } from '@/components/ui/native-select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { FileType } from '@/components/reui/file-type';
import { usePelangganStore } from '@/lib/pelanggan-store';
import {
  AktivitasWithDetails,
  EvidenceItem,
  JenisEvidence,
  TiketPrioritas,
  TiketWithDetails,
} from '@/types/ticket.types';
import { KanbanStageColumn, PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { cn, formatNumberInput } from '@/lib/utils';
import { JenisTahap } from '@/types/kanban-stage.types';

export type StageDrawerMode = 'move' | 'create';

export interface StageActivityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: StageDrawerMode;
  ticket?: TiketWithDetails | null;
  fromStage?: KanbanStageColumn | null;
  targetStage: KanbanStageColumn | null;
  targetIndex?: number;
  onConfirmMove?: (params: {
    id_tiket: string;
    fromStageId: string;
    toStageId: string;
    targetIndex?: number;
    ticketUpdates: Partial<TiketWithDetails>;
    activity: AktivitasWithDetails;
  }) => void;
  onCreateTicket?: (newTicket: TiketWithDetails) => void;
  onCancelMove?: () => void;
}

export function StageActivityDrawer({
  open,
  onOpenChange,
  mode = 'move',
  ticket,
  fromStage,
  targetStage,
  targetIndex,
  onConfirmMove,
  onCreateTicket,
  onCancelMove,
}: StageActivityDrawerProps) {
  const { pelangganList } = usePelangganStore();
  const stageType: JenisTahap = targetStage?.jenis_tahap ?? 'visit';

  // Create Mode state
  const [selectedPelangganId, setSelectedPelangganId] = React.useState('');
  const [judulProspek, setJudulProspek] = React.useState('');

  // Common ticket/activity fields
  const [picDitemui, setPicDitemui] = React.useState('');
  const [jabatanPic, setJabatanPic] = React.useState('');
  const [noTelpPic, setNoTelpPic] = React.useState('');
  const [tanggalAktivitas, setTanggalAktivitas] = React.useState(
    new Date().toISOString().slice(0, 10),
  );
  const [jamAktivitas, setJamAktivitas] = React.useState('10:30');
  const [prioritas, setPrioritas] = React.useState<TiketPrioritas>('sedang');
  const [catatan, setCatatan] = React.useState('');

  // ==========================================
  // UNIFIED EVIDENCE FILE UPLOAD STATE
  // ==========================================
  const [evidenceFile, setEvidenceFile] = React.useState<{
    name: string;
    size: string;
    type?: string;
    url?: string;
  } | null>(null);
  const [evidenceDeskripsi, setEvidenceDeskripsi] = React.useState('');
  const [evidenceError, setEvidenceError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Helper function to detect file type from file name
  const detectFileType = (fileName: string): JenisEvidence => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'foto';
    if (['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio';
    if (['txt', 'notes', 'md'].includes(ext)) return 'teks';
    return 'dokumen';
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInKb = file.size / 1024;
      const formattedSize =
        sizeInKb > 1024
          ? `${(sizeInKb / 1024).toFixed(1)} MB`
          : `${Math.round(sizeInKb)} KB`;

      const objectUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined;

      setEvidenceFile({
        name: file.name,
        size: formattedSize,
        type: file.type,
        url: objectUrl,
      });
      setEvidenceError(false);
    }
  };

  // Visit specifics
  const [koordinatGps] = React.useState('-6.2088, 106.8456');
  const [statusRadius] = React.useState('Valid (Dalam Radius 38m)');

  // Kebutuhan specifics
  const [jenisAlkes, setJenisAlkes] = React.useState('');
  const [jumlahUnit, setJumlahUnit] = React.useState('1');
  const [spesifikasiKebutuhan, setSpesifikasiKebutuhan] = React.useState('');
  const [estimasiBudget, setEstimasiBudget] = React.useState('');
  const [urgensiPengadaan, setUrgensiPengadaan] = React.useState('Mendesak');

  // Opportunity specifics
  const [estimasiNilai, setEstimasiNilai] = React.useState('');
  const [targetClosing, setTargetClosing] = React.useState('');
  const [probabilitas, setProbabilitas] = React.useState('75%');
  const [analisisKompetitor, setAnalisisKompetitor] = React.useState('');
  const [actionPlan, setActionPlan] = React.useState('');

  // Follow Up specifics
  const [mediaKomunikasi, setMediaKomunikasi] = React.useState('WhatsApp');
  const [responKlien, setResponKlien] = React.useState('Tertarik & Minta Simulasi');
  const [jadwalFollowUp, setJadwalFollowUp] = React.useState('');

  // Quotation specifics
  const [noQuotation, setNoQuotation] = React.useState('');
  const [nilaiQuotation, setNilaiQuotation] = React.useState('');
  const [masaBerlaku, setMasaBerlaku] = React.useState('30 Hari Kalender');
  const [revisiKe, setRevisiKe] = React.useState('1');

  // PO specifics
  const [noPo, setNoPo] = React.useState('');
  const [nominalPo, setNominalPo] = React.useState('');
  const [targetPengiriman, setTargetPengiriman] = React.useState('');
  const [terminPembayaran, setTerminPembayaran] = React.useState('DP 30% - Pelunasan 70%');

  // Revenue specifics
  const [statusClosing, setStatusClosing] = React.useState<'won' | 'lost'>('won');
  const [realisasiRevenue, setRealisasiRevenue] = React.useState('');
  const [noInvoiceBast, setNoInvoiceBast] = React.useState('');
  const [metodePembayaran, setMetodePembayaran] = React.useState('Transfer Bank Mandiri');

  // Handle Faskes change in Create mode
  const handleFaskesChange = (pelangganId: string) => {
    setSelectedPelangganId(pelangganId);
    const chosen = pelangganList.find((p) => p.id_pelanggan === pelangganId);
    if (chosen) {
      const pic = chosen.kontak_list?.[0];
      if (pic) {
        setPicDitemui(pic.nama);
        setJabatanPic(pic.jabatan);
        setNoTelpPic(pic.no_telp);
      }
    }
  };

  // Prefill state whenever open, mode, ticket or targetStage changes
  React.useEffect(() => {
    if (!open || !targetStage) return;

    setEvidenceError(false);

    // Initial Evidence setup per stage
    const faskesName = ticket?.nama_faskes || 'RS Harapan Sehat';
    const randNum = Math.floor(100 + Math.random() * 900);

    switch (targetStage.jenis_tahap) {
      case 'visit':
        setEvidenceFile({
          name: `foto_kunjungan_${faskesName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
          size: '1.4 MB',
        });
        setEvidenceDeskripsi('Dokumentasi foto kunjungan dan observasi faskes bersama PIC');
        break;
      case 'kebutuhan':
        setEvidenceFile({
          name: `form_survei_kebutuhan_alkes_${randNum}.pdf`,
          size: '860 KB',
        });
        setEvidenceDeskripsi('Formulir asesmen spesifikasi unit dan kesiapan ruangan');
        break;
      case 'opportunity':
        setEvidenceFile({
          name: `voice_note_kesepakatan_komite_${randNum}.m4a`,
          size: '1.1 MB',
        });
        setEvidenceDeskripsi('Rekaman suara konfirmasi alokasi belanja alkes dari komite pengadaan');
        break;
      case 'follow_up':
        setEvidenceFile({
          name: `rekaman_panggilan_negosiasi_${randNum}.m4a`,
          size: '680 KB',
        });
        setEvidenceDeskripsi('Rekaman telepon konfirmasi penawaran harga dan tanggapan diskon');
        break;
      case 'quotation':
        setEvidenceFile({
          name: `surat_penawaran_resmi_signed_${randNum}.pdf`,
          size: '780 KB',
        });
        setEvidenceDeskripsi('Surat penawaran harga resmi bernomor dan berstempel AB Medical');
        break;
      case 'po':
        setEvidenceFile({
          name: `scan_purchase_order_faskes_${randNum}.pdf`,
          size: '1.2 MB',
        });
        setEvidenceDeskripsi('Scan dokumen Purchase Order resmi berstempel basah dari Faskes');
        break;
      case 'revenue':
        setEvidenceFile({
          name: `bukti_transfer_lunas_mandiri_${randNum}.pdf`,
          size: '640 KB',
        });
        setEvidenceDeskripsi('Bukti transfer pelunasan 100% dan Berita Acara Serah Terima (BAST)');
        break;
    }

    if (mode === 'create') {
      const defaultPelanggan = pelangganList[0];
      if (defaultPelanggan) {
        setSelectedPelangganId(defaultPelanggan.id_pelanggan);
        const pic = defaultPelanggan.kontak_list?.[0];
        setPicDitemui(pic?.nama || 'dr. Hendra Sp.PD-KGH');
        setJabatanPic(pic?.jabatan || 'Kepala Pengadaan');
        setNoTelpPic(pic?.no_telp || '0812-3456-7890');
      }

      setJudulProspek('');
      setPrioritas('sedang');
      setEstimasiNilai('350.000.000');
      setTargetClosing(new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10));
      setJadwalFollowUp(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

      switch (targetStage.jenis_tahap) {
        case 'visit':
          setCatatan('Kunjungan perdana pengenalan unit alkes dan verifikasi ruangan faskes.');
          break;
        case 'kebutuhan':
          setJenisAlkes('Mesin Hemodialisa & Sistem RO');
          setJumlahUnit('2');
          setSpesifikasiKebutuhan('Kebutuhan alkes ruang rawat intensif dengan sertifikasi kalibrasi BPFK.');
          setEstimasiBudget('450.000.000');
          setCatatan('Asesmen awal kebutuhan faskes untuk semester berjalan.');
          break;
        case 'opportunity':
          setAnalisisKompetitor('Vendor lain mengajukan alat refurbished, kita tawarkan garansi resmi.');
          setActionPlan('Jadwalkan audiensi bersama direksi dan tim perawat.');
          setCatatan('Peluang alokasi belanja modal faskes disetujui.');
          break;
        case 'follow_up':
          setCatatan('Follow up respon penawaran harga dan simulasi margin diskon.');
          break;
        case 'quotation':
          setNoQuotation(`QUO/ABM/2026/10/${randNum}`);
          setNilaiQuotation('350.000.000');
          setCatatan('Surat penawaran resmi diterbitkan sesuai katalog harga alkes 2026.');
          break;
        case 'po':
          setNoPo(`PO-RS-2026-${randNum}`);
          setNominalPo('350.000.000');
          setTargetPengiriman(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
          setCatatan('Purchase order resmi diterbitkan faskes.');
          break;
        case 'revenue':
          setStatusClosing('won');
          setRealisasiRevenue('350.000.000');
          setNoInvoiceBast(`INV/ABM/2026/11/${randNum} & BAST-${randNum}`);
          setCatatan('Prospek berhasil closing dan pembayaran telah lunas.');
          break;
      }
      return;
    }

    // Move Mode: Prefill from existing ticket
    if (!ticket) return;

    setPicDitemui(ticket.nama_pic || '');
    setJabatanPic(ticket.jabatan_pic || '');
    setNoTelpPic(ticket.no_telp_pic || '');
    setPrioritas(ticket.prioritas || 'sedang');
    setEstimasiNilai(ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '');
    setTargetClosing(
      typeof ticket.estimasi_closing === 'string'
        ? ticket.estimasi_closing.slice(0, 10)
        : '',
    );
    setJadwalFollowUp(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

    const codeNum = ticket.kode_tiket.replace(/\D/g, '') || '01';
    switch (targetStage.jenis_tahap) {
      case 'visit':
        setCatatan(
          `Kunjungan lapangan ke ${ticket.nama_faskes}. Observasi ruangan dan diskusi dengan ${ticket.nama_pic || 'PIC'}.`,
        );
        break;
      case 'kebutuhan':
        setJenisAlkes(ticket.judul || 'Unit Alat Medis');
        setJumlahUnit('2');
        setSpesifikasiKebutuhan(
          ticket.kebutuhan_pelanggan ||
            'Membutuhkan spesifikasi terbaru dengan integrasi gas medis sentral dan garansi after-sales.',
        );
        setEstimasiBudget(ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '');
        setCatatan(
          `Melakukan asesmen mendalam kebutuhan ${ticket.nama_faskes}. Tim teknis RS memerlukan spesifikasi lengkap.`,
        );
        break;
      case 'opportunity':
        setAnalisisKompetitor('Vendor kompetitor mengajukan tipe lama, kita unggul di kecepatan kalibrasi.');
        setActionPlan('Jadwalkan presentasi langsung dengan Direksi & Komite Pengadaan Alkes.');
        setCatatan(`Peluang closing sangat prospektif. Klien memiliki alokasi anggaran belanja semester berjalan.`);
        break;
      case 'follow_up':
        setCatatan(
          `Diskusi lanjutan dengan ${ticket.nama_pic || 'PIC'}. Membahas kesiapan ruangan dan timeline penawaran harga.`,
        );
        break;
      case 'quotation':
        setNoQuotation(`QUO/ABM/2026/10/${codeNum}`);
        setNilaiQuotation(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '500.000.000',
        );
        setCatatan(
          `Surat penawaran resmi diterbitkan dan dikirimkan ke pihak manajemen ${ticket.nama_faskes}. Sudah termasuk PPN 11% & garansi 1 tahun.`,
        );
        break;
      case 'po':
        setNoPo(`PO-${ticket.nama_faskes.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-2026-${codeNum}`);
        setNominalPo(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '500.000.000',
        );
        setTargetPengiriman(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
        setCatatan(`Purchase Order resmi terbit dan telah divalidasi oleh Bagian Pengadaan RS.`);
        break;
      case 'revenue':
        setStatusClosing('won');
        setRealisasiRevenue(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '500.000.000',
        );
        setNoInvoiceBast(`INV/ABM/2026/11/${codeNum} & BAST-${codeNum}`);
        setCatatan(`Unit telah diterima, uji fungsi berhasil, dan pembayaran lunas 100%. Tiket berhasil closing (Won).`);
        break;
    }
  }, [open, mode, ticket, targetStage, pelangganList]);

  if (!targetStage) return null;

  const handleClose = () => {
    onCancelMove?.();
    onOpenChange(false);
  };

  // Validate mandatory evidence
  const isEvidenceValid = (): boolean => {
    return Boolean(evidenceFile && evidenceDeskripsi.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check mandatory evidence
    if (!isEvidenceValid()) {
      setEvidenceError(true);
      return;
    }

    setEvidenceError(false);

    const parsedNilai =
      Number(
        (stageType === 'quotation'
          ? nilaiQuotation
          : stageType === 'po'
            ? nominalPo
            : stageType === 'revenue'
              ? realisasiRevenue
              : estimasiNilai
        ).replace(/\D/g, ''),
      ) || 100_000_000;

    const detectedTipe = evidenceFile ? detectFileType(evidenceFile.name) : 'dokumen';
    const currentEvidence: EvidenceItem = {
      tipe: detectedTipe,
      nama_file: evidenceFile?.name,
      ukuran_file: evidenceFile?.size,
      deskripsi: evidenceDeskripsi.trim(),
      url_preview: evidenceFile?.url,
      jenis: detectedTipe,
      file_size: evidenceFile?.size,
      catatan: evidenceDeskripsi.trim(),
    };

    // IF CREATE MODE
    if (mode === 'create') {
      const selectedPelanggan =
        pelangganList.find((p) => p.id_pelanggan === selectedPelangganId) ?? pelangganList[0];
      const randomNum = Math.floor(100 + Math.random() * 900);
      const newId = `tkt-0${randomNum}`;
      const finalJudul =
        judulProspek.trim() ||
        (stageType === 'kebutuhan' && jenisAlkes
          ? jenisAlkes
          : `Pengadaan Alkes #${randomNum}`);

      const newActivity: AktivitasWithDetails = {
        id_aktivitas: `akt-${Date.now()}`,
        id_user: 'usr-1',
        id_tiket: newId,
        tanggal: new Date().toISOString(),
        waktu_label: `Hari ini • ${jamAktivitas} WIB`,
        nama_petugas: 'Rina Putri',
        pic_ditemui: picDitemui || 'dr. Hendra Sp.PD-KGH',
        jenis_kegiatan:
          stageType === 'visit'
            ? 'kunjungan'
            : stageType === 'follow_up'
              ? 'follow_up'
              : stageType === 'quotation'
                ? 'penawaran'
                : 'closing',
        catatan:
          catatan.trim() ||
          `Card baru dibuat di tahap ${targetStage.nama_tahap} oleh Rina Putri.`,
        jadwal_follow_up: jadwalFollowUp || null,
        evidence: currentEvidence,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newTicket: TiketWithDetails = {
        id_tiket: newId,
        kode_tiket: `TKT-0${randomNum}`,
        id_pelanggan: selectedPelanggan?.id_pelanggan ?? 'plg-1',
        id_user: 'usr-1',
        id_tahap: targetStage.id_tahap,
        id_kontak: selectedPelanggan?.kontak_list?.[0]?.id_kontak ?? null,
        judul: finalJudul,
        nama_faskes: selectedPelanggan?.nama_faskes ?? 'RS Harapan Sehat',
        nama_pic: picDitemui || 'dr. Hendra Sp.PD-KGH',
        jabatan_pic: jabatanPic || 'Kepala Pengadaan',
        no_telp_pic: noTelpPic || '0812-3456-7890',
        nama_sales: 'Rina Putri',
        inisial_sales: 'RP',
        estimasi_nilai: parsedNilai,
        estimasi_closing:
          targetClosing ||
          new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
        closing_short_label: targetClosing ? targetClosing.slice(5) : '15 Nov',
        closing_full_label: targetClosing || '15 Nov 2026',
        status: stageType === 'revenue' ? statusClosing : 'open',
        kebutuhan_pelanggan: spesifikasiKebutuhan || finalJudul,
        prioritas,
        posisi: 1,
        tanggal_penawaran_awal: stageType === 'quotation' ? tanggalAktivitas : null,
        tanggal_closing: stageType === 'revenue' ? tanggalAktivitas : null,
        alasan_lost: null,
        file_penawaran:
          stageType === 'quotation' && evidenceFile
            ? evidenceFile
            : stageType === 'po' && evidenceFile
              ? evidenceFile
              : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

      onCreateTicket?.(newTicket);
      onOpenChange(false);
      return;
    }

    // IF MOVE MODE
    if (!ticket) return;

    const ticketUpdates: Partial<TiketWithDetails> = {
      prioritas: ticket.prioritas, // Prioritas tidak bisa diganti saat pindah tiket
      estimasi_nilai: parsedNilai,
    };

    if (targetClosing) {
      ticketUpdates.estimasi_closing = targetClosing;
    }

    if (stageType === 'revenue') {
      ticketUpdates.status = statusClosing;
      ticketUpdates.tanggal_closing = tanggalAktivitas;
    }

    if (stageType === 'kebutuhan' && spesifikasiKebutuhan) {
      ticketUpdates.kebutuhan_pelanggan = spesifikasiKebutuhan;
    }

    if (stageType === 'quotation' && evidenceFile) {
      ticketUpdates.file_penawaran = evidenceFile;
      ticketUpdates.tanggal_penawaran_awal = tanggalAktivitas;
    }

    if (stageType === 'po' && evidenceFile) {
      ticketUpdates.file_penawaran = evidenceFile;
    }

    const activityNote =
      catatan.trim() ||
      `Perpindahan tahap ke ${targetStage.nama_tahap} oleh ${ticket.nama_sales || 'Sales'}.`;

    const newActivity: AktivitasWithDetails = {
      id_aktivitas: `akt-${Date.now()}`,
      id_user: ticket.id_user || 'usr-1',
      id_tiket: ticket.id_tiket,
      tanggal: new Date().toISOString(),
      waktu_label: `Hari ini • ${jamAktivitas} WIB`,
      nama_petugas: ticket.nama_sales || 'Rina Putri',
      pic_ditemui: picDitemui || ticket.nama_pic || 'dr. Hendra Sp.PD-KGH',
      jenis_kegiatan:
        stageType === 'visit'
          ? 'kunjungan'
          : stageType === 'follow_up'
            ? 'follow_up'
            : stageType === 'quotation'
              ? 'penawaran'
              : 'closing',
      catatan: activityNote,
      jadwal_follow_up: jadwalFollowUp || null,
      evidence: currentEvidence,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onConfirmMove?.({
      id_tiket: ticket.id_tiket,
      fromStageId: fromStage?.id_tahap ?? ticket.id_tahap,
      toStageId: targetStage.id_tahap,
      targetIndex,
      ticketUpdates,
      activity: newActivity,
    });

    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-xl max-h-[92dvh] flex flex-col rounded-t-[28px] bg-card border-t border-border shadow-2xl overflow-hidden'>
        {/* Drawer Header */}
        <DrawerHeader className='shrink-0 px-4 sm:px-6 pt-2.5 pb-3 text-left border-b border-border/60 bg-card'>
          <div className='flex items-center justify-between gap-2 mb-1.5'>
            {mode === 'move' ? (
              <div className='flex items-center gap-2'>
                {fromStage && (
                  <Badge
                    variant='outline'
                    className='h-6 gap-1.5 rounded-full border-border bg-muted/40 px-2.5 text-[11px] font-medium text-muted-foreground'
                  >
                    <span
                      className='size-2 rounded-full'
                      style={{ backgroundColor: fromStage.dotColor }}
                    />
                    {fromStage.nama_tahap}
                  </Badge>
                )}

                <ArrowRight className='size-3.5 text-muted-foreground' />

                <Badge
                  className='h-6 gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-white shadow-xs'
                  style={{ backgroundColor: targetStage.dotColor }}
                >
                  <span className='size-2 rounded-full bg-white/80' />
                  {targetStage.nama_tahap}
                </Badge>
              </div>
            ) : (
              <Badge
                className='h-6 gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-white shadow-xs'
                style={{ backgroundColor: targetStage.dotColor }}
              >
                <Plus className='size-3' />
                Tambah Card: {targetStage.nama_tahap}
              </Badge>
            )}

            <button
              type='button'
              onClick={handleClose}
              className='rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
              aria-label='Tutup'
            >
              <X className='size-4' />
            </button>
          </div>

          <DrawerTitle className='text-base font-bold text-foreground'>
            {mode === 'move'
              ? `Update Aktivitas: ${targetStage.nama_tahap}`
              : `Tambah Card Baru di Tahap ${targetStage.nama_tahap}`}
          </DrawerTitle>

          <DrawerDescription className='text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5'>
            {mode === 'move' && ticket ? (
              <span className='flex flex-wrap items-center gap-1.5'>
                <span className='font-semibold text-foreground/80'>{ticket.kode_tiket}</span>
                <span>·</span>
                <span className='truncate max-w-[180px]'>{ticket.judul}</span>
                <span>·</span>
                <span className='text-primary font-medium'>{ticket.nama_faskes}</span>
                <span>·</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                    PRIORITY_CONFIG[ticket.prioritas]?.badgeClass || 'bg-muted text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      PRIORITY_CONFIG[ticket.prioritas]?.dotClass,
                    )}
                  />
                  {PRIORITY_CONFIG[ticket.prioritas]?.label || ticket.prioritas}
                </span>
              </span>
            ) : (
              <span>Lengkapi data prospek dan lampiran bukti aktivitas sesuai tahap {targetStage.nama_tahap}.</span>
            )}
          </DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className='flex flex-1 min-h-0 flex-col overflow-hidden'>
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4'>
            {/* EVIDENCE ERROR BANNER */}
            {evidenceError && (
              <div className='flex items-start gap-2.5 rounded-2xl border border-rose-300 bg-rose-50 p-3 text-rose-800 animate-in fade-in slide-in-from-top-2'>
                <ShieldAlert className='size-4 shrink-0 mt-0.5 text-rose-600' />
                <div className='flex flex-col gap-0.5 text-xs'>
                  <span className='font-bold text-rose-900'>File Bukti Aktivitas Belum Dilampirkan</span>
                  <span>
                    Mohon pilih/unggah file bukti aktivitas dan isi keterangan sebelum menyimpan.
                  </span>
                </div>
              </div>
            )}

            {/* CREATE MODE: Basic Prospek Info Header */}
            {mode === 'create' && (
              <div className='flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3.5'>
                <div className='flex items-center gap-2 text-xs font-bold text-primary'>
                  <Building2 className='size-4' />
                  Informasi Prospek & Klien
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Fasilitas Kesehatan (Faskes) <span className='text-rose-500'>*</span>
                  </Label>
                  <NativeSelect
                    value={selectedPelangganId}
                    onChange={(e) => handleFaskesChange(e.target.value)}
                    className='h-10 rounded-xl text-xs bg-white'
                    required
                  >
                    {pelangganList.map((p) => (
                      <option key={p.id_pelanggan} value={p.id_pelanggan}>
                        {p.nama_faskes} ({p.tipe_faskes})
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Judul Prospek / Pengadaan <span className='text-rose-500'>*</span>
                  </Label>
                  <Input
                    value={judulProspek}
                    onChange={(e) => setJudulProspek(e.target.value)}
                    placeholder='e.g. Pengadaan Mesin Hemodialisa 6 Unit'
                    className='h-10 rounded-xl text-xs bg-white'
                    required
                  />
                </div>
              </div>
            )}

            {/* STAGE SPECIFIC FORMS */}

            {/* 1. VISIT FORM */}
            {stageType === 'visit' && (
              <div className='flex flex-col gap-3.5'>
                <div className='rounded-2xl border border-blue-200 bg-blue-50/70 p-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white'>
                        <MapPin className='size-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-blue-900'>
                          Check-in Lokasi Kunjungan
                        </span>
                        <span className='text-[11px] text-blue-700'>
                          Koordinat GPS: {koordinatGps}
                        </span>
                      </div>
                    </div>
                    <Badge className='bg-emerald-600 text-white text-[10px] h-5 rounded-full px-2'>
                      {statusRadius}
                    </Badge>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Tanggal Kunjungan <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='date'
                      value={tanggalAktivitas}
                      onChange={(e) => setTanggalAktivitas(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Jam Kunjungan <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='time'
                      value={jamAktivitas}
                      onChange={(e) => setJamAktivitas(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      PIC yang Ditemui <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      value={picDitemui}
                      onChange={(e) => setPicDitemui(e.target.value)}
                      placeholder='e.g. dr. Hendra Sp.PD'
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>Jabatan PIC</Label>
                    <Input
                      value={jabatanPic}
                      onChange={(e) => setJabatanPic(e.target.value)}
                      placeholder='e.g. Kepala Instalasi'
                      className='h-10 rounded-xl text-xs'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Hasil & Catatan Kunjungan Lapangan <span className='text-rose-500'>*</span>
                  </Label>
                  <Textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder='Tuliskan hasil diskusi kunjungan, respon dokter/PIC, dan pengamatan ruangan faskes...'
                    className='rounded-xl text-xs'
                    required
                  />
                </div>
              </div>
            )}

            {/* 2. KEBUTUHAN FORM */}
            {stageType === 'kebutuhan' && (
              <div className='flex flex-col gap-3.5'>
                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Produk / Alkes yang Dibutuhkan <span className='text-rose-500'>*</span>
                  </Label>
                  <Input
                    value={jenisAlkes}
                    onChange={(e) => setJenisAlkes(e.target.value)}
                    placeholder='e.g. Mesin Hemodialisa, USG 4D, Ventilator ICU'
                    className='h-10 rounded-xl text-xs'
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Jumlah Unit <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='number'
                      min={1}
                      value={jumlahUnit}
                      onChange={(e) => setJumlahUnit(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Urgensi Pengadaan <span className='text-rose-500'>*</span>
                    </Label>
                    <NativeSelect
                      value={urgensiPengadaan}
                      onChange={(e) => setUrgensiPengadaan(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    >
                      <option value='Mendesak'>Mendesak (Bulan Ini)</option>
                      <option value='Rutin'>Rutin / Semester Berjalan</option>
                      <option value='Tahun Depan'>Tahun Anggaran Depan</option>
                    </NativeSelect>
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>Perkiraan Anggaran Klien (Budget Rp)</Label>
                  <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                    <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-muted-foreground'>
                      Rp
                    </InputGroupAddon>
                    <InputGroupInput
                      value={estimasiBudget}
                      onChange={(e) => setEstimasiBudget(formatNumberInput(e.target.value))}
                      placeholder='0'
                      className='text-xs'
                    />
                  </InputGroup>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Spesifikasi & Kebutuhan Teknis Ruangan <span className='text-rose-500'>*</span>
                  </Label>
                  <Textarea
                    rows={2}
                    value={spesifikasiKebutuhan}
                    onChange={(e) => setSpesifikasiKebutuhan(e.target.value)}
                    placeholder='Rincian kebutuhan ruangan, kelistrikan, sistem RO, sertifikat BPFK, aksesoris tambahan...'
                    className='rounded-xl text-xs'
                    required
                  />
                </div>
              </div>
            )}

            {/* 3. OPPORTUNITY FORM */}
            {stageType === 'opportunity' && (
              <div className='flex flex-col gap-3.5'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Estimasi Nilai Closing (Rp) <span className='text-rose-500'>*</span>
                    </Label>
                    <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                      <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-primary'>
                        Rp
                      </InputGroupAddon>
                      <InputGroupInput
                        value={estimasiNilai}
                        onChange={(e) => setEstimasiNilai(formatNumberInput(e.target.value))}
                        placeholder='0'
                        className='text-xs font-semibold'
                        required
                      />
                    </InputGroup>
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Target Closing <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='date'
                      value={targetClosing}
                      onChange={(e) => setTargetClosing(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Tingkat Probabilitas (Win Rate) <span className='text-rose-500'>*</span>
                  </Label>
                  <div className='grid grid-cols-4 gap-2'>
                    {['25%', '50%', '75%', '90%'].map((rate) => (
                      <Button
                        key={rate}
                        type='button'
                        variant='outline'
                        onClick={() => setProbabilitas(rate)}
                        className={cn(
                          'h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                          probabilitas === rate
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground',
                        )}
                      >
                        {rate}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>Rencana Aksi & Analisis Pesaing</Label>
                  <Input
                    value={analisisKompetitor}
                    onChange={(e) => setAnalisisKompetitor(e.target.value)}
                    placeholder='Kompetitor yang masuk dan keunggulan teknologi kita...'
                    className='h-10 rounded-xl text-xs'
                  />
                </div>
              </div>
            )}

            {/* 4. FOLLOW UP FORM */}
            {stageType === 'follow_up' && (
              <div className='flex flex-col gap-3.5'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Media Komunikasi <span className='text-rose-500'>*</span>
                    </Label>
                    <NativeSelect
                      value={mediaKomunikasi}
                      onChange={(e) => setMediaKomunikasi(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    >
                      <option value='WhatsApp'>WhatsApp Messenger</option>
                      <option value='Telepon'>Panggilan Telepon</option>
                      <option value='Tatap Muka'>Pertemuan Langsung</option>
                      <option value='Online'>Zoom / Google Meet</option>
                    </NativeSelect>
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Respon Klien <span className='text-rose-500'>*</span>
                    </Label>
                    <NativeSelect
                      value={responKlien}
                      onChange={(e) => setResponKlien(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    >
                      <option value='Tertarik & Minta Simulasi'>Tertarik & Minta Simulasi</option>
                      <option value='Menunggu Persetujuan Direksi'>Menunggu Persetujuan Direksi</option>
                      <option value='Meminta Diskon Tambahan'>Meminta Diskon Tambahan</option>
                      <option value='Sedang Membandingkan Vendor'>Sedang Membandingkan Vendor</option>
                    </NativeSelect>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Jadwal Follow Up Berikutnya <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='date'
                      value={jadwalFollowUp}
                      onChange={(e) => setJadwalFollowUp(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>Penyesuaian Nilai (Rp)</Label>
                    <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                      <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-muted-foreground'>
                        Rp
                      </InputGroupAddon>
                      <InputGroupInput
                        value={estimasiNilai}
                        onChange={(e) => setEstimasiNilai(formatNumberInput(e.target.value))}
                        placeholder='0'
                        className='text-xs'
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            )}

            {/* 5. QUOTATION FORM */}
            {stageType === 'quotation' && (
              <div className='flex flex-col gap-3.5'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Nomor Penawaran (Quotation) <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      value={noQuotation}
                      onChange={(e) => setNoQuotation(e.target.value)}
                      placeholder='QUO/ABM/2026/...'
                      className='h-10 rounded-xl text-xs font-semibold'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Total Nilai Penawaran (Rp) <span className='text-rose-500'>*</span>
                    </Label>
                    <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                      <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-primary'>
                        Rp
                      </InputGroupAddon>
                      <InputGroupInput
                        value={nilaiQuotation}
                        onChange={(e) => setNilaiQuotation(formatNumberInput(e.target.value))}
                        placeholder='0'
                        className='text-xs font-semibold'
                        required
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Masa Berlaku Penawaran <span className='text-rose-500'>*</span>
                    </Label>
                    <NativeSelect
                      value={masaBerlaku}
                      onChange={(e) => setMasaBerlaku(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    >
                      <option value='14 Hari Kalender'>14 Hari Kalender</option>
                      <option value='30 Hari Kalender'>30 Hari Kalender</option>
                      <option value='60 Hari Kalender'>60 Hari Kalender</option>
                    </NativeSelect>
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>Revisi Penawaran Ke-</Label>
                    <Input
                      type='number'
                      min={1}
                      value={revisiKe}
                      onChange={(e) => setRevisiKe(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. PO FORM */}
            {stageType === 'po' && (
              <div className='flex flex-col gap-3.5'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Nomor Purchase Order (PO) <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      value={noPo}
                      onChange={(e) => setNoPo(e.target.value)}
                      placeholder='PO-RS-2026-...'
                      className='h-10 rounded-xl text-xs font-semibold'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Nominal Total PO (Rp) <span className='text-rose-500'>*</span>
                    </Label>
                    <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                      <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-sky-600'>
                        Rp
                      </InputGroupAddon>
                      <InputGroupInput
                        value={nominalPo}
                        onChange={(e) => setNominalPo(formatNumberInput(e.target.value))}
                        placeholder='0'
                        className='text-xs font-semibold'
                        required
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Target Tanggal Pengiriman Unit <span className='text-rose-500'>*</span>
                    </Label>
                    <Input
                      type='date'
                      value={targetPengiriman}
                      onChange={(e) => setTargetPengiriman(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Termin Pembayaran <span className='text-rose-500'>*</span>
                    </Label>
                    <NativeSelect
                      value={terminPembayaran}
                      onChange={(e) => setTerminPembayaran(e.target.value)}
                      className='h-10 rounded-xl text-xs'
                    >
                      <option value='DP 30% - Pelunasan 70%'>DP 30% - Pelunasan 70%</option>
                      <option value='Net 30 Hari'>Net 30 Hari Setelah BAST</option>
                      <option value='Net 14 Hari'>Net 14 Hari</option>
                      <option value='Tunai 100%'>Tunai 100% Sebelum Kirim</option>
                    </NativeSelect>
                  </div>
                </div>
              </div>
            )}

            {/* 7. REVENUE FORM */}
            {stageType === 'revenue' && (
              <div className='flex flex-col gap-3.5'>
                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Hasil Penjualan Akhir <span className='text-rose-500'>*</span>
                  </Label>
                  <div className='grid grid-cols-2 gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setStatusClosing('won')}
                      className={cn(
                        'h-11 rounded-xl text-xs font-bold gap-2 cursor-pointer',
                        statusClosing === 'won'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      <CheckCircle2 className='size-4 text-emerald-600' />
                      Won (Berhasil Closing)
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setStatusClosing('lost')}
                      className={cn(
                        'h-11 rounded-xl text-xs font-bold gap-2 cursor-pointer',
                        statusClosing === 'lost'
                          ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      <X className='size-4 text-rose-600' />
                      Lost (Batal / Gagal)
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>
                      Realisasi Nilai Revenue (Rp) <span className='text-rose-500'>*</span>
                    </Label>
                    <InputGroup className='h-10 rounded-xl border-border bg-card shadow-none'>
                      <InputGroupAddon align='inline-start' className='pl-3 text-xs font-bold text-emerald-600'>
                        Rp
                      </InputGroupAddon>
                      <InputGroupInput
                        value={realisasiRevenue}
                        onChange={(e) => setRealisasiRevenue(formatNumberInput(e.target.value))}
                        placeholder='0'
                        className='text-xs font-bold text-emerald-700'
                        required
                      />
                    </InputGroup>
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs font-semibold'>No. Invoice & BAST</Label>
                    <Input
                      value={noInvoiceBast}
                      onChange={(e) => setNoInvoiceBast(e.target.value)}
                      placeholder='INV/ABM/... & BAST-...'
                      className='h-10 rounded-xl text-xs'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label className='text-xs font-semibold'>
                    Metode Pembayaran <span className='text-rose-500'>*</span>
                  </Label>
                  <NativeSelect
                    value={metodePembayaran}
                    onChange={(e) => setMetodePembayaran(e.target.value)}
                    className='h-10 rounded-xl text-xs'
                  >
                    <option value='Transfer Bank Mandiri'>Transfer Bank Mandiri PT AB Medical</option>
                    <option value='BCA Virtual Account'>BCA Virtual Account</option>
                    <option value='Bilyet Giro'>Bilyet Giro / Cek Bank</option>
                  </NativeSelect>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MANDATORY EVIDENCE SECTION (APPLIES TO ALL ACTIVITIES) */}
            {/* ======================================================== */}
            <div
              className={cn(
                'flex flex-col gap-3 rounded-2xl border p-4 transition-all',
                evidenceError
                  ? 'border-2 border-rose-500 bg-rose-50/50 ring-2 ring-rose-200'
                  : 'border-border/80 bg-slate-50/70',
              )}
            >
              {/* Evidence Section Header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <ShieldCheck className='size-4' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-foreground'>
                      File Bukti Aktivitas <span className='text-rose-500'>*</span>
                    </span>
                    <span className='text-[10px] text-muted-foreground'>
                      Unggah file foto, rekaman suara audio, dokumen PDF/Word, atau berkas catatan
                    </span>
                  </div>
                </div>
              </div>

              {/* Hidden Real File Input */}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
                onChange={handleFileInputChange}
                className='hidden'
              />

              {/* Unified File Upload Zone / Attached File Card */}
              {evidenceFile ? (
                <div className='flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-white p-3 shadow-xs'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                      {detectFileType(evidenceFile.name) === 'foto' ? (
                        <Camera className='size-5' />
                      ) : detectFileType(evidenceFile.name) === 'audio' ? (
                        <Mic className='size-5' />
                      ) : detectFileType(evidenceFile.name) === 'teks' ? (
                        <FileText className='size-5' />
                      ) : (
                        <File className='size-5' />
                      )}
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='text-xs font-semibold text-foreground truncate'>
                        {evidenceFile.name}
                      </span>
                      <div className='flex items-center gap-2 text-[10px] text-muted-foreground'>
                        <span>{evidenceFile.size}</span>
                        <span>•</span>
                        <span className='capitalize font-medium text-primary'>
                          {detectFileType(evidenceFile.name) === 'foto'
                            ? 'Foto / Gambar'
                            : detectFileType(evidenceFile.name) === 'audio'
                              ? 'Rekaman Audio'
                              : detectFileType(evidenceFile.name) === 'teks'
                                ? 'Catatan Teks'
                                : 'Dokumen Berkas'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => {
                      setEvidenceFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className='rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer shrink-0'
                    title='Hapus file'
                  >
                    <X className='size-4' />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all',
                    evidenceError && !evidenceFile
                      ? 'border-rose-400 bg-rose-50/60'
                      : 'border-border/80 bg-white hover:border-primary/50 hover:bg-primary/5',
                  )}
                >
                  <div className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform'>
                    <UploadCloud className='size-5' />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-semibold text-foreground'>
                      Pilih atau Unggah File Bukti
                    </span>
                    <span className='text-[10px] text-muted-foreground'>
                      Mendukung foto, audio rekaman, dokumen PDF/Word, atau file catatan
                    </span>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='mt-1 h-8 rounded-lg text-[11px] font-semibold gap-1.5 pointer-events-none'
                  >
                    <Paperclip className='size-3.5' />
                    Pilih File dari Perangkat
                  </Button>
                </div>
              )}

              {/* Quick sample file presets */}
              <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                <span className='text-[10px] text-muted-foreground'>Contoh cepat:</span>
                <button
                  type='button'
                  onClick={() => {
                    setEvidenceFile({
                      name: `foto_kunjungan_${stageType}_${Date.now()}.jpg`,
                      size: '1.4 MB',
                    });
                    setEvidenceError(false);
                  }}
                  className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                >
                  + Foto
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setEvidenceFile({
                      name: `rekaman_suara_${stageType}_${Date.now()}.m4a`,
                      size: '920 KB',
                    });
                    setEvidenceError(false);
                  }}
                  className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                >
                  + Audio
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setEvidenceFile({
                      name: `dokumen_${stageType}_resmi_${Date.now()}.pdf`,
                      size: '750 KB',
                    });
                    setEvidenceError(false);
                  }}
                  className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                >
                  + Dokumen PDF
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setEvidenceFile({
                      name: `catatan_notulen_${stageType}_${Date.now()}.txt`,
                      size: '35 KB',
                    });
                    setEvidenceError(false);
                  }}
                  className='rounded-md border border-border/60 bg-white px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                >
                  + Catatan Teks
                </button>
              </div>

              {/* Keterangan Deskripsi Bukti */}
              <div className='flex flex-col gap-1.5 pt-1 border-t border-border/60'>
                <Label className='text-xs font-semibold text-foreground'>
                  Keterangan Bukti <span className='text-rose-500'>*</span>
                </Label>
                <Input
                  value={evidenceDeskripsi}
                  onChange={(e) => {
                    setEvidenceDeskripsi(e.target.value);
                    if (e.target.value.trim()) setEvidenceError(false);
                  }}
                  placeholder='Tuliskan ringkasan bukti verifikasi (e.g. Foto serah terima / Rekaman konfirmasi / Dokumen PO basah)'
                  className={cn(
                    'h-10 rounded-xl text-xs bg-white',
                    evidenceError && !evidenceDeskripsi.trim() && 'border-rose-400 focus-visible:ring-rose-400',
                  )}
                  required
                />
              </div>
            </div>

            {/* Priority Picker: Only shown when creating a new ticket/card in any activity */}
            {mode === 'create' && (
              <div className='flex flex-col gap-2 pt-1 border-t border-border/60'>
                <Label className='text-xs font-semibold'>
                  Prioritas Tiket <span className='text-rose-500'>*</span>
                </Label>
                <div className='grid grid-cols-3 gap-2'>
                  {(['rendah', 'sedang', 'tinggi'] as TiketPrioritas[]).map((p) => {
                    const cfg = PRIORITY_CONFIG[p];
                    const isSelected = prioritas === p;
                    return (
                      <Button
                        key={p}
                        type='button'
                        variant='outline'
                        onClick={() => setPrioritas(p)}
                        className={cn(
                          'h-9 rounded-xl text-xs font-medium gap-1.5 transition-all cursor-pointer',
                          isSelected ? cfg.activeClass : 'border-border text-muted-foreground',
                        )}
                      >
                        <span className={cn('size-2 rounded-full', cfg.dotClass)} />
                        {cfg.formLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions (Always Pinned & Fully Visible) */}
          <DrawerFooter className='shrink-0 z-10 flex flex-row items-center justify-end gap-2 px-4 sm:px-6 py-3 border-t border-border/70 bg-card/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-4 sm:pb-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='h-10 shrink-0 rounded-xl px-4 text-xs font-semibold cursor-pointer'
            >
              Batal
            </Button>
            <Button
              type='submit'
              className='h-10 flex-1 sm:flex-none gap-2 rounded-xl px-4 sm:px-5 text-xs font-semibold text-white shadow-md cursor-pointer'
              style={{ backgroundColor: targetStage.dotColor }}
            >
              <CheckCircle2 className='size-4 shrink-0' />
              <span className='truncate'>
                {mode === 'create' ? 'Tambah Card Baru' : 'Simpan & Pindahkan Tiket'}
              </span>
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
