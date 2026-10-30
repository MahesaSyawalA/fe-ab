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
      className='w-full min-w-0 rounded-2xl border border-border ring-0 py-4 md:py-6 shadow-2xs bg-card'
    >
      <CardContent className='gap-5 px-4 md:px-6'>
        <SectionHeader
          icon={<ContactRound className='size-4' />}
          title='Kontak PIC (Person In Charge)'
          badgeText='Wajib'
        />

        <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start'>
          {/* Left Column: Form Inputs (7 cols on desktop) */}
          <div className='md:col-span-7 flex flex-col gap-3.5'>
            <div className='text-xs font-semibold text-foreground/80 mb-0.5'>
              Formulir Data Kontak
            </div>

            {/* Input Form Fields */}
            <IconInputField
              label='Nama Lengkap'
              required
              icon={<User className='size-4' />}
              value={currentContact.nama}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, nama: e.target.value })
              }
              placeholder='Contoh: dr. Budi Santoso'
            />

            <IconInputField
              label='Jabatan'
              icon={<Briefcase className='size-4' />}
              value={currentContact.jabatan}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, jabatan: e.target.value })
              }
              placeholder='Contoh: Kepala Instalasi Farmasi & Alkes'
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <IconInputField
                label='No. Telepon / WhatsApp'
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
                placeholder='budi@hospital.com'
              />
            </div>

            <Button
              type='button'
              variant='outline'
              onClick={handleAddContact}
              disabled={!isDraftValid}
              className='mt-1 h-10 w-full gap-2 rounded-xl border-primary bg-primary/4 hover:bg-primary/10 text-xs font-medium text-primary disabled:opacity-50 cursor-pointer'
            >
              <UserPlus className='size-4' />
              Tambahkan ke Daftar Kontak
            </Button>
          </div>

          {/* Right Column: Added Contacts List (5 cols on desktop) */}
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
                {contacts.map((c, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between gap-2.5 rounded-xl border border-primary/40 bg-[#F5F8FF] p-3'
                  >
                    <div className='flex min-w-0 flex-1 items-center gap-2.5'>
                      <Avatar className='after:border-primary/30 shrink-0'>
                        <AvatarFallback className='bg-primary/10 text-primary'>
                          <UserRound className='size-4' />
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex min-w-0 flex-1 flex-col'>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-xs font-semibold text-foreground truncate'>
                            {c.nama}
                          </span>
                        </div>
                        {c.jabatan && (
                          <span className='text-[11px] text-secondary-foreground truncate'>
                            {c.jabatan}
                          </span>
                        )}
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
        </div>

        {/* Final Submit Button */}
        <div className='flex justify-end pt-3 border-t border-border/60'>
          <Button
            type='button'
            onClick={handleFinalSubmit}
            disabled={!canSubmit || isSubmitting}
            className='h-10 w-full md:w-auto md:min-w-56 rounded-xl bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow-xs disabled:opacity-50 cursor-pointer'
          >
            {isSubmitting ? 'Menyimpan Pelanggan...' : 'Simpan Semua & Selesaikan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
