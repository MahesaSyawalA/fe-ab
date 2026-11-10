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
import { useUserProfileQuery, useUpdateProfileMutation } from '@/hooks/queries/use-user-query';
import { updateProfileSchema } from '@/schemas/profile.schema';
import { toast } from '@heroui/react';
import { getErrorMessage } from '@/lib/axios';

export function SettingsView() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  // 1. Data Layer: Fetch profil pengguna riil dari server
  const { data: userProfile } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const user = userProfile || session?.user;
  const rawRole = user?.role;
  const displayRole = formatRoleLabel(rawRole);

  const baseName = user?.nama || (user as { name?: string })?.name || 'Pengguna';
  const basePhone = user?.no_telp || (session?.user as { no_telp?: string })?.no_telp || '';
  const email = user?.email || session?.user?.email || '-';

  // 2. State Form Edit Profil & Telepon Terpadu
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState<string>(baseName);
  const [draftPhone, setDraftPhone] = React.useState<string>(basePhone);

  // 3. State Modal
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [showSecurityModal, setShowSecurityModal] = React.useState(false);

  const displayName = isEditing ? draftName : baseName;
  const displayPhone = isEditing ? draftPhone : basePhone;
  const initials = getUserInitials(displayName);

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

  const handleSaveEdit = async () => {
    const userId = userProfile?.id_user || session?.user?.id_user || session?.user?.id;
    if (!userId) {
      toast.danger('Gagal Menyimpan', {
        description: 'Sesi pengguna tidak valid. Silakan muat ulang halaman.',
      });
      return;
    }

    // Validasi Zod Schemas
    const validation = updateProfileSchema.safeParse({
      nama: draftName,
      no_telp: draftPhone,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data yang dimasukkan tidak valid';
      toast.danger('Validasi Gagal', {
        description: firstError,
      });
      return;
    }

    try {
      // 1. Jalankan mutasi ke backend API
      const updatedUser = await updateProfileMutation.mutateAsync({
        id: userId,
        data: {
          nama: validation.data.nama,
          no_telp: validation.data.no_telp,
        },
      });

      // 2. Notifikasi Toast Sukses HeroUI
      toast.success('Profil Berhasil Diperbarui', {
        description: 'Informasi profil Anda telah disimpan ke sistem.',
      });

      // 3. Sinkronisasi Sesi NextAuth seketika
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.data?.nama || validation.data.nama,
            nama: updatedUser.data?.nama || validation.data.nama,
            no_telp: updatedUser.data?.no_telp || validation.data.no_telp,
          },
        });
      }

      setIsEditing(false);
    } catch (error) {
      toast.danger('Gagal Memperbarui Profil', {
        description: getErrorMessage(error) || 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.',
      });
    }
  };

  const handleAvatarClick = () => {
    toast.info('Fitur Foto Profil Segera Hadir', {
      description: 'Saat ini avatar otomatis menggunakan inisial nama Anda.',
    });
  };

  const handleRequestChangeSecurity = () => {
    setShowSecurityModal(true);
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
              isSaving={updateProfileMutation.isPending}
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
              isSaving={updateProfileMutation.isPending}
              onPhoneChange={setDraftPhone}
              onRequestChangeEmail={handleRequestChangeSecurity}
              onRequestChangePassword={handleRequestChangeSecurity}
            />
          </div>
        </div>
      </div>

      {/* Modal Dialog Keamanan untuk Request Ubah Email / Password */}
      <ConfirmModal
        open={showSecurityModal}
        onOpenChange={setShowSecurityModal}
        title='Permintaan Perubahan Akun'
        description='Untuk alasan keamanan data medis, silakan hubungi Administrator atau IT Support untuk memproses perubahan email dan kata sandi akun Anda.'
        confirmLabel='Mengerti'
        cancelLabel='Tutup'
        variant='warning'
        onConfirm={() => setShowSecurityModal(false)}
      />

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
