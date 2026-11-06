import * as React from 'react';
import { PelangganWithDetails } from '@/types/customer.types';
import { Kontak } from '@/types/contact.types';
import { ProspekSelectInput, ProspekSelectOption } from '../inputs';

interface ProspekFieldOutletPicProps {
  outlets: PelangganWithDetails[];
  outletId: string;
  onOutletChange: (id: string) => void;
  kontakOptions: Kontak[];
  kontakId: string;
  onKontakChange: (id: string) => void;
  error?: string;
}

/** Outlet dan PIC dijadikan satu karena daftar PIC bergantung pada outlet terpilih. */
export function ProspekFieldOutletPic({
  outlets,
  outletId,
  onOutletChange,
  kontakOptions,
  kontakId,
  onKontakChange,
  error,
}: ProspekFieldOutletPicProps) {
  const outletOptions = React.useMemo<ProspekSelectOption[]>(() => {
    return [
      { value: '', label: 'Default' },
      ...outlets.map((outlet) => ({
        value: outlet.id_pelanggan,
        label: outlet.nama_outlet,
      })),
    ];
  }, [outlets]);

  const kontakSelectOptions = React.useMemo<ProspekSelectOption[]>(() => {
    if (!outletId) {
      return [{ value: '', label: 'Disable' }];
    }
    if (kontakOptions.length === 0) {
      return [{ value: '', label: 'Belum ada kontak terdaftar' }];
    }
    return kontakOptions.map((k) => ({
      value: k.id_kontak,
      label: `${k.nama} • ${k.jabatan}`,
    }));
  }, [outletId, kontakOptions]);

  return (
    <>
      <ProspekSelectInput
        label='Outlet'
        isRequired
        errorMessage={error}
        hint='Pilih Outlet yang Sesuai'
        value={outletId}
        onChange={onOutletChange}
        options={outletOptions}
      />

      <ProspekSelectInput
        label='PIC Outlet'
        isRequired
        hint='Daftar kontak muncul setelah pelanggan dipilih'
        isDisabled={!outletId}
        value={kontakId}
        onChange={onKontakChange}
        options={kontakSelectOptions}
      />
    </>
  );
}
