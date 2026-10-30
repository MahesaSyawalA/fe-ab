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

  // Standalone full-screen pages (e.g. /sales/pelanggan/tambah or /sales/pelanggan/[id])
  // render without Sidebar and without AppHeader
  const isStandaloneSubpage = /\/pelanggan\/.+/.test(pathname);

  if (isStandaloneSubpage) {
    return (
      <div className='flex min-h-svh w-full min-w-0 flex-col overflow-x-hidden bg-background'>
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <AppHeader role={role} />
        <main className='flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 bg-background'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

