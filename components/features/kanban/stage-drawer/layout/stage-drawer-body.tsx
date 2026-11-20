import { JenisTahap } from '@/types/kanban-stage.types';
import { StageDrawerMode } from '../types';
import { StageTextAreaInput } from '../inputs';
import { StageActivityForm } from '../form/use-stage-activity-form';
import { StageFormInformasiDasar } from '../form/stage-form-informasi-dasar';
import { StageFormEvidence } from '../form/stage-form-evidence';
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

      {mode === 'create' && (
        <StageFormInformasiDasar
          judulProspek={form.judulProspek}
          onJudulChange={form.setJudulProspek}
          selectedPelangganId={form.selectedPelangganId}
          onOutletChange={form.handleOutletChange}
          pelangganList={form.pelangganList}
          picDitemui={form.picDitemui}
          onPicSelect={form.handlePicSelect}
          kontakList={form.kontakList}
          jabatanPic={form.jabatanPic}
          estimasiNilai={form.estimasiNilai}
          onEstimasiNilaiChange={form.setEstimasiNilai}
          targetClosing={form.targetClosing}
          onTargetClosingChange={form.setTargetClosing}
          prioritas={form.prioritas}
          onPrioritasChange={form.setPrioritas}
        />
      )}

      {stageType === 'visit' && (
        <StageFormVisit
          mode={mode}
          koordinatGps={form.koordinatGps}
          statusRadius={form.statusRadius}
          isLocating={form.isLocating}
          isWithinRadius={form.isWithinRadius}
          onRefreshLocation={form.refreshLocation}
          waktuAktivitas={form.waktuAktivitas}
          onWaktuChange={form.setWaktuAktivitas}
          picDitemui={form.picDitemui}
          onPicSelect={form.handlePicSelect}
          jabatanPic={form.jabatanPic}
          kontakList={form.kontakList}
        />
      )}

      {stageType === 'opportunity' && (
        <StageFormOpportunity
          mode={mode}
          estimasiNilai={form.estimasiNilai}
          onEstimasiNilaiChange={form.setEstimasiNilai}
          targetClosing={form.targetClosing}
          onTargetClosingChange={form.setTargetClosing}
        />
      )}

      {stageType === 'follow_up' && (
        <StageFormFollowUp
          mode={mode}
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

      <StageFormEvidence
        evidenceFile={form.evidenceFile}
        onEvidenceFileChange={form.setEvidenceFile}
        evidenceError={form.evidenceError}
        onEvidenceErrorChange={form.setEvidenceError}
        stageType={stageType}
        label='Upload Bukti'
      />

      <div className='flex flex-col gap-1'>
        <StageTextAreaInput
          label={mode === 'move' ? 'Catatan Aktivitas' : 'Catatan Prospek'}
          isRequired
          rows={3}
          value={form.catatan}
          onChange={(val) => {
            form.setCatatan(val);
            if (!form.catatanTouched) {
              form.setCatatanTouched(true);
            }
          }}
          isInvalid={Boolean(form.catatanError)}
          errorMessage={form.catatanError}
          placeholder={
            mode === 'move'
              ? 'Tuliskan catatan aktivitas (minimal 5 karakter)...'
              : 'Tuliskan kebutuhan atau catatan prospek (minimal 5 karakter)...'
          }
        />
        <div className='flex justify-end text-[10px] text-muted-foreground pr-1'>
          {form.catatan.length}/1000 Characters
        </div>
      </div>
    </div>
  );
}
