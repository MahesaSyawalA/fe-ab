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
    dotColor: '#3B82F6',
  },
  {
    id_tahap: 'kebutuhan',
    nama_tahap: 'Kebutuhan',
    urutan: 2,
    jenis_tahap: 'kebutuhan',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#8B5CF6',
  },
  {
    id_tahap: 'opportunity',
    nama_tahap: 'Opportunity',
    urutan: 3,
    jenis_tahap: 'opportunity',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#6366F1',
  },
  {
    id_tahap: 'follow_up',
    nama_tahap: 'Follow Up',
    urutan: 4,
    jenis_tahap: 'follow_up',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#F59E0B',
  },
  {
    id_tahap: 'quotation',
    nama_tahap: 'Quotation',
    urutan: 5,
    jenis_tahap: 'quotation',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#EC4899',
  },
  {
    id_tahap: 'po',
    nama_tahap: 'PO',
    urutan: 6,
    jenis_tahap: 'po',
    is_tahap_akhir: false,
    is_aktif: true,
    dotColor: '#0EA5E9',
  },
  {
    id_tahap: 'revenue',
    nama_tahap: 'Revenue',
    urutan: 7,
    jenis_tahap: 'revenue',
    is_tahap_akhir: true,
    is_aktif: true,
    dotColor: '#10B981',
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
  { label: string; badgeClass: string; dotColor: string }
> = {
  visit: {
    label: 'Visit',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: '#2563EB',
  },
  kebutuhan: {
    label: 'Kebutuhan',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: '#7C3AED',
  },
  opportunity: {
    label: 'Opportunity',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotColor: '#4F46E5',
  },
  follow_up: {
    label: 'Follow Up',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: '#F59E0B',
  },
  quotation: {
    label: 'Quotation',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    dotColor: '#EC4899',
  },
  po: {
    label: 'PO',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotColor: '#0EA5E9',
  },
  revenue: {
    label: 'Revenue',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: '#10B981',
  },
  kunjungan: {
    label: 'Visit',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: '#2563EB',
  },
  penawaran: {
    label: 'Quotation',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    dotColor: '#EC4899',
  },
  closing: {
    label: 'Revenue',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: '#10B981',
  },
};

export const TEAM_CONTRIBUTIONS: TeamContributionItem[] = [
  {
    id: 'tc-1',
    name: 'Dimas A.',
    valueLabel: 'Rp2.85 M',
    ticketsLabel: '5 Tiket (92%)',
  },
  {
    id: 'tc-2',
    name: 'Sarah N.',
    valueLabel: 'Rp2.40 M',
    ticketsLabel: '6 Tiket (88%)',
  },
  {
    id: 'tc-3',
    name: 'Rizky A.',
    valueLabel: 'Rp2.20 M',
    ticketsLabel: '7 Tiket (76%)',
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
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/12 text-emerald-600 border-0',
    activeClass: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 font-semibold',
  },
  sedang: {
    label: 'Medium',
    formLabel: 'Sedang',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-500/15 text-amber-600 border-0',
    activeClass: 'border-amber-400 bg-amber-500/10 text-amber-700 font-semibold',
  },
  tinggi: {
    label: 'High',
    formLabel: 'Tinggi',
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-500/12 text-rose-600 border-0',
    activeClass: 'border-rose-400 bg-rose-500/10 text-rose-600 font-semibold',
  },
};
