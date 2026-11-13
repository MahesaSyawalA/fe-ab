'use client'

import * as React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { normalizeRole } from '@/lib/rbac'
import { salesMenu, managerMenu, directorMenu, adminMenu } from '@/constants/sidebar-menus'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: 'sales' | 'manager' | 'director' | 'admin'
  hideOnMobile?: boolean
}

export function AppSidebar({ role, hideOnMobile, ...props }: AppSidebarProps) {
  const { toggleSidebar, state, isMobile, openMobile } = useSidebar()
  const { data: session } = useSession()

  // Prioritaskan role user dari session aktif yang dinormalisasi (toLowerCase)
  const activeRole = normalizeRole(session?.user?.role) || normalizeRole(role) || 'sales'

  if (hideOnMobile && isMobile) {
    return null
  }

  const menuItems =
    activeRole === 'admin'
      ? adminMenu
      : activeRole === 'director'
        ? directorMenu
        : activeRole === 'manager'
          ? managerMenu
          : salesMenu

  const isExpanded = isMobile ? openMobile : state === 'expanded'

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='mt-4 group-data-[collapsible=icon]:mt-2 transition-all'>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex items-center justify-between w-full px-1 group-data-[collapsible=icon]:px-0 transition-all'>
              <div className='flex items-center gap-2'>
                <div className='flex aspect-square size-10 group-data-[collapsible=icon]:size-8 items-center justify-center rounded-lg bg-card p-0.5 border border-border shrink-0 transition-all'>
                  <Image
                    src='/assets/logos/ab-medical-app-logo.jpeg'
                    alt='AB Medical Logo'
                    width={32}
                    height={32}
                    className='object-contain w-8 h-8 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 transition-all'
                  />
                </div>
                <div className='flex flex-col gap-0.5 leading-none transition-all duration-300 ease-in-out overflow-hidden group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0'>
                  <span className='font-normal text-base text-foreground whitespace-nowrap'>
                    AB Medical+
                  </span>
                  <span className='text-xs text-secondary-foreground whitespace-nowrap'>
                    CRM Management
                  </span>
                </div>
              </div>

              <button
                onClick={toggleSidebar}
                className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors'
              >
                {isExpanded ? (
                  <ChevronLeft className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </button>

            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className='mx-auto mt-2 mb-2 group-data-[collapsible=icon]:hidden' />

      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser role={activeRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}