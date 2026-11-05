import * as React from 'react';
import { ContactRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KontakInputItem } from '../../types';
import { WizardStepCard } from '../../wizard-step-card';
import { KontakDraftForm } from './kontak-draft-form';
import { KontakList } from './kontak-list';
import { useKontakDraft } from './use-kontak-draft';

interface FormStepKontakProps {
  contacts: KontakInputItem[];
  onChangeContacts: (contacts: KontakInputItem[]) => void;
  onSubmit: (finalContacts: KontakInputItem[]) => void;
  isSubmitting?: boolean;
}

export function FormStepKontak({
  contacts,
  onChangeContacts,
  onSubmit,
  isSubmitting = false,
}: FormStepKontakProps) {
  const kontak = useKontakDraft({ contacts, onChangeContacts, onSubmit });

  return (
    <WizardStepCard
      icon={<ContactRound className='size-4' />}
      title='Kontak PIC (Person In Charge)'
      badgeText='Wajib'
    >
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start'>
        <KontakDraftForm
          draft={kontak.draft}
          onChange={kontak.updateDraft}
          isDraftValid={kontak.isDraftValid}
          onAdd={kontak.handleAdd}
        />
        <KontakList contacts={contacts} onRemove={kontak.handleRemove} />
      </div>

      {/* Final Submit Button */}
      <div className='flex justify-end pt-3 border-t border-border/60'>
        <Button
          type='button'
          onClick={kontak.handleFinalSubmit}
          disabled={!kontak.canSubmit || isSubmitting}
          className='h-10 w-full md:w-auto md:min-w-56 rounded-xl bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow-xs disabled:opacity-50 cursor-pointer'
        >
          {isSubmitting ? 'Menyimpan Pelanggan...' : 'Simpan Semua & Selesaikan'}
        </Button>
      </div>
    </WizardStepCard>
  );
}
