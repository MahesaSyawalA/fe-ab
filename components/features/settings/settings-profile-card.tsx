'use client';

import * as React from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SettingsTextFieldInput } from './inputs';

interface SettingsProfileCardProps {
  name: string;
  role: string;
  initials: string;
  isEditing: boolean;
  isSaving?: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onNameChange: (newName: string) => void;
  onAvatarClick?: () => void;
}

export function SettingsProfileCard({
  name,
  role,
  initials,
  isEditing,
  isSaving = false,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onNameChange,
  onAvatarClick,
}: SettingsProfileCardProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Card className='rounded-2xl border border-border/70 bg-card shadow-xs transition-shadow hover:shadow-sm'>
      <CardContent className='flex flex-col gap-4 p-5 sm:p-6'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-base sm:text-lg font-bold text-foreground'>
              Pengaturan Profil
            </h2>
            <p className='text-xs text-muted-foreground'>
              Perbarui informasi pribadi dan foto profil Anda.
            </p>
          </div>

          {!isEditing && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={onStartEdit}
              className='h-8 rounded-lg px-2.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 cursor-pointer shadow-none shrink-0'
              title='Edit Profil & Nomor Telepon'
            >
              <Pencil className='mr-1 size-3' />
              <span>Edit</span>
            </Button>
          )}

          {isEditing && (
            <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0'>
              Mode Edit Aktif
            </span>
          )}
        </div>

        <div className='flex justify-center my-1'>
          <div className='relative'>
            <div className='size-20 rounded-full bg-[#FFEDD5] text-accent flex items-center justify-center text-xl font-bold select-none shadow-inner'>
              {initials}
            </div>
            <button
              type='button'
              onClick={isEditing ? onCancelEdit : (onAvatarClick || onStartEdit)}
              title={isEditing ? 'Batal Edit' : 'Ubah Foto Profil'}
              className='absolute bottom-0 right-0 size-7 rounded-full bg-accent text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-accent/90 active:scale-95 transition-all'
            >
              <Pencil className='size-3.5' />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <SettingsTextFieldInput
              ref={inputRef}
              id='nama-lengkap'
              label='Nama Lengkap'
              aria-label='Nama Lengkap'
              value={name}
              onChange={onNameChange}
              disabled={!isEditing || isSaving}
              placeholder='Masukkan nama lengkap Anda'
              endAddon={
                <button
                  type='button'
                  onClick={isEditing ? undefined : onStartEdit}
                  disabled={isEditing || isSaving}
                  title={isEditing ? undefined : 'Klik untuk mengedit profil'}
                  className={`p-1 rounded-md transition-colors ${
                    isEditing
                      ? 'text-primary pointer-events-none'
                      : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 cursor-pointer'
                  }`}
                >
                  <Pencil className='size-3.5' />
                </button>
              }
            />

            {isEditing && (
              <div className='flex items-center justify-end gap-2 pt-1.5'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={onCancelEdit}
                  disabled={isSaving}
                  className='h-8.5 rounded-lg px-3 text-xs font-semibold cursor-pointer border-border shadow-none hover:bg-muted/50'
                >
                  <X className='mr-1 size-3.5' />
                  Batal
                </Button>
                <Button
                  type='button'
                  size='sm'
                  onClick={onSaveEdit}
                  disabled={isSaving}
                  className='h-8.5 rounded-lg px-4 text-xs font-semibold text-white bg-primary-default hover:bg-primary-hover active:bg-primary cursor-pointer shadow-sm disabled:opacity-70'
                >
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-1.5 size-3.5 animate-spin' />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className='mr-1 size-3.5' />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <SettingsTextFieldInput
            id='user-role'
            label='Role'
            aria-label='Role'
            value={role}
            disabled
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
