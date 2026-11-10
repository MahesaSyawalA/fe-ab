'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { ProfileHeroCard } from './profile-hero-card';
import { ProfileInfoListCard, type ProfileDetailItem } from './profile-info-list-card';
import { formatRoleLabel, getUserInitials } from '@/lib/auth-helpers';
import { useSquadDetailQuery } from '@/hooks/queries/use-squad-query';

export function ProfileView() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const name = user?.nama || user?.name || 'Maulana Tri';
  const email = user?.email || 'maulana@abmedical.id';
  const rawRole = user?.role;
  const roleLabel = formatRoleLabel(rawRole);
  const initials = getUserInitials(name);

  // Optional squad detail query if id_squad is present
  const squadId = user?.id_squad || '';
  const { data: squadData } = useSquadDetailQuery(squadId);

  const phone = (user as { no_telp?: string })?.no_telp || '0812-9876-5432';
  const squadName = squadData?.data?.nama_squad || 'Squad Jakarta 1';
  const area = squadData?.data?.wilayah || 'Jakarta';
  const joinDate = (user as { created_at?: string })?.created_at
    ? new Date((user as { created_at?: string }).created_at || '').toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '03 Jan 2025';

  const details: ProfileDetailItem[] = [
    { label: 'Nama Lengkap', value: name },
    { label: 'Email', value: email },
    { label: 'No. Telepon', value: phone },
    { label: 'Squad', value: squadName },
    { label: 'Area', value: area },
    { label: 'Bergabung', value: joinDate },
  ];

  return (
    <div className='flex flex-col min-h-full w-full'>
      {/* Container Header & Breadcrumb Aligned with Grid */}
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4'>
        <SubpageHeader
          title='Profil Saya'
          onBack={() => router.back()}
        />
      </div>

      {/* Main Content Area - Responsive 2-Col Grid on Desktop (lg:) */}
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 pb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start'>
          {/* Left Column (lg: 5 cols): Profile Hero Card */}
          <div className='lg:col-span-5'>
            <ProfileHeroCard
              name={name}
              email={email}
              roleLabel={roleLabel}
              initials={initials}
            />
          </div>

          {/* Right Column (lg: 7 cols): Detailed Account Information */}
          <div className='lg:col-span-7'>
            <ProfileInfoListCard details={details} />
          </div>
        </div>
      </div>
    </div>
  );
}
