'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Plus, ShieldAlert, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePelangganStore } from '@/lib/pelanggan-store';
import {
  AktivitasWithDetails,
  TiketPrioritas,
  TiketWithDetails,
} from '@/types/ticket.types';
import { INITIAL_KANBAN_STAGES, PRIORITY_CONFIG } from '@/constants/kanban-constants';
import { cn } from '@/lib/utils';
import { JenisTahap } from '@/types/kanban-stage.types';

// Modular Subcomponents & Types
import {
  EvidenceFileState,
  StageActivityDrawerProps,
  StageDrawerMode,
  detectFileType,
  StageFormCreateHeader,
  StageFormEvidence,
  StageFormPriority,
  StageFormVisit,
  StageFormKebutuhan,
  StageFormOpportunity,
  StageFormFollowUp,
  StageFormQuotation,
  StageFormPo,
  StageFormRevenue,
} from './stage-drawer';

export type { StageDrawerMode, StageActivityDrawerProps };

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
  const [waktuAktivitas, setWaktuAktivitas] = React.useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const tanggalAktivitas = waktuAktivitas.slice(0, 10);
  const jamAktivitas = waktuAktivitas.slice(11, 16);
  const [prioritas, setPrioritas] = React.useState<TiketPrioritas>('sedang');
  const [catatan, setCatatan] = React.useState('');

  // Unified Evidence File Upload state
  const [evidenceFile, setEvidenceFile] = React.useState<EvidenceFileState | null>(null);
  const [evidenceError, setEvidenceError] = React.useState(false);

  // Visit specifics
  const [koordinatGps] = React.useState('-6.2088, 106.8456');
  const [statusRadius] = React.useState('Dalam Radius (38m)');

  // Relasi Data Client & Kontak PIC
  const currentPelanggan = React.useMemo(() => {
    if (mode === 'create') {
      return pelangganList.find((p) => p.id_pelanggan === selectedPelangganId) || pelangganList[0];
    }
    return (
      pelangganList.find(
        (p) =>
          p.id_pelanggan === ticket?.id_pelanggan ||
          p.nama_faskes.toLowerCase() === ticket?.nama_faskes.toLowerCase(),
      ) || null
    );
  }, [mode, selectedPelangganId, ticket, pelangganList]);

  const kontakList = React.useMemo(() => {
    return currentPelanggan?.kontak_list || [];
  }, [currentPelanggan]);

  const handlePicSelect = (nama: string, jabatan: string, noTelp?: string) => {
    setPicDitemui(nama);
    setJabatanPic(jabatan);
    if (noTelp) setNoTelpPic(noTelp);
  };

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
        break;
      case 'kebutuhan':
        setEvidenceFile({
          name: `form_survei_kebutuhan_alkes_${randNum}.pdf`,
          size: '860 KB',
        });
        break;
      case 'opportunity':
        setEvidenceFile({
          name: `voice_note_kesepakatan_komite_${randNum}.m4a`,
          size: '1.1 MB',
        });
        break;
      case 'follow_up':
        setEvidenceFile({
          name: `rekaman_panggilan_negosiasi_${randNum}.m4a`,
          size: '680 KB',
        });
        break;
      case 'quotation':
        setEvidenceFile({
          name: `surat_penawaran_resmi_signed_${randNum}.pdf`,
          size: '780 KB',
        });
        break;
      case 'po':
        setEvidenceFile({
          name: `scan_purchase_order_faskes_${randNum}.pdf`,
          size: '1.2 MB',
        });
        break;
      case 'revenue':
        setEvidenceFile({
          name: `bukti_transfer_lunas_mandiri_${randNum}.pdf`,
          size: '640 KB',
        });
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
    return Boolean(evidenceFile);
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
      ) || 0;

    // IF CREATE MODE
    if (mode === 'create') {
      const selectedPelanggan =
        pelangganList.find((p) => p.id_pelanggan === selectedPelangganId) ||
        pelangganList[0];

      const newId = `tkt-${Date.now()}`;
      const kodeTiket = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

      const activityNote =
        catatan.trim() ||
        `Tiket baru dibuat pada tahap ${targetStage.nama_tahap} oleh Sales.`;

      const newActivity: AktivitasWithDetails = {
        id_aktivitas: `akt-${Date.now()}`,
        id_user: 'usr-1',
        id_tiket: newId,
        tanggal: tanggalAktivitas,
        catatan: activityNote,
        jenis_kegiatan: (targetStage.jenis_tahap as any) || 'visit',
        jadwal_follow_up: jadwalFollowUp || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        nama_petugas: 'Rina Putri',
        pic_ditemui: picDitemui || 'PIC Faskes',
        waktu_label: 'Baru saja',
        evidence: {
          tipe: evidenceFile ? detectFileType(evidenceFile.name) : 'dokumen',
          nama_file: evidenceFile?.name || 'bukti_aktivitas.pdf',
          file_size: evidenceFile?.size || '500 KB',
          deskripsi: evidenceFile?.name || 'Bukti aktivitas',
          waktu_upload: 'Baru saja',
          url_preview: evidenceFile?.url,
        },
      };

      const newTicket: TiketWithDetails = {
        id_tiket: newId,
        id_pelanggan: selectedPelanggan?.id_pelanggan || 'plg-1',
        id_user: 'usr-1',
        id_tahap: targetStage.id_tahap,
        id_kontak: null,
        judul: judulProspek.trim() || `Pengadaan Alkes - ${selectedPelanggan?.nama_faskes || 'RS'}`,
        estimasi_nilai: parsedNilai,
        estimasi_closing: targetClosing || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        status: stageType === 'revenue' ? statusClosing : 'open',
        kebutuhan_pelanggan: spesifikasiKebutuhan || '',
        prioritas,
        posisi: 0,
        tanggal_penawaran_awal: null,
        tanggal_closing: stageType === 'revenue' ? tanggalAktivitas : null,
        alasan_lost: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        kode_tiket: kodeTiket,
        nama_faskes: selectedPelanggan?.nama_faskes || 'Rumah Sakit',
        nama_pic: picDitemui || 'PIC Faskes',
        jabatan_pic: jabatanPic || 'Kepala Pengadaan',
        no_telp_pic: noTelpPic || '0812-0000-0000',
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

    const effectiveFromStageId = fromStage?.id_tahap || ticket?.id_tahap;
    const isSameStage = effectiveFromStageId === targetStage.id_tahap;

    const activityNote =
      catatan.trim() ||
      (isSameStage
        ? `Aktivitas tahap ${targetStage.nama_tahap} oleh ${ticket.nama_sales || 'Sales'}.`
        : `Perpindahan tahap ke ${targetStage.nama_tahap} oleh ${ticket.nama_sales || 'Sales'}.`);

    const newActivity: AktivitasWithDetails = {
      id_aktivitas: `akt-${Date.now()}`,
      id_user: ticket.id_user || 'usr-1',
      id_tiket: ticket.id_tiket,
      tanggal: tanggalAktivitas,
      catatan: activityNote,
      jenis_kegiatan: (targetStage.jenis_tahap as any) || 'visit',
      jadwal_follow_up: jadwalFollowUp || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nama_petugas: ticket.nama_sales || 'Sales Representative',
      pic_ditemui: picDitemui || ticket.nama_pic || 'PIC Faskes',
      waktu_label: 'Baru saja',
      evidence: {
        tipe: evidenceFile ? detectFileType(evidenceFile.name) : 'dokumen',
        nama_file: evidenceFile?.name || 'bukti_aktivitas.pdf',
        file_size: evidenceFile?.size || '500 KB',
        deskripsi: evidenceFile?.name || 'Bukti aktivitas',
        waktu_upload: 'Baru saja',
        url_preview: evidenceFile?.url,
      },
    };

    onConfirmMove?.({
      id_tiket: ticket.id_tiket,
      fromStageId: fromStage?.id_tahap || ticket.id_tahap,
      toStageId: targetStage.id_tahap,
      targetIndex,
      ticketUpdates,
      activity: newActivity,
    });

    onOpenChange(false);
  };

  const effectiveFromStage =
    fromStage ||
    (ticket
      ? INITIAL_KANBAN_STAGES.find((s) => s.id_tahap === ticket.id_tahap) || null
      : null);

  const isSameStage =
    mode === 'move' &&
    Boolean(
      effectiveFromStage &&
        targetStage &&
        effectiveFromStage.id_tahap === targetStage.id_tahap,
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className='fixed inset-x-0 bottom-0 mx-auto w-full sm:max-w-xl md:max-w-2xl max-h-[90dvh] flex flex-col p-0 rounded-t-2xl border-t border-border shadow-xl bg-card overflow-hidden'>
        {/* Header Drawer (Compact) */}
        <DrawerHeader className='shrink-0 px-4 sm:px-6 py-2.5 border-b border-border/70 bg-card text-left'>
          <div className='flex items-center justify-between gap-2 mb-1'>
            {mode === 'move' ? (
              <div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
                {!isSameStage && effectiveFromStage && (
                  <>
                    <Badge
                      variant='outline'
                      className='h-5 gap-1 rounded-full border-border bg-muted/40 px-2 text-[10px] font-medium text-muted-foreground'
                    >
                      <span
                        className='size-1.5 rounded-full'
                        style={{ backgroundColor: effectiveFromStage.dotColor }}
                      />
                      {effectiveFromStage.nama_tahap}
                    </Badge>
                    <ArrowRight className='size-3 text-muted-foreground shrink-0' />
                  </>
                )}

                <Badge
                  className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
                  style={{ backgroundColor: targetStage.dotColor }}
                >
                  <span className='size-1.5 rounded-full bg-white/80' />
                  {isSameStage ? `Aktivitas: ${targetStage.nama_tahap}` : targetStage.nama_tahap}
                </Badge>
              </div>
            ) : (
              <Badge
                className='h-5 gap-1 rounded-full px-2 text-[10px] font-semibold text-white shadow-xs'
                style={{ backgroundColor: targetStage.dotColor }}
              >
                <Plus className='size-3' />
                Tambah Card: {targetStage.nama_tahap}
              </Badge>
            )}

            <button
              type='button'
              onClick={handleClose}
              className='size-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0 ml-auto'
              title='Tutup Drawer'
            >
              <X className='size-4' />
            </button>
          </div>

          <DrawerTitle className='text-sm sm:text-base font-bold text-foreground truncate'>
            {mode === 'move' && ticket ? (
              <span className='flex items-center gap-1.5 truncate'>
                <span className='text-foreground'>{ticket.kode_tiket}</span>
                <span className='text-muted-foreground font-normal'>—</span>
                <span className='truncate font-semibold'>{ticket.judul}</span>
              </span>
            ) : (
              `Tambah Card Baru di Tahap ${targetStage.nama_tahap}`
            )}
          </DrawerTitle>

          <DrawerDescription className='text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5'>
            {mode === 'move' && ticket ? (
              <span className='flex flex-wrap items-center gap-1.5 text-[11px]'>
                <span className='text-primary font-medium'>{ticket.nama_faskes}</span>
                <span>·</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-medium',
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
              <span>Lengkapi data prospek dan bukti aktivitas tahap {targetStage.nama_tahap}.</span>
            )}
          </DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className='flex flex-1 min-h-0 flex-col overflow-hidden'>
          <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-3 flex flex-col gap-3'>
            {/* EVIDENCE ERROR BANNER */}
            {evidenceError && (
              <div className='flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-rose-800 animate-in fade-in slide-in-from-top-2'>
                <ShieldAlert className='size-4 shrink-0 mt-0.5 text-rose-600' />
                <div className='flex flex-col gap-0.5 text-xs'>
                  <span className='font-bold text-rose-900'>
                    {stageType === 'kebutuhan'
                      ? 'File Aktivitas Wajib Dilampirkan'
                      : 'File Bukti Aktivitas Wajib Dilampirkan'}
                  </span>
                  <span className='text-[11px]'>
                    Unggah file {stageType === 'kebutuhan' ? 'aktivitas' : 'bukti aktivitas'} sebelum menyimpan.
                  </span>
                </div>
              </div>
            )}

            {/* CREATE MODE: Basic Prospek Info Header */}
            {mode === 'create' && (
              <StageFormCreateHeader
                selectedPelangganId={selectedPelangganId}
                onFaskesChange={handleFaskesChange}
                pelangganList={pelangganList}
                judulProspek={judulProspek}
                onJudulChange={setJudulProspek}
              />
            )}

            {/* STAGE SPECIFIC FORMS */}
            {stageType === 'visit' && (
              <StageFormVisit
                koordinatGps={koordinatGps}
                statusRadius={statusRadius}
                waktuAktivitas={waktuAktivitas}
                onWaktuChange={setWaktuAktivitas}
                picDitemui={picDitemui}
                onPicSelect={handlePicSelect}
                jabatanPic={jabatanPic}
                kontakList={kontakList}
              />
            )}

            {/* Tahap Kebutuhan: input di atasnya dihilangkan sesuai permintaan, hanya upload file aktivitas dan catatan aktivitas */}

            {stageType === 'opportunity' && (
              <StageFormOpportunity
                estimasiNilai={estimasiNilai}
                onEstimasiNilaiChange={setEstimasiNilai}
                targetClosing={targetClosing}
                onTargetClosingChange={setTargetClosing}
                probabilitas={probabilitas}
                onProbabilitasChange={setProbabilitas}
                analisisKompetitor={analisisKompetitor}
                onAnalisisKompetitorChange={setAnalisisKompetitor}
              />
            )}

            {stageType === 'follow_up' && (
              <StageFormFollowUp
                mediaKomunikasi={mediaKomunikasi}
                onMediaKomunikasiChange={setMediaKomunikasi}
                jadwalFollowUp={jadwalFollowUp}
                onJadwalFollowUpChange={setJadwalFollowUp}
              />
            )}

            {stageType === 'quotation' && (
              <StageFormQuotation
                noQuotation={noQuotation}
                onNoQuotationChange={setNoQuotation}
                nilaiQuotation={nilaiQuotation}
                onNilaiQuotationChange={setNilaiQuotation}
                revisiKe={revisiKe}
                onRevisiKeChange={setRevisiKe}
              />
            )}

            {stageType === 'po' && (
              <StageFormPo
                noPo={noPo}
                onNoPoChange={setNoPo}
                nominalPo={nominalPo}
                onNominalPoChange={setNominalPo}
                targetPengiriman={targetPengiriman}
                onTargetPengirimanChange={setTargetPengiriman}
              />
            )}

            {stageType === 'revenue' && (
              <StageFormRevenue
                statusClosing={statusClosing}
                onStatusClosingChange={setStatusClosing}
                realisasiRevenue={realisasiRevenue}
                onRealisasiRevenueChange={setRealisasiRevenue}
              />
            )}

            {/* MANDATORY EVIDENCE SECTION (APPLIES TO ALL ACTIVITIES) */}
            <StageFormEvidence
              evidenceFile={evidenceFile}
              onEvidenceFileChange={setEvidenceFile}
              evidenceError={evidenceError}
              onEvidenceErrorChange={setEvidenceError}
              stageType={stageType}
            />

            {/* HASIL & CATATAN KUNJUNGAN / AKTIVITAS (Diletakkan di bawah posisi upload file) */}
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-semibold text-foreground'>
                {stageType === 'visit'
                  ? 'Hasil & Catatan Kunjungan Lapangan'
                  : 'Catatan Aktivitas'}{' '}
                <span className='text-rose-500'>*</span>
              </Label>
              <Textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder={
                  stageType === 'visit'
                    ? 'Tuliskan hasil diskusi kunjungan, respon dokter/PIC, dan pengamatan ruangan faskes...'
                    : stageType === 'kebutuhan'
                      ? 'Tuliskan catatan aktivitas dan identifikasi kebutuhan klien...'
                      : 'Tuliskan catatan aktivitas...'
                }
                className='rounded-xl text-xs'
                required
              />
            </div>

            {/* Priority Picker: Only shown when creating a new ticket/card in any activity */}
            {mode === 'create' && (
              <StageFormPriority
                prioritas={prioritas}
                onPrioritasChange={setPrioritas}
              />
            )}
          </div>

          {/* Drawer Footer Actions (Always Pinned & Fully Visible) */}
          <DrawerFooter className='shrink-0 z-10 flex flex-row items-center justify-end gap-2 px-4 sm:px-6 py-2.5 border-t border-border/70 bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-3 sm:pb-2.5'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='h-8.5 shrink-0 rounded-xl px-3.5 text-xs font-semibold cursor-pointer'
            >
              Batal
            </Button>
            <Button
              type='submit'
              className='h-8.5 flex-1 sm:flex-none gap-2 rounded-xl px-4 sm:px-5 text-xs font-semibold text-white shadow-sm cursor-pointer'
              style={{ backgroundColor: targetStage.dotColor }}
            >
              <CheckCircle2 className='size-3.5 shrink-0' />
              <span className='truncate'>
                {mode === 'create'
                  ? 'Tambah Card'
                  : isSameStage
                    ? 'Simpan Aktivitas'
                    : 'Simpan & Pindahkan'}
              </span>
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
