import * as React from 'react';
import { ContactRound, Loader2 } from 'lucide-react';
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
  serverError?: string | null;
}

export function FormStepKontak({
  contacts,
  onChangeContacts,
  onSubmit,
  isSubmitting = false,
  serverError,
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

      {serverError && (
        <div className='rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3'>
          <p className='text-xs font-semibold text-destructive'>{serverError}</p>
        </div>
      )}

      {/* Final Submit Button */}
      <div className='flex justify-end pt-3 border-t border-border/60'>
        <Button
          type='button'
          onClick={kontak.handleFinalSubmit}
          disabled={!kontak.canSubmit || isSubmitting}
          className='h-10 w-full md:w-auto md:min-w-56 rounded-md bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-all cursor-pointer'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 size-4 animate-spin' />
              Menyimpan Pelanggan...
            </>
          ) : (
            'Simpan Semua & Selesaikan'
          )}
        </Button>
      </div>
    </WizardStepCard>
  );
}
