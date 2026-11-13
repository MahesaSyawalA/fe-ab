'use client';

import * as React from 'react';
import { Tabs, Checkbox, toast } from '@heroui/react';
import { TriangleExclamation } from '@gravity-ui/icons';
import { Button } from '@/components/ui/button';
import { UserTextFieldInput } from '../../inputs';

interface PasswordGeneratorCardProps {
  title?: string;
  passwordMode: 'auto' | 'manual';
  onPasswordModeChange: (mode: 'auto' | 'manual') => void;
  generatedPassword: string;
  onRegenerate: () => void;
  manualPassword: string;
  onManualPasswordChange: (val: string) => void;
  manualPasswordError?: string;
  mustChangePassword: boolean;
  onMustChangePasswordChange: (val: boolean) => void;
  sendEmail: boolean;
  onSendEmailChange: (val: boolean) => void;
}

export function PasswordGeneratorCard({
  title = 'Password awal',
  passwordMode,
  onPasswordModeChange,
  generatedPassword,
  onRegenerate,
  manualPassword,
  onManualPasswordChange,
  manualPasswordError,
  mustChangePassword,
  onMustChangePasswordChange,
  sendEmail,
  onSendEmailChange,
}: PasswordGeneratorCardProps) {
  const handleCopy = async () => {
    const textToCopy = passwordMode === 'auto' ? generatedPassword : manualPassword;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Password Berhasil Disalin', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Password telah disalin ke clipboard perangkat Anda.
          </span>
        ),
      });
    } catch {
      toast.danger('Gagal Menyalin', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Tidak dapat mengakses clipboard browser.
          </span>
        ),
      });
    }
  };

  return (
    <div className='flex flex-col gap-3.5 rounded-2xl border border-primary/20 dark:border-primary/30 bg-[#F4F7FF] dark:bg-primary-950/25 p-4 sm:p-5'>
      <span className='text-xs sm:text-sm font-bold text-foreground'>
        {title}
      </span>

      <Tabs
        selectedKey={passwordMode}
        onSelectionChange={(key) => onPasswordModeChange(key as 'auto' | 'manual')}
        className='w-full'
      >
        <Tabs.ListContainer className='rounded-none bg-transparent p-0'>
          <Tabs.List
            aria-label='Pilihan pembuatan password'
            className='grid grid-cols-2 w-full rounded-xl border border-primary/15 dark:border-border bg-card p-1 gap-1 shadow-2xs relative'
          >
            <Tabs.Tab
              id='auto'
              className='relative z-10 h-9 rounded-lg text-xs font-semibold text-muted-foreground data-[selected=true]:text-white transition-colors cursor-pointer flex items-center justify-center outline-none bg-transparent'
            >
              <span className='relative z-10'>Buat otomatis</span>
              <Tabs.Indicator className='rounded-lg bg-primary-default shadow-sm' />
            </Tabs.Tab>
            <Tabs.Tab
              id='manual'
              className='relative z-10 h-9 rounded-lg text-xs font-semibold text-muted-foreground data-[selected=true]:text-white transition-colors cursor-pointer flex items-center justify-center outline-none bg-transparent'
            >
              <span className='relative z-10'>Atur manual</span>
              <Tabs.Indicator className='rounded-lg bg-primary-default shadow-sm' />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id='auto' className='pt-3 flex flex-col gap-3'>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex-1 h-10 px-3.5 bg-card border border-border/80 rounded-md font-mono font-bold text-sm sm:text-base text-foreground flex items-center select-all tracking-wider overflow-x-auto no-scrollbar shadow-2xs'>
              {generatedPassword}
            </div>

            <Button
              type='button'
              variant='outline'
              onClick={handleCopy}
              className='h-10 rounded-md px-3 sm:px-4 text-xs font-medium text-primary border-border/80 bg-card hover:bg-muted cursor-pointer shrink-0 shadow-2xs'
            >
              Salin
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={onRegenerate}
              className='h-10 rounded-md px-3 sm:px-4 text-xs font-medium text-primary border-border/80 bg-card hover:bg-muted cursor-pointer shrink-0 shadow-2xs'
            >
              Buat ulang
            </Button>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id='manual' className='pt-3 flex flex-col gap-1.5'>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex-1 min-w-0'>
              <UserTextFieldInput
                type='password'
                placeholder='Masukkan password minimal 8 karakter'
                aria-label='Password manual'
                value={manualPassword}
                onChange={onManualPasswordChange}
                inputClassName='rounded-md h-10 bg-card border-border/80'
              />
            </div>

            <Button
              type='button'
              variant='outline'
              onClick={handleCopy}
              disabled={!manualPassword}
              className='h-10 rounded-md px-4 text-xs font-medium text-primary border-border/80 bg-card hover:bg-muted cursor-pointer shrink-0 shadow-2xs'
            >
              Salin
            </Button>
          </div>

          {manualPasswordError && (
            <span className='text-xs text-destructive flex items-center gap-1.5 pt-0.5'>
              <TriangleExclamation width={14} height={14} className='shrink-0' />
              <span>{manualPasswordError}</span>
            </span>
          )}
        </Tabs.Panel>
      </Tabs>

      <div className='flex flex-col gap-2.5 pt-1'>
        <Checkbox
          id='must_change_password'
          isSelected={mustChangePassword}
          onChange={(checked) => onMustChangePasswordChange(Boolean(checked))}
          className='cursor-pointer text-left w-full'
        >
          <Checkbox.Content className='flex items-center gap-2.5 text-xs font-medium text-foreground'>
            <Checkbox.Control className='size-4 rounded-md border border-primary/40 bg-card data-[selected=true]:border-primary data-[selected=true]:bg-primary-default'>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <span className='cursor-pointer select-none'>
              Wajib ganti password saat login pertama
            </span>
          </Checkbox.Content>
        </Checkbox>

        <Checkbox
          id='send_email'
          isSelected={sendEmail}
          onChange={(checked) => onSendEmailChange(Boolean(checked))}
          className='cursor-pointer text-left w-full'
        >
          <Checkbox.Content className='flex items-center gap-2.5 text-xs font-medium text-foreground'>
            <Checkbox.Control className='size-4 rounded-md border border-primary/40 bg-card data-[selected=true]:border-primary data-[selected=true]:bg-primary-default'>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <span className='cursor-pointer select-none'>
              Kirim detail akun ke email pengguna
            </span>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}
