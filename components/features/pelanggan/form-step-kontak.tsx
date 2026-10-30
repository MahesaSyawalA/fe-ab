import * as React from 'react';
import {
  User,
  Briefcase,
  Phone,
  Mail,
  UserPlus,
  Trash2,
  UserRound,
  ContactRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SectionHeader } from '@/components/ui/section-header';
import { IconInputField } from '@/components/ui/icon-input-field';

export interface KontakInputItem {
  nama: string;
  jabatan: string;
  no_telp: string;
  email: string;
}

interface FormStepKontakProps {
  contacts: KontakInputItem[];
  onChangeContacts: (contacts: KontakInputItem[]) => void;
  onSubmit: (finalContacts: KontakInputItem[]) => void;
  isSubmitting?: boolean;
}

export function FormStepKontak({
  contacts,
  onChangeContacts,
  onSubmit,
  isSubmitting = false,
}: FormStepKontakProps) {
  const [currentContact, setCurrentContact] = React.useState<KontakInputItem>({
    nama: '',
    jabatan: '',
    no_telp: '',
    email: '',
  });

  const isDraftValid = Boolean(
    currentContact.nama.trim() &&
      currentContact.no_telp.trim() &&
      currentContact.email.trim()
  );

  const handleAddContact = () => {
    if (!isDraftValid) return;
    onChangeContacts([...contacts, currentContact]);
    setCurrentContact({
      nama: '',
      jabatan: '',
      no_telp: '',
      email: '',
    });
  };

  const handleRemoveContact = (indexToRemove: number) => {
    onChangeContacts(contacts.filter((_, idx) => idx !== indexToRemove));
  };

  const canSubmit = contacts.length > 0 || isDraftValid;

  const handleFinalSubmit = () => {
    const finalContacts = isDraftValid
      ? [...contacts, currentContact]
      : contacts;
    onChangeContacts(finalContacts);
    onSubmit(finalContacts);
  };

  return (
    <Card
      size='sm'
      className='w-full min-w-0 rounded-2xl border border-border ring-0 py-4 shadow-2xs'
    >
      <CardContent className='gap-3.5 px-4'>
        <SectionHeader
          icon={<ContactRound className='size-4' />}
          title='Kontak PIC'
          badgeText='Wajib'
        />

        {/* Input Form Fields */}
        <IconInputField
          label='Nama Lengkap'
          required
          icon={<User className='size-4' />}
          value={currentContact.nama}
          onChange={(e) =>
            setCurrentContact({ ...currentContact, nama: e.target.value })
          }
          placeholder='Jhon smith'
        />

        <IconInputField
          label='Jabatan'
          icon={<Briefcase className='size-4' />}
          value={currentContact.jabatan}
          onChange={(e) =>
            setCurrentContact({ ...currentContact, jabatan: e.target.value })
          }
          placeholder='Kepala Instalasi Farmasi & Alkes'
        />

        <IconInputField
          label='No Telephone / Whatsapp'
          required
          type='tel'
          icon={<Phone className='size-4' />}
          value={currentContact.no_telp}
          onChange={(e) =>
            setCurrentContact({ ...currentContact, no_telp: e.target.value })
          }
          placeholder='+62 812-3456-7890'
        />

        <IconInputField
          label='Email'
          required
          type='email'
          icon={<Mail className='size-4' />}
          value={currentContact.email}
          onChange={(e) =>
            setCurrentContact({ ...currentContact, email: e.target.value })
          }
          placeholder='mahesa@gmail.com'
        />

        {/* Added Contacts List matching Mockup Screen 4 */}
        {contacts.length > 0 && (
          <div className='flex flex-col gap-2.5 pt-1'>
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between gap-2.5 rounded-xl border border-primary/50 bg-[#F5F8FF] p-3'
              >
                <div className='flex min-w-0 flex-1 items-center gap-2.5'>
                  <Avatar className='after:border-primary/30'>
                    <AvatarFallback className='bg-primary/10 text-primary'>
                      <UserRound className='size-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-1 flex-col'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-xs font-semibold text-foreground truncate'>
                        {c.nama}
                      </span>
                      {c.jabatan && (
                        <span className='text-[11px] text-secondary-foreground truncate'>
                          {c.jabatan}
                        </span>
                      )}
                    </div>
                    <span className='text-[11px] text-secondary-foreground leading-snug'>
                      {c.no_telp}
                    </span>
                    {c.email && (
                      <span className='text-[11px] text-secondary-foreground truncate leading-snug'>
                        {c.email}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type='button'
                  variant='ghost'
                  size='icon-xs'
                  onClick={() => handleRemoveContact(idx)}
                  className='text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer'
                  title='Hapus kontak'
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons inside card matching Mockup Screen 4 */}
        <div className='flex flex-col gap-2.5 pt-1'>
          <Button
            type='button'
            variant='outline'
            onClick={handleAddContact}
            disabled={!isDraftValid}
            className='h-10 w-full gap-2 rounded-xl border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary disabled:opacity-50 cursor-pointer'
          >
            <UserPlus className='size-4' />
            Tambahkan Kontak Lainnya
          </Button>

          <Button
            type='button'
            onClick={handleFinalSubmit}
            disabled={!canSubmit || isSubmitting}
            className='h-10 w-full rounded-xl bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow-xs disabled:opacity-50 cursor-pointer'
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
