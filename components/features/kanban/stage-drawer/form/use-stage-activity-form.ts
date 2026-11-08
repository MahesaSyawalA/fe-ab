import * as React from 'react';
import { usePelangganStore } from '@/lib/pelanggan-store';
import { TiketPrioritas } from '@/types/ticket.types';
import { StageActivityDrawerProps, EvidenceFileState } from '../types';

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

type FormArgs = Pick<
  StageActivityDrawerProps,
  'open' | 'mode' | 'ticket' | 'targetStage'
>;

export function useStageActivityForm({
  open,
  mode = 'move',
  ticket,
  targetStage,
}: FormArgs) {
  const { pelangganList } = usePelangganStore();

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
  const [prioritas, setPrioritas] = React.useState<TiketPrioritas>('sedang');
  const [catatan, setCatatan] = React.useState('');

  // Unified Evidence File Upload state
  const [evidenceFile, setEvidenceFile] = React.useState<EvidenceFileState | null>(null);
  const [evidenceError, setEvidenceError] = React.useState(false);

  // GPS State & Haversine calculation
  const [gpsCoords, setGpsCoords] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);

  const refreshLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  React.useEffect(() => {
    if (open && targetStage?.jenis_tahap === 'visit') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshLocation();
    }
  }, [open, targetStage?.jenis_tahap, refreshLocation]);

  // Relasi Data Client & Kontak PIC
  const currentPelanggan = React.useMemo(() => {
    if (mode === 'create') {
      return pelangganList.find((p) => p.id_pelanggan === selectedPelangganId) || pelangganList[0];
    }
    return (
      pelangganList.find(
        (p) =>
          p.id_pelanggan === ticket?.id_pelanggan ||
          p.nama_outlet.toLowerCase() === (ticket?.nama_outlet || '').toLowerCase(),
      ) || null
    );
  }, [mode, selectedPelangganId, ticket, pelangganList]);

  const kontakList = React.useMemo(() => {
    return currentPelanggan?.kontak_list || [];
  }, [currentPelanggan]);

  const distanceToClient = React.useMemo(() => {
    if (!gpsCoords) return 38;
    const clientLat = currentPelanggan?.latitude;
    const clientLng = currentPelanggan?.longitude;
    if (clientLat == null || clientLng == null) return 38;
    return calculateHaversineDistance(
      gpsCoords.latitude,
      gpsCoords.longitude,
      clientLat,
      clientLng,
    );
  }, [gpsCoords, currentPelanggan]);

  const radiusLimit = currentPelanggan?.radius_kunjungan ?? 50;
  const isWithinRadius = distanceToClient <= radiusLimit;

  const koordinatGps = React.useMemo(() => {
    if (gpsCoords) {
      return `${gpsCoords.latitude}, ${gpsCoords.longitude}`;
    }
    return isLocating ? 'Mencari sinyal GPS...' : '-6.2088, 106.8456';
  }, [gpsCoords, isLocating]);

  const statusRadius = React.useMemo(() => {
    if (isLocating) return 'Mengecek radius...';
    return isWithinRadius
      ? `Dalam Radius (${distanceToClient}m)`
      : `Luar Radius (${distanceToClient}m)`;
  }, [isLocating, isWithinRadius, distanceToClient]);

  const gpsData = React.useMemo(() => {
    const lat = gpsCoords ? gpsCoords.latitude : -6.2088;
    const lng = gpsCoords ? gpsCoords.longitude : 106.8456;
    return {
      latitude: lat,
      longitude: lng,
      jarak_klien: distanceToClient,
      dalam_radius: isWithinRadius,
    };
  }, [gpsCoords, distanceToClient, isWithinRadius]);

  const handlePicSelect = (nama: string, jabatan: string, noTelp?: string) => {
    setPicDitemui(nama);
    setJabatanPic(jabatan);
    if (noTelp) setNoTelpPic(noTelp);
  };

  // Kebutuhan specifics
  const [spesifikasiKebutuhan] = React.useState('');

  // Opportunity specifics
  const [estimasiNilai, setEstimasiNilai] = React.useState('');
  const [targetClosing, setTargetClosing] = React.useState('');
  const [probabilitas, setProbabilitas] = React.useState('75%');
  const [analisisKompetitor, setAnalisisKompetitor] = React.useState('');

  // Follow Up specifics
  const [mediaKomunikasi, setMediaKomunikasi] = React.useState('WhatsApp');
  const [jadwalFollowUp, setJadwalFollowUp] = React.useState('');

  // Quotation specifics
  const [noQuotation, setNoQuotation] = React.useState('');
  const [nilaiQuotation, setNilaiQuotation] = React.useState('');
  const [revisiKe, setRevisiKe] = React.useState('1');

  // PO specifics
  const [noPo, setNoPo] = React.useState('');
  const [nominalPo, setNominalPo] = React.useState('');
  const [targetPengiriman, setTargetPengiriman] = React.useState('');

  // Revenue specifics
  const [statusClosing, setStatusClosing] = React.useState<'won' | 'lost'>('won');
  const [realisasiRevenue, setRealisasiRevenue] = React.useState('');

  // Handle Outlet change in Create mode
  const handleOutletChange = (pelangganId: string) => {
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvidenceError(false);

    // Initial Evidence setup per stage
    const outletName = ticket?.nama_outlet || 'RS Harapan Sehat';
    const randNum = Math.floor(100 + Math.random() * 900);

    switch (targetStage.jenis_tahap) {
      case 'visit':
        setEvidenceFile({
          name: `foto_kunjungan_${outletName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
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
          name: `scan_purchase_order_outlet_${randNum}.pdf`,
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
      setEstimasiNilai('45.000.000');
      setTargetClosing(new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10));
      setJadwalFollowUp(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

      switch (targetStage.jenis_tahap) {
        case 'visit':
          setCatatan('Default');
          break;
        case 'kebutuhan':
          setCatatan('Default');
          break;
        case 'opportunity':
          setCatatan('Default');
          break;
        case 'follow_up':
          setCatatan('Default');
          break;
        case 'quotation':
          setNoQuotation('QTN-2024-0145-R2');
          setNilaiQuotation('45.000.000');
          setRevisiKe('1');
          setCatatan('Default');
          break;
        case 'po':
          setNoPo(`PO-RS-2026-${randNum}`);
          setNominalPo('45.000.000');
          setTargetPengiriman(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
          setCatatan('Default');
          break;
        case 'revenue':
          setStatusClosing('won');
          setRealisasiRevenue('45.000.000');
          setCatatan('Default');
          break;
      }
      return;
    }

    // Move Mode: Prefill from existing ticket
    if (!ticket) return;

    setJudulProspek(ticket.judul || '');
    const matchedPelanggan = pelangganList.find(
      (p) =>
        p.id_pelanggan === ticket.id_pelanggan ||
        p.nama_outlet.toLowerCase() === ticket.nama_outlet.toLowerCase(),
    );
    if (matchedPelanggan) {
      setSelectedPelangganId(matchedPelanggan.id_pelanggan);
    }
    setPicDitemui(ticket.nama_pic || '');
    setJabatanPic(ticket.jabatan_pic || '');
    setNoTelpPic(ticket.no_telp_pic || '');
    setPrioritas(ticket.prioritas || 'sedang');
    setEstimasiNilai(ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '45.000.000');
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
          `Kunjungan lapangan ke ${ticket.nama_outlet}. Observasi ruangan dan diskusi dengan ${ticket.nama_pic || 'PIC'}.`,
        );
        break;
      case 'kebutuhan':
        setCatatan(
          `Melakukan asesmen mendalam kebutuhan ${ticket.nama_outlet}. Tim teknis RS memerlukan spesifikasi lengkap.`,
        );
        break;
      case 'opportunity':
        setAnalisisKompetitor('Vendor kompetitor mengajukan tipe lama, kita unggul di kecepatan kalibrasi.');
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
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '45.000.000',
        );
        setRevisiKe('1');
        setCatatan(
          `Surat penawaran resmi diterbitkan dan dikirimkan ke pihak manajemen ${ticket.nama_outlet}. Sudah termasuk PPN 11% & garansi 1 tahun.`,
        );
        break;
      case 'po':
        setNoPo(`PO-${ticket.nama_outlet.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-2026-${codeNum}`);
        setNominalPo(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '45.000.000',
        );
        setTargetPengiriman(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
        setCatatan(`Purchase Order resmi terbit dan telah divalidasi oleh Bagian Pengadaan RS.`);
        break;
      case 'revenue':
        setStatusClosing('won');
        setRealisasiRevenue(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '45.000.000',
        );
        setCatatan(`Unit telah diterima, uji fungsi berhasil, dan pembayaran lunas 100%. Tiket berhasil closing (Won).`);
        break;
    }
  }, [open, mode, ticket, targetStage, pelangganList]);

  return {
    pelangganList,
    kontakList,
    handlePicSelect,
    handleOutletChange,
    selectedPelangganId,
    judulProspek,
    setJudulProspek,
    picDitemui,
    jabatanPic,
    noTelpPic,
    waktuAktivitas,
    setWaktuAktivitas,
    tanggalAktivitas,
    prioritas,
    setPrioritas,
    catatan,
    setCatatan,
    evidenceFile,
    setEvidenceFile,
    evidenceError,
    setEvidenceError,
    koordinatGps,
    statusRadius,
    isLocating,
    isWithinRadius,
    distanceToClient,
    refreshLocation,
    gpsData,
    spesifikasiKebutuhan,
    estimasiNilai,
    setEstimasiNilai,
    targetClosing,
    setTargetClosing,
    probabilitas,
    setProbabilitas,
    analisisKompetitor,
    setAnalisisKompetitor,
    mediaKomunikasi,
    setMediaKomunikasi,
    jadwalFollowUp,
    setJadwalFollowUp,
    noQuotation,
    setNoQuotation,
    nilaiQuotation,
    setNilaiQuotation,
    revisiKe,
    setRevisiKe,
    noPo,
    setNoPo,
    nominalPo,
    setNominalPo,
    targetPengiriman,
    setTargetPengiriman,
    statusClosing,
    setStatusClosing,
    realisasiRevenue,
    setRealisasiRevenue,
  };
}

export type StageActivityForm = ReturnType<typeof useStageActivityForm>;
