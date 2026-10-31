'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { AppHeader } from '@/components/layout/header/app-header';

interface RoleLayoutShellProps {
  role: 'sales' | 'manager' | 'director';
  children: React.ReactNode;
}

export function RoleLayoutShell({ role, children }: RoleLayoutShellProps) {
  const pathname = usePathname();

  // Standalone full-screen pages (e.g. /pelanggan/tambah, /pelanggan/[id], /kanban/tambah, /kanban/[id])
  // render without Sidebar and without AppHeader
  const isStandaloneSubpage = /\/(pelanggan|kanban)\/.+/.test(pathname);

  if (isStandaloneSubpage) {
    return (
      <SidebarProvider>
        <div className='hidden md:contents'>
          <AppSidebar role={role} hideOnMobile />
        </div>
        <SidebarInset className='min-w-0 max-w-full overflow-x-clip'>
          <AppHeader role={role} className='hidden md:flex' />
          <div className='flex min-w-0 max-w-full flex-1 flex-col overflow-x-clip bg-background p-0 md:p-6 lg:p-8'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset className='min-w-0 max-w-full overflow-x-clip'>
        <AppHeader role={role} />
        <div className='flex min-w-0 max-w-full flex-1 flex-col gap-4 overflow-x-clip p-4 bg-background'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
