'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Kontak } from '@/types/contact.types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PicCard } from '@/components/ui/pic-card';
import { PelangganAddPicModal } from './pelanggan-add-pic-modal';

interface PelangganPicListProps {
  idPelanggan: string;
  contacts: Kontak[];
  canEdit?: boolean;
  className?: string;
}

export function PelangganPicList({
  idPelanggan,
  contacts,
  canEdit = false,
  className,
}: PelangganPicListProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className={cn('flex flex-col gap-3.5', className)}>
      <div className='flex items-center justify-between gap-2'>
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

        {canEdit && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setIsAddOpen(true)}
            className='h-8 gap-1 rounded-lg border-primary/30 bg-primary/5 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer shadow-none'
          >
            <Plus className='size-3.5' />
            <span>Tambah PIC</span>
          </Button>
        )}
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

      {canEdit && (
        <PelangganAddPicModal
          idPelanggan={idPelanggan}
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
        />
      )}
    </div>
  );
}
