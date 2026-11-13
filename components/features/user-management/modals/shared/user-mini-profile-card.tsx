'use client';

import * as React from 'react';
import { getUserInitials } from '@/lib/auth-helpers';
import { cn } from '@/lib/utils';
import type { ManagedUser, ManagedUserRole } from '../../types';

interface UserMiniProfileCardProps {
  user: ManagedUser;
}

function getRoleBadge(role: ManagedUserRole) {
  switch (role) {
    case 'director':
      return {
        label: 'Director',
        className: 'bg-kanban-pink text-white',
      };
    case 'sales_manager':
      return {
        label: 'Sales Manager',
        className: 'bg-kanban-orange text-white',
      };
    case 'sales':
      return {
        label: 'Sales',
        className: 'bg-kanban-green text-white',
      };
    case 'admin':
      return {
        label: 'Admin',
        className: 'bg-kanban-lightblue text-white',
      };
    default:
      return {
        label: role,
        className: 'bg-slate-500 text-white',
      };
  }
}

export function UserMiniProfileCard({ user }: UserMiniProfileCardProps) {
  const initials = getUserInitials(user.nama);
  const roleBadge = getRoleBadge(user.role);

  return (
    <div className='flex items-center justify-between gap-3 rounded-2xl border border-primary/20 dark:border-primary/30 bg-[#F4F7FF] dark:bg-primary-950/25 p-3.5 sm:p-4'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs select-none shadow-2xs'>
          {initials}
        </div>
        <div className='flex flex-col min-w-0'>
          <span className='font-semibold text-foreground text-xs sm:text-sm truncate' title={user.nama}>
            {user.nama}
          </span>
          <span className='text-xs text-secondary-foreground truncate' title={user.email}>
            {user.email}
          </span>
        </div>
      </div>

      <span
        className={cn(
          'inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold text-white shrink-0 shadow-2xs',
          roleBadge.className
        )}
      >
        {roleBadge.label}
      </span>
    </div>
  );
}

