import * as React from 'react';
import { usePelangganStore } from '@/store/pelanggan-store';
import { usePelangganListQuery } from '@/hooks/queries/use-pelanggan-query';
import { TiketPrioritas } from '@/types/ticket.types';
import { StageActivityDrawerProps, EvidenceFileState } from '../types';
import { useStageGeolocation } from './use-stage-geolocation';

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
  const pelangganQuery = usePelangganListQuery({ limit: 100 });
  const storePelangganList = usePelangganStore((s) => s.pelangganList);

  const pelangganList = React.useMemo(() => {
    if (pelangganQuery.data?.data && pelangganQuery.data.data.length > 0) {
      return pelangganQuery.data.data;
    }
    return storePelangganList;
  }, [pelangganQuery.data?.data, storePelangganList]);

  const [selectedPelangganId, setSelectedPelangganId] = React.useState('');
  const [judulProspek, setJudulProspek] = React.useState('');

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
  const [catatanTouched, setCatatanTouched] = React.useState(false);

  const [evidenceFile, setEvidenceFile] = React.useState<EvidenceFileState | null>(null);
  const [evidenceError, setEvidenceError] = React.useState(false);

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

  const {
    isLocating,
    refreshLocation,
    distanceToClient,
    isWithinRadius,
    koordinatGps,
    statusRadius,
    gpsData,
  } = useStageGeolocation({
    open,
    isVisitStage: targetStage?.jenis_tahap === 'visit',
    currentPelanggan,
  });

  const handlePicSelect = (nama: string, jabatan: string, noTelp?: string) => {
    setPicDitemui(nama);
    setJabatanPic(jabatan);
    if (noTelp) setNoTelpPic(noTelp);
  };

  const [spesifikasiKebutuhan] = React.useState('');

  const [estimasiNilai, setEstimasiNilai] = React.useState('');
  const [targetClosing, setTargetClosing] = React.useState('');
  const [probabilitas, setProbabilitas] = React.useState('75%');
  const [analisisKompetitor, setAnalisisKompetitor] = React.useState('');

  const [mediaKomunikasi, setMediaKomunikasi] = React.useState('WhatsApp');
  const [jadwalFollowUp, setJadwalFollowUp] = React.useState('');

  const [noQuotation, setNoQuotation] = React.useState('');
  const [nilaiQuotation, setNilaiQuotation] = React.useState('');
  const [revisiKe, setRevisiKe] = React.useState('1');

  const [noPo, setNoPo] = React.useState('');
  const [nominalPo, setNominalPo] = React.useState('');
  const [targetPengiriman, setTargetPengiriman] = React.useState('');

  const [statusClosing, setStatusClosing] = React.useState<'won' | 'lost'>('won');
  const [realisasiRevenue, setRealisasiRevenue] = React.useState('');

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

  React.useEffect(() => {
    if (!open || !targetStage) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvidenceError(false);
    setCatatanTouched(false);
    setEvidenceFile(null);


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
          setCatatan('');
          break;
        case 'kebutuhan':
          setCatatan('');
          break;
        case 'opportunity':
          setCatatan('');
          break;
        case 'follow_up':
          setCatatan('');
          break;
        case 'quotation':
          setNilaiQuotation('45.000.000');
          setRevisiKe('1');
          setCatatan('');
          break;
        case 'po':
          setNominalPo('45.000.000');
          setTargetPengiriman(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
          setCatatan('');
          break;
        case 'revenue':
          setStatusClosing('won');
          setRealisasiRevenue('45.000.000');
          setCatatan('');
          break;
      }
      return;
    }

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
        setNilaiQuotation(
          ticket.estimasi_nilai ? ticket.estimasi_nilai.toLocaleString('id-ID') : '45.000.000',
        );
        setRevisiKe(String((ticket.jumlah_penawaran ?? 0) + 1));
        setCatatan(
          `Surat penawaran resmi diterbitkan dan dikirimkan ke pihak manajemen ${ticket.nama_outlet}. Sudah termasuk PPN 11% & garansi 1 tahun.`,
        );
        break;
      case 'po':
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

  const catatanTrimmed = catatan.trim();
  const isCatatanValid = catatanTrimmed.length >= 5;
  const catatanError =
    catatanTouched && !isCatatanValid
      ? catatanTrimmed.length === 0
        ? 'Catatan wajib diisi'
        : 'Catatan minimal 5 karakter'
      : undefined;

  const validateForm = React.useCallback(() => {
    const hasEvidence = Boolean(evidenceFile);
    setEvidenceError(!hasEvidence);
    setCatatanTouched(true);
    return hasEvidence && catatan.trim().length >= 5;
  }, [evidenceFile, catatan]);

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
    catatanTouched,
    setCatatanTouched,
    catatanError,
    validateForm,
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
