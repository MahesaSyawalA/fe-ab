import { Briefcase, Mail, Phone, User, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconInputField } from '@/components/ui/icon-input-field';
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
      <div className='text-xs font-semibold text-foreground/80 mb-0.5'>
        Formulir Data Kontak
      </div>

      <IconInputField
        label='Nama Lengkap'
        required
        icon={<User className='size-4' />}
        value={draft.nama}
        onChange={(e) => onChange({ nama: e.target.value })}
        placeholder='Contoh: dr. Budi Santoso'
      />

      <IconInputField
        label='Jabatan'
        icon={<Briefcase className='size-4' />}
        value={draft.jabatan}
        onChange={(e) => onChange({ jabatan: e.target.value })}
        placeholder='Contoh: Kepala Instalasi Farmasi & Alkes'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <IconInputField
          label='No. Telepon / WhatsApp'
          required
          type='tel'
          icon={<Phone className='size-4' />}
          value={draft.no_telp}
          onChange={(e) => onChange({ no_telp: e.target.value })}
          placeholder='+62 812-3456-7890'
        />

        <IconInputField
          label='Email'
          required
          type='email'
          icon={<Mail className='size-4' />}
          value={draft.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder='budi@hospital.com'
        />
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={onAdd}
        disabled={!isDraftValid}
        className='mt-1 h-10 w-full gap-2 rounded-xl border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary disabled:opacity-50 cursor-pointer'
      >
        <UserPlus className='size-4' />
        Tambahkan ke Daftar Kontak
      </Button>
    </div>
  );
}
