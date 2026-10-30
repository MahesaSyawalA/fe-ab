'use client';

import * as React from 'react';
import { Check, ContactRound, Crosshair, ExternalLink, MapPin } from 'lucide-react';
import { PelangganWithDetails } from '@/types/customer.types';
import { StatCard } from '@/components/ui/stat-card';
import { SubpageHeader } from '@/components/ui/subpage-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pelanggan.latitude},${pelanggan.longitude}`;

  return (
    <div className='mx-auto flex min-h-svh md:min-h-0 w-full max-w-xl md:max-w-6xl lg:max-w-7xl min-w-0 flex-col bg-background pb-12'>
      {/* Top Header */}
      <SubpageHeader
        title='Detail Pelanggan'
        subtitle='Informasi lengkap profil outlet, data geolokasi GPS, dan kontak PIC'
        onBack={onBack}
      />

      {/* Hero Banner with Building Image */}
      <div className='relative h-52 md:h-64 lg:h-72 w-full overflow-hidden bg-slate-900 md:rounded-3xl md:border md:border-border/60 md:shadow-sm'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            pelanggan.img_url ||
            'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80'
          }
          alt={pelanggan.nama_faskes}
          className='size-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10' />

        <div className='absolute inset-x-4 md:inset-x-8 bottom-4 md:bottom-6 flex flex-col gap-2 text-white'>
          <div className='flex flex-wrap items-center gap-2 md:gap-2.5'>
            <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm'>
              {pelanggan.nama_faskes}
            </h2>
            <Badge className='h-5 md:h-6 rounded-md bg-primary-default px-2 md:px-2.5 text-[11px] md:text-xs font-semibold text-white'>
              {pelanggan.tipe_faskes}
            </Badge>
            <Badge className='h-5 md:h-6 gap-1 rounded-md bg-success px-2 md:px-2.5 text-[11px] md:text-xs font-semibold text-white'>
              <Check className='size-3 stroke-[2.5]' />
              {pelanggan.status || 'Aktif'}
            </Badge>
          </div>

          <div className='flex items-center gap-1.5 text-xs md:text-sm text-white/90'>
            <MapPin className='size-3.5 shrink-0 text-white/80' />
            <p className='leading-relaxed line-clamp-2 md:line-clamp-none max-w-3xl'>
              {pelanggan.alamat}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Metric Statistics Band */}
      <div className='bg-card px-4 md:px-6 py-3.5 md:py-4 shadow-2xs md:rounded-2xl md:border md:border-border/60 md:mt-4'>
        <div className='grid grid-cols-3 gap-2.5 md:gap-6'>
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

      {/* Main Content: 2 Columns on Desktop (7:5) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 px-4 md:px-0 pt-4 md:pt-6 items-start'>
        {/* Left Column: Lokasi & Koordinat (7 cols on Desktop) */}
        <div className='lg:col-span-7 flex flex-col gap-4'>
          <Card
            size='sm'
            className='rounded-2xl border border-border ring-0 py-4 md:py-5 shadow-2xs bg-card'
          >
            <CardContent className='gap-4 px-4 md:px-5'>
              <div className='flex items-center justify-between'>
                <SectionHeader
                  icon={<ContactRound className='size-4' />}
                  title='Lokasi & Koordinat'
                />
                <Button
                  variant='ghost'
                  size='sm'
                  render={
                    <a
                      href={googleMapsUrl}
                      target='_blank'
                      rel='noreferrer'
                    />
                  }
                  className='h-8 gap-1.5 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 cursor-pointer'
                >
                  <ExternalLink className='size-3.5' />
                  <span className='hidden sm:inline'>Buka di Maps</span>
                </Button>
              </div>

              <p className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
                {pelanggan.alamat}
              </p>

              {/* Map with bottom-right GPS Siap badge */}
              <div className='relative w-full overflow-hidden rounded-xl border border-border/80'>
                <div className='block md:hidden'>
                  <PelangganMap
                    latitude={pelanggan.latitude}
                    longitude={pelanggan.longitude}
                    title={pelanggan.nama_faskes}
                    interactive={false}
                    height='175px'
                  />
                </div>
                <div className='hidden md:block'>
                  <PelangganMap
                    latitude={pelanggan.latitude}
                    longitude={pelanggan.longitude}
                    title={pelanggan.nama_faskes}
                    interactive={true}
                    height='280px'
                  />
                </div>
                <Badge className='absolute right-3 bottom-3 z-10 h-6 rounded-md bg-kanban-green px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs'>
                  GPS Siap
                </Badge>
              </div>

              {/* Coordinate detail box */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-[#F8FAFC] p-3.5'>
                <div className='flex items-center gap-3 min-w-0'>
                  <Avatar className='rounded-lg after:rounded-lg after:border-0 shrink-0'>
                    <AvatarFallback className='rounded-lg bg-accent/10 text-accent'>
                      <Crosshair className='size-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-col'>
                    <span className='text-xs font-bold text-foreground leading-tight'>
                      Titik koordinat GPS
                    </span>
                    <span className='mt-0.5 truncate font-mono text-[11px] sm:text-xs text-secondary-foreground'>
                      Lat: {pelanggan.latitude.toFixed(6)} &nbsp;|&nbsp; Long:{' '}
                      {pelanggan.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>

                <div className='text-left sm:text-right text-[11px] text-muted-foreground border-t sm:border-t-0 pt-2 sm:pt-0'>
                  Radius Check-in:{' '}
                  <span className='font-semibold text-foreground'>
                    {pelanggan.radius_kunjungan || 200} m
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Daftar PIC (5 cols on Desktop) */}
        <div className='lg:col-span-5 flex flex-col gap-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h3 className='text-sm sm:text-base font-bold text-foreground'>
                Daftar PIC
              </h3>
              <Badge
                variant='secondary'
                className='size-5 rounded-full bg-primary/12 p-0 text-[11px] font-bold text-primary flex items-center justify-center'
              >
                {contacts.length}
              </Badge>
            </div>
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
              className='rounded-2xl border border-border ring-0 py-8 text-center shadow-none bg-card'
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
