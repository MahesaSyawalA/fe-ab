'use client';

import * as React from 'react';
import { TriangleExclamation } from '@gravity-ui/icons';
import type { PelangganEditFormState } from './use-pelanggan-edit-form';
import { PelangganEditProfileSection } from './pelanggan-edit-profile-section';
import { PelangganEditLocationSection } from './pelanggan-edit-location-section';
import { PelangganEditFooterActions } from './pelanggan-edit-footer-actions';

export { PelangganEditFooterActions };
export type { PelangganEditFooterActionsProps } from './pelanggan-edit-footer-actions';

interface PelangganEditFormFieldsProps {
  formState: PelangganEditFormState;
}

export function PelangganEditFormFields({ formState }: PelangganEditFormFieldsProps) {
  const { serverError } = formState;

  return (
    <div className='flex flex-col gap-5 pt-1'>
      {serverError && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-destructive'>
          <TriangleExclamation className='size-4 shrink-0 mt-0.5' />
          <p className='text-xs font-medium leading-relaxed'>{serverError}</p>
        </div>
      )}

      <PelangganEditProfileSection formState={formState} />
      <PelangganEditLocationSection formState={formState} />
    </div>
  );
}
