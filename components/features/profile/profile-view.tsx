'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { ProfileHeroCard } from './profile-hero-card';
import { ProfileInfoListCard, type ProfileDetailItem } from './profile-info-list-card';
import { formatRoleLabel, getUserInitials } from '@/lib/auth-helpers';
import { useSquadDetailQuery } from '@/hooks/queries/use-squad-query';
import { useUserProfileQuery } from '@/hooks/queries/use-user-query';

export function ProfileView() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfileQuery();

  const user = session?.user;
  const name = userProfile?.nama || user?.nama || user?.name || 'Pengguna';
  const email = userProfile?.email || user?.email || '-';
  const rawRole = userProfile?.role || user?.role;
  const roleLabel = formatRoleLabel(rawRole);
  const initials = getUserInitials(name);

  const squadId = userProfile?.id_squad || user?.id_squad || '';
  const { data: squadData } = useSquadDetailQuery(squadId);

  const phone = userProfile?.no_telp || (user as { no_telp?: string })?.no_telp || '-';
  const squadName = userProfile?.squad?.nama_squad || squadData?.data?.nama_squad || '-';
  const area = userProfile?.squad?.wilayah || squadData?.data?.wilayah || '-';

  const rawCreatedAt = userProfile?.created_at || (user as { created_at?: string })?.created_at;
  const joinDate = rawCreatedAt
    ? new Date(rawCreatedAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  const details: ProfileDetailItem[] = [
    { label: 'Nama Lengkap', value: name },
    { label: 'Email', value: email },
    { label: 'No. Telepon', value: phone },
    { label: 'Squad', value: squadName },
    { label: 'Area', value: area },
    { label: 'Bergabung', value: joinDate },
  ];

  const isLoading = (status === 'loading' || isProfileLoading) && !userProfile && !session;

  return (
    <div className='flex flex-col min-h-full w-full'>
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4'>
        <SubpageHeader
          title='Profil Saya'
          onBack={() => router.back()}
        />
      </div>

      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 pb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start'>
          <div className='lg:col-span-5'>
            <ProfileHeroCard
              name={name}
              email={email}
              roleLabel={roleLabel}
              initials={initials}
              isLoading={isLoading}
            />
          </div>

          <div className='lg:col-span-7'>
            <ProfileInfoListCard
              details={details}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
