import { EmptyState } from '@/components/ui/empty-state';

export function PelangganListEmpty() {
  return (
    <EmptyState
      title='Tidak ada pelanggan ditemukan'
      description='Coba ubah kata kunci pencarian atau filter tipe outlet.'
    />
  );
}
