'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { AppHeader } from '@/components/layout/header/app-header';
import { normalizeRole } from '@/lib/rbac';

interface RoleLayoutShellProps {
  role: 'sales' | 'manager' | 'director';
  children: React.ReactNode;
}

export function RoleLayoutShell({ role, children }: RoleLayoutShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const activeRole = normalizeRole(session?.user?.role) || normalizeRole(role) || 'sales';

  // Standalone full-screen pages (e.g. /pelanggan/tambah, /kanban/[id], /squad/tambah, /pengaturan, /profile)
  // render without Sidebar and without AppHeader on mobile
  const isStandaloneSubpage =
    /\/(pelanggan|kanban|squad)\/.+/.test(pathname) ||
    /\/(pengaturan|profile|profil)/.test(pathname);

  if (isStandaloneSubpage) {
    return (
      <SidebarProvider>
        <div className='hidden md:contents'>
          <AppSidebar role={activeRole} hideOnMobile />
        </div>
        <SidebarInset className='min-w-0 max-w-full overflow-x-clip'>
          <AppHeader role={activeRole} className='hidden md:flex' />
          <div className='flex min-w-0 max-w-full flex-1 flex-col overflow-x-clip bg-background p-0 md:p-6 lg:p-8'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={activeRole} />
      <SidebarInset className='min-w-0 max-w-full overflow-x-clip'>
        <AppHeader role={activeRole} />
        <div className='flex min-w-0 max-w-full flex-1 flex-col gap-4 overflow-x-clip p-4 bg-background'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
