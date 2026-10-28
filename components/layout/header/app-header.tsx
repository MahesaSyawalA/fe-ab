'use client'

import { UserNotification } from '@/components/layout/header/user-notification'
import { UserAvatar } from '@/components/layout/header/user-avatar'

interface AppHeaderProps {
    role?: 'sales' | 'manager' | 'director'
}

export function AppHeader({ role }: AppHeaderProps) {
    return (
        <header className='flex h-16 shrink-0 items-center justify-between px-6 bg-background relative'>
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