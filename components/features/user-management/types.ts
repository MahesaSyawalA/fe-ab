export type UserStatus = 'aktif' | 'nonaktif';

export type ManagedUserRole = 'director' | 'sales_manager' | 'sales' | 'admin';

export interface ManagedUser {
  id: string;
  nama: string;
  email: string;
  no_telp: string;
  role: ManagedUserRole;
  squad: string | null;
  id_squad?: string | null;
  status: UserStatus;
  avatar_url?: string | null;
}

export type RoleFilterValue = 'all' | 'director' | 'sales_manager' | 'sales';

export interface RoleFilterOption {
  key: RoleFilterValue;
  label: string;
  dotColor: string;
  roleBadgeBg: string;
}

export const ROLE_FILTER_OPTIONS: RoleFilterOption[] = [
  {
    key: 'all',
    label: 'Semua',
    dotColor: 'bg-kanban-purple',
    roleBadgeBg: 'bg-kanban-purple',
  },
  {
    key: 'director',
    label: 'Director',
    dotColor: 'bg-kanban-pink',
    roleBadgeBg: 'bg-kanban-pink',
  },
  {
    key: 'sales_manager',
    label: 'Sales Manager',
    dotColor: 'bg-kanban-orange',
    roleBadgeBg: 'bg-kanban-orange',
  },
  {
    key: 'sales',
    label: 'Sales',
    dotColor: 'bg-kanban-green',
    roleBadgeBg: 'bg-kanban-green',
  },
];

export const INITIAL_DUMMY_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    nama: 'Budi Santoso',
    email: 'budi.santoso@abmedical.id',
    no_telp: '0812-3456-7890',
    role: 'director',
    squad: null,
    status: 'aktif',
  },
  {
    id: 'usr-2',
    nama: 'Hendra Wijaya',
    email: 'hendra.wijaya@abmedical.id',
    no_telp: '0813-9876-5432',
    role: 'sales_manager',
    squad: 'Squad Jakarta 1',
    status: 'aktif',
  },
  {
    id: 'usr-3',
    nama: 'Dimas Pratama',
    email: 'dimas.pratama@abmedical.id',
    no_telp: '0811-2233-4455',
    role: 'sales_manager',
    squad: 'Squad Surabaya',
    status: 'aktif',
  },
  {
    id: 'usr-4',
    nama: 'Andi Saputra',
    email: 'andi.saputra@abmedical.id',
    no_telp: '0812-3756-2349',
    role: 'sales',
    squad: 'Squad Jakarta 1',
    status: 'aktif',
  },
  {
    id: 'usr-5',
    nama: 'Maulana Tri',
    email: 'maulana.tri@abmedical.id',
    no_telp: '0812-9876-5432',
    role: 'sales',
    squad: 'Squad Jakarta 1',
    status: 'aktif',
  },
  {
    id: 'usr-6',
    nama: 'Siti Rahma',
    email: 'siti.rahma@abmedical.id',
    no_telp: '0815-6789-0123',
    role: 'sales',
    squad: 'Squad Bandung',
    status: 'nonaktif',
  },
  {
    id: 'usr-7',
    nama: 'Rian Hidayat',
    email: 'rian.hidayat@abmedical.id',
    no_telp: '0817-8901-2345',
    role: 'sales',
    squad: 'Squad Surabaya',
    status: 'aktif',
  },
  {
    id: 'usr-8',
    nama: 'Admin Sistem',
    email: 'admin@abmedical.id',
    no_telp: '0811-0000-1111',
    role: 'admin',
    squad: null,
    status: 'aktif',
  },
];
