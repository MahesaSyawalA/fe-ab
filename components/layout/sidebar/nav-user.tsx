'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LogOutIcon, SettingsIcon } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { getUserInitials, formatRoleLabel, logoutUser } from '@/lib/auth-helpers';
import { normalizeRole } from '@/lib/rbac';

export function NavUser({ role }: { role: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const user = session?.user;
  const userName = user?.nama || user?.name || 'Pengguna';
  const userEmail = user?.email || '';
  const activeRole = normalizeRole(user?.role) || normalizeRole(role) || 'sales';
  const displayRole = formatRoleLabel(user?.role || role);
  const initials = getUserInitials(userName);

  const settingsUrl = `/${activeRole}/pengaturan`;
  const isActive = pathname.startsWith(settingsUrl);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
  };

  return (
    <>
      <SidebarMenu className='gap-2 mb-2'>
        {/* Profil Ringkas Pengguna (Hanya tampil saat Sidebar terbuka) */}
        <SidebarMenuItem className='group-data-[collapsible=icon]:hidden px-2 py-1 mb-1'>
          <div className='flex items-center gap-2.5 overflow-hidden'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-default text-white font-semibold text-xs'>
              {initials}
            </div>
            <div className='flex flex-col min-w-0 leading-tight'>
              <span className='text-xs font-semibold text-foreground truncate' title={userName}>
                {userName}
              </span>
              <span className='text-[10px] text-muted-foreground truncate' title={userEmail || displayRole}>
                {displayRole}
              </span>
            </div>
          </div>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip='Settings'
            className={`hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:overflow-visible! ${
              !isActive ? 'text-foreground hover:text-accent-hover' : ''
            }`}
            render={<Link href={settingsUrl} />}
          >
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors relative ${
                isActive
                  ? 'bg-accent/10 text-accent before:absolute before:-left-1.5 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.75 before:rounded-r-md before:bg-accent'
                  : 'bg-secondary text-foreground group-hover/menu-item:bg-accent/10 group-hover/menu-item:text-accent-hover'
              }`}
            >
              <SettingsIcon className='size-4' />
            </div>
            <span
              className={`truncate transition-colors duration-200 group-data-[collapsible=icon]:hidden ${
                isActive ? 'font-semibold text-accent' : 'font-medium'
              }`}
            >
              Pengaturan
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip='Keluar'
            onClick={() => setShowLogoutConfirm(true)}
            className='hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item text-destructive hover:text-destructive group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center!'
          >
            <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover/menu-item:bg-destructive/20 transition-colors'>
              <LogOutIcon className='size-4' />
            </div>
            <span className='truncate font-medium transition-colors duration-200 group-data-[collapsible=icon]:hidden'>
              Keluar
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <ConfirmModal
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title='Keluar dari akun?'
        description='Jika Anda melakukan ini, Anda harus masuk kembali untuk mengakses akun Anda.'
        confirmLabel='Keluar'
        cancelLabel='Batal'
        icon={<LogOutIcon className='size-7 text-rose-600' />}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
