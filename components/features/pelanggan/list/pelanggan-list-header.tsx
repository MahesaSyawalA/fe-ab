import { ListPageHeader } from '@/components/ui/list-page-header';

interface PelangganListHeaderProps {
  title?: string;
  subtitle?: string;
  onAddClick: () => void;
}

export function PelangganListHeader({
  title = 'Pelanggan',
  subtitle = 'Daftar Pelanggan - Jakarta',
  onAddClick,
}: PelangganListHeaderProps) {
  return (
    <ListPageHeader
      title={title}
      subtitle={subtitle}
      addLabel='Tambah Pelanggan'
      onAddClick={onAddClick}
    />
  );
}
