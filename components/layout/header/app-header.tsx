'use client'

import { cn } from '@/lib/utils'
import { UserNotification } from '@/components/layout/header/user-notification'
import { UserAvatar } from '@/components/layout/header/user-avatar'

interface AppHeaderProps {
    role?: 'sales' | 'manager' | 'director'
    className?: string
}

export function AppHeader({ role, className }: AppHeaderProps) {
   return (
        <header className={cn('sticky top-0 z-40 flex h-16 w-full max-w-full shrink-0 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 px-4 sm:px-6 transition-all', className)}>
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
