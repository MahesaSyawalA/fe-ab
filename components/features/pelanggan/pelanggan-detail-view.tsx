'use client';

import * as React from 'react';
import { Check, ContactRound, Crosshair } from 'lucide-react';
import { PelangganWithDetails } from '@/types/customer.types';
import { StatCard } from '@/components/ui/stat-card';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PicCard } from '@/components/ui/pic-card';
import { PelangganMap } from './pelanggan-map';

interface PelangganDetailViewProps {
  pelanggan: PelangganWithDetails;
  onBack: () => void;
}

export function PelangganDetailView({
  pelanggan,
  onBack,
}: PelangganDetailViewProps) {
  const contacts = pelanggan.kontak_list || [];

  return (
    <div className='mx-auto flex min-h-svh w-full max-w-xl min-w-0 flex-col bg-background pb-10'>
      {/* Top Bar without Sidebar */}
      <SubpageHeader title='Detail Pelanggan' onBack={onBack} />

      {/* Full-Bleed Hero Banner with Building Image */}
      <div className='relative h-52 w-full overflow-hidden bg-slate-900'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            pelanggan.img_url ||
            'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80'
          }
          alt={pelanggan.nama_faskes}
          className='size-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent' />

        <div className='absolute inset-x-4 bottom-4 flex flex-col gap-1.5 text-white'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-base sm:text-lg font-bold tracking-tight text-white'>
              {pelanggan.nama_faskes}
            </h2>
            <Badge className='h-5 rounded-md bg-primary-default px-2 py-0.5 text-[11px] font-medium text-white'>
              {pelanggan.tipe_faskes}
            </Badge>
            <Badge className='h-5 gap-1 rounded-md bg-success px-2 py-0.5 text-[11px] font-medium text-white'>
              <Check className='size-3 stroke-[2.5]' />
              {pelanggan.status || 'Aktif'}
            </Badge>
          </div>

          <p className='text-xs text-white/90 leading-relaxed line-clamp-2'>
            {pelanggan.alamat}
          </p>
        </div>
      </div>

      {/* 3-Column Left-Aligned Metric Statistics Band */}
      <div className='bg-card px-4 py-3.5 shadow-2xs'>
        <div className='grid grid-cols-3 gap-2.5'>
          <StatCard
            value={pelanggan.tiket_aktif ?? 3}
            label='Tiket aktif'
            align='left'
          />
          <StatCard
            value={pelanggan.total_kunjungan ?? 12}
            label='Kunjungan'
            align='left'
          />
          <StatCard
            value={pelanggan.estimasi_nilai || 'Rp1,8 M'}
            label='Estimasi'
            align='left'
          />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className='flex flex-col gap-4 px-4 pt-4'>
        {/* Section: Lokasi & Koordinat */}
        <Card
          size='sm'
          className='rounded-2xl border border-border ring-0 py-4 shadow-2xs'
        >
          <CardContent className='gap-3 px-4'>
            <SectionHeader
              icon={<ContactRound className='size-4' />}
              title='Lokasi & Koordinat'
            />

            <p className='text-xs text-secondary-foreground leading-relaxed'>
              {pelanggan.alamat}
            </p>

            {/* Map with bottom-right GPS Siap badge */}
            <div className='relative w-full overflow-hidden rounded-xl'>
              <PelangganMap
                latitude={pelanggan.latitude}
                longitude={pelanggan.longitude}
                title={pelanggan.nama_faskes}
                interactive={false}
                height='165px'
              />
              <Badge className='absolute right-2.5 bottom-2.5 z-10 h-5 rounded-md bg-kanban-green px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs'>
                GPS Siap
              </Badge>
            </div>

            {/* Coordinate detail box */}
            <div className='flex items-center gap-3 rounded-xl border border-border bg-[#F8FAFC] p-3'>
              <Avatar className='rounded-lg after:rounded-lg after:border-0'>
                <AvatarFallback className='rounded-lg bg-accent/10 text-accent'>
                  <Crosshair className='size-4' />
                </AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-col'>
                <span className='text-xs font-bold text-foreground leading-tight'>
                  Titik koordinat
                </span>
                <span className='mt-0.5 truncate font-mono text-[11px] text-secondary-foreground'>
                  Lat : {pelanggan.latitude.toFixed(5)} &nbsp;|&nbsp; Long :{' '}
                  {pelanggan.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section: Daftar PIC */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm sm:text-base font-bold text-foreground'>
              Daftar PIC
            </h3>
            <Badge
              variant='secondary'
              className='size-5 rounded-full bg-primary/12 p-0 text-[11px] font-bold text-primary'
            >
              {contacts.length}
            </Badge>
          </div>

          {contacts.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {contacts.map((contact) => (
                <PicCard
                  key={contact.id_kontak}
                  nama={contact.nama}
                  jabatan={contact.jabatan}
                  noTelp={contact.no_telp}
                  email={contact.email}
                  kategoriPeran={contact.kategori_peran}
                  inisial={contact.inisial}
                />
              ))}
            </div>
          ) : (
            <Card
              size='sm'
              className='rounded-2xl border border-border ring-0 py-8 text-center shadow-none'
            >
              <CardContent className='text-xs text-muted-foreground'>
                Belum ada PIC yang didaftarkan untuk outlet ini.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
