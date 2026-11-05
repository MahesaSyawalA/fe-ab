import { Kontak } from '@/types/contact.types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PicCard } from '@/components/ui/pic-card';

interface PelangganPicListProps {
  contacts: Kontak[];
  className?: string;
}

/** Daftar PIC outlet beserta jumlahnya; menampilkan pesan kosong bila belum ada. */
export function PelangganPicList({ contacts, className }: PelangganPicListProps) {
  return (
    <div className={cn('flex flex-col gap-3.5', className)}>
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
  );
}
