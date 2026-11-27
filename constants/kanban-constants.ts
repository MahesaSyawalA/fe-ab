import { JenisTahap, TahapKanban } from '@/types/kanban-stage.types';
import { TiketPrioritas, TeamContributionItem } from '@/types/ticket.types';

export interface KanbanStageColumn extends TahapKanban {
  dotColor: string;
}

export const INITIAL_KANBAN_STAGES: KanbanStageColumn[] = [
  {
    id_tahap: 'visit',
    nama_tahap: 'Visit',
    urutan: 1,
    jenis_tahap: 'visit',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#7C5CFC',
  },
  {
    id_tahap: 'kebutuhan',
    nama_tahap: 'Kebutuhan',
    urutan: 2,
    jenis_tahap: 'kebutuhan',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#F46F91',
  },
  {
    id_tahap: 'opportunity',
    nama_tahap: 'Opportunity',
    urutan: 3,
    jenis_tahap: 'opportunity',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#F5A64A',
  },
  {
    id_tahap: 'follow_up',
    nama_tahap: 'Follow Up',
    urutan: 4,
    jenis_tahap: 'follow_up',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#42C7A5',
  },
  {
    id_tahap: 'quotation',
    nama_tahap: 'Quotation',
    urutan: 5,
    jenis_tahap: 'quotation',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#5B9DEF',
  },
  {
    id_tahap: 'po',
    nama_tahap: 'PO',
    urutan: 6,
    jenis_tahap: 'po',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#7C5CFC',
  },
  {
    id_tahap: 'revenue',
    nama_tahap: 'Revenue',
    urutan: 7,
    jenis_tahap: 'revenue',
    is_tahap_akhir: true,
    is_aktif: true,
    dotColor: '#42C7A5',
  },
];

/** Daftar jenis tahap (urut pipeline); satu sumber untuk progres, filter, dan form kolom. */
export const JENIS_TAHAP_OPTIONS: { id: JenisTahap; label: string }[] = [
  { id: 'visit', label: 'Visit' },
  { id: 'kebutuhan', label: 'Kebutuhan' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'follow_up', label: 'Follow Up' },
  { id: 'quotation', label: 'Quotation' },
  { id: 'po', label: 'PO' },
  { id: 'revenue', label: 'Revenue' },
];

export const AKTIVITAS_STAGE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; solidClass: string; dotColor: string }
> = {
  visit: {
    label: 'Visit',
    badgeClass: 'bg-kanban-purple/10 text-kanban-purple border-kanban-purple/20',
    solidClass: 'bg-kanban-purple text-white',
    dotColor: '#7C5CFC',
  },
  kebutuhan: {
    label: 'Kebutuhan',
    badgeClass: 'bg-kanban-pink/10 text-kanban-pink border-kanban-pink/20',
    solidClass: 'bg-kanban-pink text-white',
    dotColor: '#F46F91',
  },
  opportunity: {
    label: 'Opportunity',
    badgeClass: 'bg-kanban-orange/10 text-kanban-orange border-kanban-orange/20',
    solidClass: 'bg-kanban-orange text-white',
    dotColor: '#F5A64A',
  },
  follow_up: {
    label: 'Follow Up',
    badgeClass: 'bg-kanban-green/10 text-kanban-green border-kanban-green/20',
    solidClass: 'bg-kanban-green text-white',
    dotColor: '#42C7A5',
  },
  quotation: {
    label: 'Quotation',
    badgeClass: 'bg-kanban-lightblue/10 text-kanban-lightblue border-kanban-lightblue/20',
    solidClass: 'bg-kanban-lightblue text-white',
    dotColor: '#5B9DEF',
  },
  po: {
    label: 'PO',
    badgeClass: 'bg-kanban-purple/10 text-kanban-purple border-kanban-purple/20',
    solidClass: 'bg-kanban-purple text-white',
    dotColor: '#7C5CFC',
  },
  revenue: {
    label: 'Revenue',
    badgeClass: 'bg-kanban-green/10 text-kanban-green border-kanban-green/20',
    solidClass: 'bg-kanban-green text-white',
    dotColor: '#42C7A5',
  },
  kunjungan: {
    label: 'Visit',
    badgeClass: 'bg-kanban-purple/10 text-kanban-purple border-kanban-purple/20',
    solidClass: 'bg-kanban-purple text-white',
    dotColor: '#7C5CFC',
  },
  penawaran: {
    label: 'Quotation',
    badgeClass: 'bg-kanban-lightblue/10 text-kanban-lightblue border-kanban-lightblue/20',
    solidClass: 'bg-kanban-lightblue text-white',
    dotColor: '#5B9DEF',
  },
  closing: {
    label: 'Revenue',
    badgeClass: 'bg-kanban-green/10 text-kanban-green border-kanban-green/20',
    solidClass: 'bg-kanban-green text-white',
    dotColor: '#42C7A5',
  },
};

export const TEAM_CONTRIBUTIONS: TeamContributionItem[] = [
  {
    id: 'tc-1',
    name: 'Dimas A.',
    valueLabel: 'Rp2.85 M',
    ticketsLabel: '5 Tiket (92%)',
    ticketCount: 5,
    closingRate: 92,
  },
  {
    id: 'tc-2',
    name: 'Sarah N.',
    valueLabel: 'Rp2.40 M',
    ticketsLabel: '6 Tiket (88%)',
    ticketCount: 6,
    closingRate: 88,
  },
  {
    id: 'tc-3',
    name: 'Rizky A.',
    valueLabel: 'Rp2.20 M',
    ticketsLabel: '7 Tiket (76%)',
    ticketCount: 7,
    closingRate: 76,
  },
];

export const SALES_OPTIONS = [
  { id: 'all', name: 'Semua Sales' },
  { id: 'usr-1', name: 'Rina Putri' },
  { id: 'usr-2', name: 'Dimas Arya' },
  { id: 'usr-3', name: 'Sarah Nabila' },
  { id: 'usr-4', name: 'Rizky Pratama' },
];

export const PRIORITY_ORDER: TiketPrioritas[] = ['rendah', 'sedang', 'tinggi'];

export const PRIORITY_CONFIG: Record<
  TiketPrioritas,
  { label: string; formLabel: string; dotClass: string; badgeClass: string; activeClass: string }
> = {
  rendah: {
    label: 'Low',
    formLabel: 'Rendah',
    dotClass: 'bg-success',
    badgeClass: 'bg-success/12 text-success border-0',
    activeClass: 'border-success/40 bg-success/10 text-success font-semibold',
  },
  sedang: {
    label: 'Medium',
    formLabel: 'Sedang',
    dotClass: 'bg-warning',
    badgeClass: 'bg-warning/15 text-warning border-0',
    activeClass: 'border-warning/40 bg-warning/10 text-warning font-semibold',
  },
  tinggi: {
    label: 'High',
    formLabel: 'Tinggi',
    dotClass: 'bg-destructive',
    badgeClass: 'bg-destructive/12 text-destructive border-0',
    activeClass: 'border-destructive/40 bg-destructive/10 text-destructive font-semibold',
  },
};
