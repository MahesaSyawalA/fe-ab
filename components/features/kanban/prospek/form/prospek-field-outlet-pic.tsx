import { FormField } from '@/components/ui/form-field';
import { NativeSelect } from '@/components/ui/native-select';
import { PelangganWithDetails } from '@/types/customer.types';
import { Kontak } from '@/types/contact.types';

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
  return (
    <>
      <FormField
        label='Outlet'
        required
        error={error}
        hint='Sesuai data registrasi master pelanggan Jawa Barat'
      >
        <NativeSelect
          value={outletId}
          onChange={(e) => onOutletChange(e.target.value)}
          className={error ? 'border-destructive text-muted-foreground' : undefined}
        >
          <option value=''>Default</option>
          {outlets.map((outlet) => (
            <option key={outlet.id_pelanggan} value={outlet.id_pelanggan}>
              {outlet.nama_faskes}
            </option>
          ))}
        </NativeSelect>
      </FormField>

      <FormField
        label='PIC Outlet'
        required
        hint='Daftar kontak muncul setelah pelanggan dipilih'
      >
        <NativeSelect
          value={kontakId}
          disabled={!outletId}
          onChange={(e) => onKontakChange(e.target.value)}
        >
          {!outletId ? (
            <option value=''>Disable</option>
          ) : kontakOptions.length === 0 ? (
            <option value=''>Belum ada kontak terdaftar</option>
          ) : (
            kontakOptions.map((k) => (
              <option key={k.id_kontak} value={k.id_kontak}>
                {k.nama} • {k.jabatan}
              </option>
            ))
          )}
        </NativeSelect>
      </FormField>
    </>
  );
}
