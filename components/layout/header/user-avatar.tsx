'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Avatar, Dropdown, Label, Chip } from '@heroui/react';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { getUserInitials, formatRoleLabel, logoutUser } from '@/lib/auth-helpers';

interface UserAvatarProps {
  role?: 'sales' | 'manager' | 'director';
}

export function UserAvatar({ role }: UserAvatarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const userName = user?.nama || user?.name || 'Pengguna';
  const userEmail = user?.email || '-';
  const userRole = user?.role || role || 'sales';
  const displayRole = formatRoleLabel(userRole);
  const initials = getUserInitials(userName);

  const routeRole =
    role || (userRole === 'sales_manager' ? 'manager' : userRole);
  const settingsUrl = `/${routeRole}/pengaturan`;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div
          role='button'
          tabIndex={0}
          aria-label='User Profile'
          className='cursor-pointer outline-none transition-transform hover:scale-105 active:scale-95'
        >
          <Avatar className='rounded-sm text-white size-10 bg-accent-default'>
            <Avatar.Fallback className='font-medium text-sm bg-transparent text-card'>
              {initials}
            </Avatar.Fallback>
          </Avatar>
        </div>
      </Dropdown.Trigger>

      <Dropdown.Popover className='w-64 max-w-[calc(100vw-2rem)] p-0'>
        <div className='flex w-full flex-col'>
          <div className='flex items-start gap-3 border-b border-border/50 px-4 py-4'>
            <Avatar className='shrink-0 rounded-full bg-accent-default text-white size-12'>
              <Avatar.Fallback className='bg-transparent text-base font-medium text-card'>
                {initials}
              </Avatar.Fallback>
            </Avatar>
            <div className='flex flex-col items-start gap-0.5 min-w-0'>
              <p
                className='text-sm font-semibold leading-none text-foreground truncate max-w-[150px]'
                title={userName}
              >
                {userName}
              </p>
              <p
                className='mb-1 text-xs text-muted-foreground truncate max-w-[150px]'
                title={userEmail}
              >
                {userEmail}
              </p>
              <Chip
                size='sm'
                className='h-5 px-1.5 text-[11px] bg-accent/10 text-accent rounded-sm border border-accent/10 font-semibold'
              >
                {displayRole}
              </Chip>
            </div>
          </div>

          <Dropdown.Menu aria-label='User Actions' className='p-2'>
            <Dropdown.Item
              id='profile'
              textValue='Profil'
              className='mb-1 px-3 py-2.5 cursor-pointer'
              onAction={() => router.push(settingsUrl)}
            >
              <div className='flex items-center gap-3'>
                <UserIcon className='size-4 text-foreground' />
                <Label className='cursor-pointer font-medium text-foreground'>
                  Profil Saya
                </Label>
              </div>
            </Dropdown.Item>

            <Dropdown.Item
              id='settings'
              textValue='Pengaturan'
              className='mb-1 px-3 py-2.5 cursor-pointer'
              onAction={() => router.push(settingsUrl)}
            >
              <div className='flex items-center gap-3'>
                <SettingsIcon className='size-4 text-foreground' />
                <Label className='cursor-pointer font-medium text-foreground'>
                  Pengaturan
                </Label>
              </div>
            </Dropdown.Item>

            <Dropdown.Item
              id='logout'
              textValue='Keluar'
              variant='danger'
              className='cursor-pointer'
              onAction={() => logoutUser()}
            >
              <div className='flex items-center gap-3 text-danger'>
                <LogOutIcon className='size-4' />
                <Label className='cursor-pointer font-medium text-danger'>
                  Keluar
                </Label>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </div>
      </Dropdown.Popover>
    </Dropdown>
  );
}
