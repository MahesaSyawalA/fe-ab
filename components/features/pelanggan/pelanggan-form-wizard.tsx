import { Stepper, StepItem } from '@/components/ui/stepper';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { PelangganWithDetails } from '@/types/customer.types';
import {
  FormStepKontak,
  FormStepLokasi,
  FormStepProfil,
  usePelangganWizard,
} from './form';

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

export function PelangganFormWizard(props: PelangganFormWizardProps) {
  const wizard = usePelangganWizard(props);

  return (
    <div className='mx-auto flex w-full max-w-xl md:max-w-4xl lg:max-w-5xl min-w-0 flex-col gap-4 md:gap-6 pb-12'>
      {/* Top Header */}
      <SubpageHeader
        title='Tambah Pelanggan Baru'
        subtitle='Lengkapi profil outlet, titik koordinat peta, dan kontak PIC baru'
        onBack={wizard.handlePrevStep}
      />

      {/* Main Content with mobile horizontal padding */}
      <div className='flex flex-col gap-4 md:gap-6 px-4 md:px-0'>
        {/* Stepper Indicator */}
        <div className='px-4 py-2 md:px-6 md:py-4 bg-card rounded-2xl border border-border/60 shadow-2xs'>
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={wizard.currentStep}
            onStepClick={wizard.handleStepClick}
          />
        </div>

        {/* Step Contents */}
        {wizard.currentStep === 1 && (
          <FormStepProfil
            data={wizard.profilData}
            onChange={wizard.updateProfil}
            onNext={wizard.handleNextStep}
          />
        )}

        {wizard.currentStep === 2 && (
          <FormStepLokasi
            data={wizard.lokasiData}
            onChange={wizard.updateLokasi}
            onNext={wizard.handleNextStep}
          />
        )}

        {wizard.currentStep === 3 && (
          <FormStepKontak
            contacts={wizard.contacts}
            onChangeContacts={wizard.setContacts}
            onSubmit={wizard.handleFinalSubmit}
            isSubmitting={wizard.isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
