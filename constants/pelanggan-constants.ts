import { OptionCardItem } from '@/components/ui/option-card';

export const OUTLET_TYPES: OptionCardItem[] = [
  {
    id: 'Rumah Sakit',
    title: 'Rumah Sakit',
    description: 'Rumah sakit umum dan khusus',
  },
  {
    id: 'Klinik',
    title: 'Klinik',
    description: 'Klinik Pratama dan Utama',
  },
  {
    id: 'Apotek',
    title: 'Apotek / Laboratorium',
    description: 'Apotek mandiri / Laboratorium',
  },
  {
    id: 'Individu',
    title: 'Individu',
    description: 'Customer Perorangan',
  },
];

export const DEFAULT_OUTLET_IMAGE =
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80';

/** Chip kategori di daftar pelanggan; `id` dipakai juga sebagai kata kunci pencocokan `tipe_outlet`. */
export const PELANGGAN_CATEGORY_CHIPS = [
  { id: 'Rumah Sakit', label: 'Rumah Sakit', dotColor: 'bg-kanban-pink' },
  { id: 'Klinik', label: 'Klinik', dotColor: 'bg-kanban-orange' },
  { id: 'Apotek', label: 'Apotek', dotColor: 'bg-kanban-green' },
  { id: 'Individu', label: 'Individu', dotColor: 'bg-kanban-lightblue' },
];
