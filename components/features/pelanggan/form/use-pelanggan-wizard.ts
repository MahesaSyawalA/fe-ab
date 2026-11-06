import * as React from 'react';
import { PelangganWithDetails } from '@/types/customer.types';
import { buildPelanggan } from './build-pelanggan';
import {
  FormStepLokasiData,
  FormStepProfilData,
  KontakInputItem,
} from './types';

const TOTAL_STEPS = 3;

interface UsePelangganWizardArgs {
  onBack: () => void;
  onSave: (newPelanggan: PelangganWithDetails) => void;
  initialStep?: number;
}

export function usePelangganWizard({
  onBack,
  onSave,
  initialStep = 1,
}: UsePelangganWizardArgs) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [profilData, setProfilData] = React.useState<FormStepProfilData>({
    nama_outlet: '',
    tipe_outlet: 'Rumah Sakit',
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

  const updateProfil = (fields: Partial<FormStepProfilData>) =>
    setProfilData((prev) => ({ ...prev, ...fields }));

  const updateLokasi = (fields: Partial<FormStepLokasiData>) =>
    setLokasiData((prev) => ({ ...prev, ...fields }));

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  // Hanya boleh kembali ke step yang sudah dilewati.
  const handleStepClick = (step: number) => {
    if (step <= currentStep) setCurrentStep(step);
  };

  const handleFinalSubmit = (finalContacts: KontakInputItem[]) => {
    setIsSubmitting(true);
    const newPelanggan = buildPelanggan(profilData, lokasiData, finalContacts);

    setTimeout(() => {
      setIsSubmitting(false);
      onSave(newPelanggan);
    }, 300);
  };

  return {
    currentStep,
    isSubmitting,
    profilData,
    lokasiData,
    contacts,
    setContacts,
    updateProfil,
    updateLokasi,
    handleNextStep,
    handlePrevStep,
    handleStepClick,
    handleFinalSubmit,
  };
}
