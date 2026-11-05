import { Card, CardContent } from '@/components/ui/card';

export function PelangganListEmpty() {
  return (
    <Card
      size='sm'
      className='col-span-full rounded-2xl border border-border ring-0 py-12 text-center shadow-none'
    >
      <CardContent className='items-center justify-center gap-1.5'>
        <p className='text-sm font-semibold text-foreground'>
          Tidak ada pelanggan ditemukan
        </p>
        <p className='text-xs text-muted-foreground'>
          Coba ubah kata kunci pencarian atau filter tipe outlet.
        </p>
      </CardContent>
    </Card>
  );
}
