'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Button } from '@/components/ui/button';
import { SettingsProfileCard } from './settings-profile-card';
import { SettingsAccountInfoCard } from './settings-account-info-card';
import { formatRoleLabel, getUserInitials, logoutUser } from '@/lib/auth-helpers';
import { toast } from '@heroui/react';

export function SettingsView() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const rawRole = user?.role;
  const displayRole = formatRoleLabel(rawRole);

  const [savedName, setSavedName] = React.useState<string | null>(null);
  const [savedPhone, setSavedPhone] = React.useState<string | null>(null);

  const baseName = savedName ?? (user?.nama || user?.name || 'Malcolm Todd');
  const basePhone = savedPhone ?? ((user as { no_telp?: string })?.no_telp || '+62 812-3756-2349');

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState<string>(baseName);
  const [draftPhone, setDraftPhone] = React.useState<string>(basePhone);

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const displayName = isEditing ? draftName : baseName;
  const displayPhone = isEditing ? draftPhone : basePhone;

  const initials = getUserInitials(displayName);
  const email = user?.email || 'm.todd@abmedical.com';

  const handleStartEdit = () => {
    setDraftName(baseName);
    setDraftPhone(basePhone);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftName(baseName);
    setDraftPhone(basePhone);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      toast.danger('Nama lengkap minimal 3 karakter', {
        description: 'Silakan periksa kembali nama lengkap Anda.',
      });
      return;
    }

    const digits = draftPhone.replace(/\D/g, '');
    if (digits.length < 9) {
      toast.danger('Nomor telepon minimal 9 digit angka', {
        description: 'Silakan periksa kembali nomor telepon Anda.',
      });
      return;
    }

    setSavedName(trimmedName);
    setSavedPhone(draftPhone);
    setIsEditing(false);
    toast.success('Profil berhasil diperbarui', {
      description: 'Nama lengkap dan nomor telepon telah berhasil disimpan.',
    });
  };

  const handleAvatarClick = () => {
    if (!isEditing) {
      handleStartEdit();
    } else {
      toast('Fitur unggah foto profil akan segera hadir');
    }
  };

  const handleRequestChangeEmail = () => {
    toast('Permintaan ubah email dikirim ke administrator');
  };

  const handleRequestChangePassword = () => {
    toast('Tautan pengaturan ulang password telah dikirim ke email');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
  };

  return (
    <div className='flex flex-col min-h-full w-full'>
      {/* Container Header & Breadcrumb Aligned with Grid */}
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4'>
        <SubpageHeader
          title='Pengaturan Profil'
          onBack={() => router.back()}
        />
      </div>

      {/* Main Content Area - Responsive 2-Col Grid on Desktop (lg:) */}
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 pb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start'>
          {/* Left Column (lg: 5 cols): Profile Settings & Logout */}
          <div className='lg:col-span-5 flex flex-col gap-5'>
            {/* Card 1: Pengaturan Profil */}
            <SettingsProfileCard
              name={displayName}
              role={displayRole}
              initials={initials}
              isEditing={isEditing}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onNameChange={setDraftName}
              onAvatarClick={handleAvatarClick}
            />

            {/* Logout Action Card */}
            <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-4 sm:p-5 flex flex-col gap-3 shadow-2xs'>
              <div className='flex flex-col gap-0.5'>
                <h3 className='text-xs sm:text-sm font-bold text-destructive'>
                  Sesi Akun
                </h3>
                <p className='text-[11px] sm:text-xs text-muted-foreground'>
                  Keluar dari sesi akun aktif pada perangkat ini.
                </p>
              </div>
              <Button
                type='button'
                variant='destructive'
                onClick={() => setShowLogoutConfirm(true)}
                className='w-full h-10 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 active:bg-destructive/20 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-none'
              >
                Log Out
              </Button>
            </div>
          </div>

          {/* Right Column (lg: 7 cols): Personal & Account Information */}
          <div className='lg:col-span-7 flex flex-col gap-5'>
            {/* Card 2: Informasi Pribadi */}
            <SettingsAccountInfoCard
              email={email}
              phone={displayPhone}
              isEditing={isEditing}
              onPhoneChange={setDraftPhone}
              onRequestChangeEmail={handleRequestChangeEmail}
              onRequestChangePassword={handleRequestChangePassword}
            />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title='Keluar dari Akun?'
        description='Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses sistem.'
        confirmLabel='Log Out'
        cancelLabel='Batal'
        variant='danger'
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
      />
    </div>
  );
}
