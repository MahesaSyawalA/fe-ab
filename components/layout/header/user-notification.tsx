'use client'

import { BellIcon, CheckCheckIcon, FileTextIcon } from 'lucide-react'
import { Badge, Dropdown } from '@heroui/react'

export function UserNotification() {
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
                        <Badge color='danger' size='sm' placement='top-right'>
                            2
                        </Badge>
                    </Badge.Anchor>
                </div>
            </Dropdown.Trigger>

            <Dropdown.Popover className='w-screen max-w-[calc(100vw-2rem)] sm:max-w-90 p-0 overflow-hidden'>
                <div className='flex w-full flex-col'>

                    <div className='flex items-center justify-between border-b border-border/50 px-4 py-3'>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm font-bold text-foreground'>Notifikasi</p>
                            <div className='flex size-5 items-center justify-center rounded-full bg-[#D84C10] text-[10px] font-bold text-white'>
                                2
                            </div>
                        </div>
                        <button className='flex items-center gap-1 text-xs font-medium text-primary-default cursor-pointer'>
                            <CheckCheckIcon size={14} />
                            Tandai semua dibaca
                        </button>
                    </div>

                    <Dropdown.Menu aria-label='Daftar Notifikasi' className='max-h-96 overflow-y-auto p-2'>

                        <Dropdown.Item
                            id='notif-1'
                            textValue='Tiket baru'
                            className='mb-1 rounded-lg bg-[#FFF9F5] p-3 data-[hover=true]:bg-[#FFF9F5]/80'
                        >
                            <div className='flex items-start gap-3 w-full'>
                                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                    <FileTextIcon size={16} />
                                </div>
                                <div className='flex flex-col gap-1 flex-1'>
                                    <p className='text-sm font-semibold text-foreground leading-tight'>Tiket baru ditugaskan ke kamu</p>
                                    <p className='text-xs text-muted-foreground whitespace-normal leading-relaxed'>Tiket #1042 dari RS Harapan menunggu follow up.</p>
                                    <p className='text-[10px] text-muted-foreground/60 mt-0.5'>5 menit lalu</p>
                                </div>
                                <div className='size-2.5 rounded-full bg-[#D84C10] shrink-0 mt-1' />
                            </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                            id='notif-2'
                            textValue='Penawaran disetujui'
                            className='mb-1 rounded-lg bg-[#FFF9F5] p-3 data-[hover=true]:bg-[#FFF9F5]/80'
                        >
                            <div className='flex items-start gap-3 w-full'>
                                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                    <FileTextIcon size={16} />
                                </div>
                                <div className='flex flex-col gap-1 flex-1'>
                                    <p className='text-sm font-semibold text-foreground leading-tight'>Penawaran disetujui</p>
                                    <p className='text-xs text-muted-foreground whitespace-normal leading-relaxed'>Penawaran PT Medika Sehat telah disetujui klien.</p>
                                    <p className='text-[10px] text-muted-foreground/60 mt-0.5'>1 jam lalu</p>
                                </div>
                                <div className='size-2.5 rounded-full bg-[#D84C10] shrink-0 mt-1' />
                            </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                            id='notif-3'
                            textValue='Jadwal diubah'
                            className='rounded-lg bg-white p-3 data-[hover=true]:bg-secondary/50 border border-border/40'
                        >
                            <div className='flex items-start gap-3 w-full'>
                                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                    <FileTextIcon size={16} />
                                </div>
                                <div className='flex flex-col gap-1 flex-1'>
                                    <p className='text-sm font-semibold text-foreground leading-tight'>Jadwal kunjungan diubah</p>
                                    <p className='text-xs text-muted-foreground whitespace-normal leading-relaxed'>Kunjungan ke RS Sentosa dipindah ke Kamis, 10.00.</p>
                                    <p className='text-[10px] text-muted-foreground/60 mt-0.5'>Kemarin</p>
                                </div>
                            </div>
                        </Dropdown.Item>

                    </Dropdown.Menu>

                    <div className='border-t border-border/50 p-3 text-center'>
                        <button className='text-sm font-semibold text-primary-default cursor-pointer'>
                            Lihat semua notifikasi
                        </button>
                    </div>
                </div>
            </Dropdown.Popover>
        </Dropdown>
    )
}