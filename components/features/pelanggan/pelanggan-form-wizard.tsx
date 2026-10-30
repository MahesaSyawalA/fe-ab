'use client';

import * as React from 'react';
import { Stepper, StepItem } from '@/components/ui/stepper';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { FormStepProfil, FormStepProfilData } from './form-step-profil';
import { FormStepLokasi, FormStepLokasiData } from './form-step-lokasi';
import { FormStepKontak, KontakInputItem } from './form-step-kontak';
import { PelangganWithDetails } from '@/types/customer.types';

interface PelangganFormWizardProps {
  onBack: () => void;
  onSave: (newPelanggan: PelangganWithDetails) => void;
  initialStep?: number;
}

const WIZARD_STEPS: StepItem[] = [
  { id: 1, label: 'Profil' },
  { id: 2, label: 'Lokasi' },
  { id: 3, label: 'Kontak' },
];

export function PelangganFormWizard({
  onBack,
  onSave,
  initialStep = 1,
}: PelangganFormWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [profilData, setProfilData] = React.useState<FormStepProfilData>({
    nama_faskes: '',
    tipe_faskes: 'Rumah Sakit',
    alamat: '',
    img_url: '',
  });

  const [lokasiData, setLokasiData] = React.useState<FormStepLokasiData>({
    latitude: -6.208812,
    longitude: 106.845648,
    radius_kunjungan: 200,
  });

  const [contacts, setContacts] = React.useState<KontakInputItem[]>([
    {
      nama: 'Mahesa',
      jabatan: 'Kepala Cabang',
      no_telp: '081233323413',
      email: 'mahesa@gmail.com',
    },
  ]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleFinalSubmit = (finalContacts: KontakInputItem[]) => {
    setIsSubmitting(true);
    const newId = `plg-${Date.now()}`;

    const newPelanggan: PelangganWithDetails = {
      id_pelanggan: newId,
      nama_faskes: profilData.nama_faskes || 'RS Harapan Baru',
      tipe_faskes: profilData.tipe_faskes,
      alamat:
        profilData.alamat ||
        'Jl. Salemba Raya No. 42A, Kenari, Senen, Jakarta Pusat 10430',
      latitude: lokasiData.latitude,
      longitude: lokasiData.longitude,
      radius_kunjungan: lokasiData.radius_kunjungan,
      img_url:
        profilData.img_url ||
        'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      jarak_km: '1,2 km',
      tiket_aktif: 0,
      total_kunjungan: 0,
      estimasi_nilai: 'Rp0',
      status: 'Aktif',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      kontak_list: finalContacts.map((c, i) => ({
        id_kontak: `kt-${Date.now()}-${i}`,
        id_pelanggan: newId,
        nama: c.nama,
        kategori_peran: 'KOL / Penentu Klinis',
        jabatan: c.jabatan,
        no_telp: c.no_telp,
        email: c.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSave(newPelanggan);
    }, 300);
  };

  return (
    <div className='mx-auto flex min-h-svh w-full max-w-xl min-w-0 flex-col bg-background pb-10'>
      {/* White Top Header + Stepper Band without Sidebar */}
      <div className='bg-card pb-4 shadow-2xs'>
        <SubpageHeader title='Tambah Pelanggan Baru' onBack={handlePrevStep} />

        <div className='px-8 pt-2'>
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= currentStep) setCurrentStep(step);
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className='px-4 pt-4'>
        {currentStep === 1 && (
          <FormStepProfil
            data={profilData}
            onChange={(fields) =>
              setProfilData((prev) => ({ ...prev, ...fields }))
            }
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <FormStepLokasi
            data={lokasiData}
            onChange={(fields) =>
              setLokasiData((prev) => ({ ...prev, ...fields }))
            }
            onNext={handleNextStep}
          />
        )}

        {currentStep === 3 && (
          <FormStepKontak
            contacts={contacts}
            onChangeContacts={setContacts}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
