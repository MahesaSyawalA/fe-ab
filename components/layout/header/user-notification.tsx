'use client'

import { BellIcon, CheckCheckIcon, FileTextIcon } from 'lucide-react'
import { Badge, Dropdown } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useNotifications } from '@/hooks/queries/use-notification-query'
import { normalizeRole } from '@/lib/rbac'
import { cn } from '@/lib/utils'

export function UserNotification() {
    const router = useRouter()
    const { data: session } = useSession()
    const role = normalizeRole(session?.user?.role)
    const { items, unread, isError, isLoading, markAsRead, markAllAsRead } = useNotifications()
    const unreadLabel = unread > 99 ? '99+' : String(unread)

    const handleOpen = (idNotifikasi: string) => {
        const item = items.find((n) => n.id_notifikasi === idNotifikasi)
        if (!item) return
        if (!item.isRead) markAsRead(item.id_notifikasi)
        if (role) router.push(`/${role}/kanban/${item.id_tiket}`)
    }

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div
                    role='button'
                    tabIndex={0}
                    aria-label='Notifikasi'
                    className='flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background outline-none transition-colors hover:bg-secondary'
                >
                    <Badge.Anchor>
                        <BellIcon size={22} className='text-foreground' />
                        {unread > 0 && (
                            <Badge color='danger' size='sm' placement='top-right'>
                                {unreadLabel}
                            </Badge>
                        )}
                    </Badge.Anchor>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Popover className='w-screen max-w-[calc(100vw-2rem)] sm:max-w-90 p-0 overflow-hidden'>
                <div className='flex w-full flex-col'>

                    <div className='flex items-center justify-between border-b border-border/50 px-4 py-3'>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm font-bold text-foreground'>Notifikasi</p>
                            {unread > 0 && (
                                <div className='flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-[#D84C10] text-[10px] font-bold text-white'>
                                    {unreadLabel}
                                </div>
                            )}
                        </div>
                        <button
                            type='button'
                            onClick={markAllAsRead}
                            disabled={unread === 0}
                            className='flex items-center gap-1 text-xs font-medium text-primary-default cursor-pointer disabled:opacity-50 disabled:cursor-default'
                        >
                            <CheckCheckIcon size={14} />
                            Tandai semua dibaca
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <p className='px-4 py-8 text-center text-xs text-muted-foreground'>
                            {isError ? 'Gagal memuat notifikasi.' : isLoading ? 'Memuat...' : 'Belum ada notifikasi.'}
                        </p>
                    ) : (
                        <Dropdown.Menu
                            aria-label='Daftar Notifikasi'
                            className='max-h-96 overflow-y-auto p-2'
                            onAction={(key) => handleOpen(String(key))}
                        >
                            {items.map((item) => (
                                <Dropdown.Item
                                    key={item.id_notifikasi}
                                    id={item.id_notifikasi}
                                    textValue={item.title}
                                    className={cn(
                                        'mb-1 rounded-lg p-3',
                                        item.isRead
                                            ? 'bg-card border border-border/40 data-[hover=true]:bg-secondary/50'
                                            : 'bg-[#FFF9F5] dark:bg-secondary data-[hover=true]:bg-[#FFF9F5]/80',
                                    )}
                                >
                                    <div className='flex items-start gap-3 w-full'>
                                        <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                            <FileTextIcon size={16} />
                                        </div>
                                        <div className='flex flex-col gap-1 flex-1'>
                                            <p className='text-sm font-semibold text-foreground leading-tight'>{item.title}</p>
                                            <p className='text-xs text-muted-foreground whitespace-normal leading-relaxed'>{item.message}</p>
                                            <p className='text-[10px] text-muted-foreground/60 mt-0.5'>
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: localeId })}
                                            </p>
                                        </div>
                                        {!item.isRead && <div className='size-2.5 rounded-full bg-[#D84C10] shrink-0 mt-1' />}
                                    </div>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    )}
                </div>
            </Dropdown.Popover>
        </Dropdown>
    )
}