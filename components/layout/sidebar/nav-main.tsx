'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ElementType
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu className='gap-2'>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={`hover:bg-transparent active:bg-transparent transition-all cursor-pointer group/menu-item group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! ${
                  !isActive ? 'text-foreground hover:text-accent-hover' : ''
                  }`}
                render={<Link href={item.url} />}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors relative ${isActive
                    ? 'bg-accent/10 text-accent before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.75 before:rounded-r-md before:bg-accent'
                    : 'bg-secondary text-foreground group-hover/menu-item:bg-accent/10 group-hover/menu-item:text-accent-hover'
                    }`}
                >
                  <item.icon className='size-4' />
                </div>
                
                <span
                  className={`truncate transition-colors duration-200 group-data-[collapsible=icon]:hidden ${isActive ? 'font-semibold text-accent' : 'font-medium'
                    }`}
                >
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}