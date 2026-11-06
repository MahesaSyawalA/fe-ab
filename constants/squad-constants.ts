import type { SquadFormValues } from '@/schemas/squad.schema';

export const SQUAD_FORM_DEFAULTS: SquadFormValues = {
    nama_squad: '',
    id_supervisor: '',
    kode_squad: '',
    wilayah: '',
    is_active: true,
    member_ids: [],
};

export const SQUAD_STATUS_OPTIONS = [
    { id: 'semua', label: 'Semua' },
    { id: 'aktif', label: 'Aktif' },
    { id: 'nonaktif', label: 'Nonaktif' },
];

/** Warna avatar inisial anggota (berputar mengikuti urutan). */
export const SQUAD_AVATAR_COLORS = [
    'bg-kanban-orange',
    'bg-kanban-lightblue',
    'bg-kanban-green',
    'bg-kanban-pink',
    'bg-kanban-purple',
];

export const SQUAD_AVATAR_MAX_VISIBLE = 3;
