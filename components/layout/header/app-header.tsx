'use client'

import { UserNotification } from '@/components/layout/header/user-notification'
import { UserAvatar } from '@/components/layout/header/user-avatar'

interface AppHeaderProps {
    role?: 'sales' | 'manager' | 'director'
}

export function AppHeader({ role }: AppHeaderProps) {
   return (
        <header className='sticky top-0 z-50 flex h-16 w-full max-w-full shrink-0 items-center justify-between border-b border-border/40 bg-background px-6'>
            <div className='flex items-center gap-4'>
                <span className='font-medium text-base text-foreground md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'>
                    AB Medical+
                </span>
            </div>

            <div className='flex items-center gap-4'>
                <UserNotification />
                <UserAvatar role={role} />
            </div>
        </header>
    )
}
