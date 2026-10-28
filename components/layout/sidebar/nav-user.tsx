'use client'

import Link from 'next/link'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavUser({ role }: { role: string }) {

  const settingsUrl = `/${role}/pengaturan`

  return (
    <SidebarMenu className='gap-2 mb-2'>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip='Settings'
          className='hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item text-foreground hover:text-accent-hover group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center!'
          render={<Link href={settingsUrl} />}
        >
          <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground group-hover/menu-item:bg-accent/10 group-hover/menu-item:text-accent-hover transition-colors'>
            <SettingsIcon className='size-4' />
          </div>
          <span className='truncate font-medium transition-colors duration-200 group-data-[collapsible=icon]:hidden'>
            Pengaturan
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip='Keluar'
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item text-destructive/500 hover:text-destructive group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center!'
        >
          <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive group-hover/menu-item:bg-destructive/20 transition-colors'>
            <LogOutIcon className='size-4' />
          </div>
          <span className='truncate font-medium transition-colors duration-200 group-data-[collapsible=icon]:hidden'>
            Keluar
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}