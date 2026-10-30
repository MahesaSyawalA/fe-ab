'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavUser({ role }: { role: string }) {

  const pathname = usePathname()

  const settingsUrl = `/${role}/pengaturan`

  const isActive = pathname.startsWith(settingsUrl)

  return (
    <SidebarMenu className='gap-2.5 mb-2'>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip='Settings'
          className={`hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:overflow-visible! ${!isActive ? 'text-foreground hover:text-accent-hover' : ''
            }`}
          render={<Link href={settingsUrl} />}
        >
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors relative ${isActive
                ? 'bg-accent/10 text-accent before:absolute before:-left-1.5 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.75 before:rounded-r-md before:bg-accent'
                : 'bg-secondary text-foreground group-hover/menu-item:bg-accent/10 group-hover/menu-item:text-accent-hover'
              }`}
          >
            <SettingsIcon className='size-4' />
          </div>
          <span
            className={`truncate transition-colors duration-200 group-data-[collapsible=icon]:hidden ${isActive ? 'font-semibold text-accent' : 'font-medium'
              }`}
          >
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
          <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover/menu-item:bg-destructive/20 transition-colors'>
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
