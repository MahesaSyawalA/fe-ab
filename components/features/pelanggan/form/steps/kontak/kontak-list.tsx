import { UserRound } from 'lucide-react';
import { KontakInputItem } from '../../types';
import { KontakListItem } from './kontak-list-item';

interface KontakListProps {
  contacts: KontakInputItem[];
  onRemove: (index: number) => void;
}

export function KontakList({ contacts, onRemove }: KontakListProps) {
  return (
    <div className='md:col-span-5 flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold text-foreground/80'>
          Daftar Kontak Terdaftar
        </span>
        <span className='text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full'>
          {contacts.length} Orang
        </span>
      </div>

      {contacts.length > 0 ? (
        <div className='flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1'>
          {contacts.map((contact, idx) => (
            <KontakListItem
              key={idx}
              contact={contact}
              onRemove={() => onRemove(idx)}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border bg-slate-50/60 text-center gap-2'>
          <UserRound className='size-8 text-muted-foreground/60' />
          <p className='text-xs font-medium text-foreground'>
            Belum ada kontak ditambahkan
          </p>
          <p className='text-[11px] text-muted-foreground max-w-[200px]'>
            Isi form di samping lalu klik &apos;Tambahkan ke Daftar Kontak&apos;
          </p>
        </div>
      )}
    </div>
  );
}
