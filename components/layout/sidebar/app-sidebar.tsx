'use client'

import * as React from 'react'
import Image from 'next/image'
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

import { salesMenu, managerMenu, directorMenu } from '@/constants/sidebar-menus'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: 'sales' | 'manager' | 'director'
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const { toggleSidebar, state, isMobile, openMobile } = useSidebar()

  const menuItems =
    role === 'sales' ? salesMenu :
      role === 'manager' ? managerMenu :
        directorMenu;

  const isExpanded = isMobile ? openMobile : state === 'expanded'

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='mt-3 group-data-[collapsible=icon]:mt-3 group-data-[collapsible=icon]:px-0 transition-all'>
        <SidebarMenu>
          <SidebarMenuItem className='w-full'>
            <div className='relative flex items-center justify-between w-full px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 transition-all'>
              <div className='flex items-center gap-2'>
                <div className='flex aspect-square size-10 group-data-[collapsible=icon]:size-9 items-center justify-center rounded-xl bg-card p-0.5 border border-border shrink-0 transition-all'>
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
                type='button'
                onClick={toggleSidebar}
                className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-hover transition-all cursor-pointer md:absolute md:-right-5 md:top-1/2 md:-translate-y-1/2 group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-3 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-y-1/2 in-data-[mobile=true]:static in-data-[mobile=true]:translate-y-0 z-30'
                title={isExpanded ? 'Tutup Sidebar' : 'Buka Sidebar'}
              >
                {isExpanded ? (
                  <ChevronLeft className='size-3.5 stroke-[2.5]' />
                ) : (
                  <ChevronRight className='size-3.5 stroke-[2.5]' />
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

      <SidebarSeparator className='mx-auto mb-1 w-8 group-data-[state=expanded]:w-auto' />

      <SidebarFooter>
        <NavUser role={role} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
