import { Briefcase, Mail, Phone, User, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PelangganTextInput } from '../../../inputs';
import { KontakInputItem } from '../../types';

interface KontakDraftFormProps {
  draft: KontakInputItem;
  onChange: (fields: Partial<KontakInputItem>) => void;
  isDraftValid: boolean;
  onAdd: () => void;
}

/** Kolom kiri: formulir satu kontak PIC + tombol "Tambahkan ke Daftar Kontak". */
export function KontakDraftForm({
  draft,
  onChange,
  isDraftValid,
  onAdd,
}: KontakDraftFormProps) {
  return (
    <div className='md:col-span-7 flex flex-col gap-3.5'>

      <PelangganTextInput
        label='Nama Lengkap'
        required
        icon={<User className='size-4' />}
        value={draft.nama}
        onChange={(val) => onChange({ nama: val })}
        placeholder='Contoh: dr. Budi Santoso'
      />

      <PelangganTextInput
        label='Jabatan'
        icon={<Briefcase className='size-4' />}
        value={draft.jabatan}
        onChange={(val) => onChange({ jabatan: val })}
        placeholder='Contoh: Kepala Instalasi Farmasi & Alkes'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <PelangganTextInput
          label='No. Telepon / WhatsApp'
          required
          type='tel'
          icon={<Phone className='size-4' />}
          value={draft.no_telp}
          onChange={(val) => {
            // Hanya memperbolehkan angka, spasi, tanda strip, atau awalan '+'
            let sanitized = val.replace(/[^\d\s\-+]/g, '');
            if (sanitized.includes('+')) {
              sanitized = (sanitized.startsWith('+') ? '+' : '') + sanitized.replace(/\+/g, '');
            }
            onChange({ no_telp: sanitized });
          }}
          placeholder='+62 812-3456-7890'
        />

        <PelangganTextInput
          label='Email'
          required
          type='email'
          icon={<Mail className='size-4' />}
          value={draft.email}
          onChange={(val) => onChange({ email: val })}
          placeholder='budi@hospital.com'
        />
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={onAdd}
        disabled={!isDraftValid}
        className='mt-1 h-10 w-full gap-2 rounded-md border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary disabled:opacity-50 cursor-pointer'
      >
        <UserPlus className='size-4' />
        Tambahkan ke Daftar Kontak
      </Button>
    </div>
  );
}
