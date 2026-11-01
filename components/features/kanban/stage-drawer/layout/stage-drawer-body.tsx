import { ShieldAlert } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { JenisTahap } from '@/types/kanban-stage.types';
import { StageDrawerMode } from '../types';
import { StageActivityForm } from '../form/use-stage-activity-form';
import { StageFormCreateHeader } from '../form/stage-form-create-header';
import { StageFormEvidence } from '../form/stage-form-evidence';
import { StageFormPriority } from '../form/stage-form-priority';
import {
  StageFormFollowUp,
  StageFormOpportunity,
  StageFormPo,
  StageFormQuotation,
  StageFormRevenue,
  StageFormVisit,
} from '../stage-forms';

interface StageDrawerBodyProps {
  mode: StageDrawerMode;
  stageType: JenisTahap;
  form: StageActivityForm;
}

export function StageDrawerBody({ mode, stageType, form }: StageDrawerBodyProps) {
  return (
    <div className='no-scrollbar flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-3 flex flex-col gap-3'>
      {/* EVIDENCE ERROR BANNER */}
      {form.evidenceError && (
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
          selectedPelangganId={form.selectedPelangganId}
          onFaskesChange={form.handleFaskesChange}
          pelangganList={form.pelangganList}
          judulProspek={form.judulProspek}
          onJudulChange={form.setJudulProspek}
        />
      )}

      {/* STAGE SPECIFIC FORMS */}
      {stageType === 'visit' && (
        <StageFormVisit
          koordinatGps={form.koordinatGps}
          statusRadius={form.statusRadius}
          waktuAktivitas={form.waktuAktivitas}
          onWaktuChange={form.setWaktuAktivitas}
          picDitemui={form.picDitemui}
          onPicSelect={form.handlePicSelect}
          jabatanPic={form.jabatanPic}
          kontakList={form.kontakList}
        />
      )}

      {/* Tahap Kebutuhan: input di atasnya dihilangkan sesuai permintaan, hanya upload file aktivitas dan catatan aktivitas */}

      {stageType === 'opportunity' && (
        <StageFormOpportunity
          estimasiNilai={form.estimasiNilai}
          onEstimasiNilaiChange={form.setEstimasiNilai}
          targetClosing={form.targetClosing}
          onTargetClosingChange={form.setTargetClosing}
          probabilitas={form.probabilitas}
          onProbabilitasChange={form.setProbabilitas}
          analisisKompetitor={form.analisisKompetitor}
          onAnalisisKompetitorChange={form.setAnalisisKompetitor}
        />
      )}

      {stageType === 'follow_up' && (
        <StageFormFollowUp
          mediaKomunikasi={form.mediaKomunikasi}
          onMediaKomunikasiChange={form.setMediaKomunikasi}
          jadwalFollowUp={form.jadwalFollowUp}
          onJadwalFollowUpChange={form.setJadwalFollowUp}
        />
      )}

      {stageType === 'quotation' && (
        <StageFormQuotation
          noQuotation={form.noQuotation}
          onNoQuotationChange={form.setNoQuotation}
          nilaiQuotation={form.nilaiQuotation}
          onNilaiQuotationChange={form.setNilaiQuotation}
          revisiKe={form.revisiKe}
          onRevisiKeChange={form.setRevisiKe}
        />
      )}

      {stageType === 'po' && (
        <StageFormPo
          noPo={form.noPo}
          onNoPoChange={form.setNoPo}
          nominalPo={form.nominalPo}
          onNominalPoChange={form.setNominalPo}
          targetPengiriman={form.targetPengiriman}
          onTargetPengirimanChange={form.setTargetPengiriman}
        />
      )}

      {stageType === 'revenue' && (
        <StageFormRevenue
          statusClosing={form.statusClosing}
          onStatusClosingChange={form.setStatusClosing}
          realisasiRevenue={form.realisasiRevenue}
          onRealisasiRevenueChange={form.setRealisasiRevenue}
        />
      )}

      {/* MANDATORY EVIDENCE SECTION (APPLIES TO ALL ACTIVITIES) */}
      <StageFormEvidence
        evidenceFile={form.evidenceFile}
        onEvidenceFileChange={form.setEvidenceFile}
        evidenceError={form.evidenceError}
        onEvidenceErrorChange={form.setEvidenceError}
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
          value={form.catatan}
          onChange={(e) => form.setCatatan(e.target.value)}
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
          prioritas={form.prioritas}
          onPrioritasChange={form.setPrioritas}
        />
      )}
    </div>
  );
}
