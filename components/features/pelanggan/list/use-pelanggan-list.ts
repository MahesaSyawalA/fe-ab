import * as React from 'react';
import { ChipFilterItem } from '@/components/ui/chip-filter';
import { PELANGGAN_CATEGORY_CHIPS } from '@/constants/pelanggan-constants';
import { usePelangganStore } from '@/lib/pelanggan-store';

const matchesCategory = (tipeFaskes: string, category: string) =>
  tipeFaskes.toLowerCase().includes(category.toLowerCase());

export function usePelangganList() {
  const pelangganList = usePelangganStore((state) => state.pelangganList);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('semua');

  const filterChips: ChipFilterItem[] = React.useMemo(
    () => [
      {
        id: 'semua',
        label: 'Semua',
        count: pelangganList.length,
        dotColor: 'bg-kanban-purple',
      },
      ...PELANGGAN_CATEGORY_CHIPS.map((chip) => ({
        ...chip,
        count: pelangganList.filter((p) =>
          matchesCategory(p.tipe_faskes || p.tipe_outlet, chip.id),
        ).length,
      })),
    ],
    [pelangganList],
  );

  const filteredList = React.useMemo(() => {
    // Hanya cek kosong yang di-trim; pencocokan memakai teks apa adanya (perilaku asli).
    const query = searchQuery.trim() ? searchQuery.toLowerCase() : '';

    return pelangganList.filter((item) => {
      if (
        selectedCategory !== 'semua' &&
        !matchesCategory(item.tipe_faskes || item.tipe_outlet, selectedCategory)
      ) {
        return false;
      }

      if (!query) return true;

      return (
        (item.nama_faskes || item.nama_outlet).toLowerCase().includes(query) ||
        item.alamat.toLowerCase().includes(query) ||
        Boolean(item.kontak_list?.some((k) => k.nama.toLowerCase().includes(query)))
      );
    });
  }, [pelangganList, selectedCategory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterChips,
    filteredList,
  };
}
