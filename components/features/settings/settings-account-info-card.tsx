'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SettingsTextFieldInput, SettingsPhoneInput } from './inputs';

interface SettingsAccountInfoCardProps {
  email: string;
  phone: string;
  isEditing?: boolean;
  isSaving?: boolean;
  onPhoneChange?: (phone: string) => void;
  onRequestChangeEmail?: () => void;
  onRequestChangePassword?: () => void;
  disabled?: boolean;
}

export function SettingsAccountInfoCard({
  email,
  phone,
  isEditing = false,
  isSaving = false,
  onPhoneChange,
  onRequestChangeEmail,
  onRequestChangePassword,
  disabled = false,
}: SettingsAccountInfoCardProps) {
  return (
    <Card className='rounded-2xl border border-border/70 bg-card shadow-xs transition-shadow hover:shadow-sm'>
      <CardContent className='flex flex-col gap-4 p-5 sm:p-6'>
        {/* Card Header */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-base sm:text-lg font-bold text-foreground'>
              Informasi Pribadi
            </h2>
            <p className='text-xs text-muted-foreground'>
              Kelola informasi akun Anda.
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {/* Alamat Email */}
          <div className='flex flex-col gap-1.5'>
            <SettingsTextFieldInput
              id='user-email'
              label='Alamat Email'
              aria-label='Alamat Email'
              type='email'
              value={email}
              disabled
              readOnly
            />
            <Button
              type='button'
              variant='outline'
              onClick={onRequestChangeEmail}
              className='mt-1 border border-primary text-primary bg-card hover:bg-primary/5 rounded-lg w-full py-2.5 h-10 font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-none'
            >
              Request Ubah Email
            </Button>
          </div>

          {/* Nomor Telepon */}
          <div className='flex flex-col gap-1.5'>
            <SettingsPhoneInput
              id='user-phone'
              label='Nomor Telepon'
              aria-label='Nomor Telepon'
              value={phone}
              onChange={onPhoneChange}
              disabled={!isEditing || disabled || isSaving}
              placeholder='+62 812-xxxx-xxxx'
            />
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1.5'>
            <SettingsTextFieldInput
              id='user-password'
              label='Password'
              aria-label='Password'
              type='password'
              value='••••••••••••'
              disabled
              readOnly
            />
            <Button
              type='button'
              variant='outline'
              onClick={onRequestChangePassword}
              className='mt-1 border border-primary text-primary bg-card hover:bg-primary/5 rounded-lg w-full py-2.5 h-10 font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-none'
            >
              Request Ubah Password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
