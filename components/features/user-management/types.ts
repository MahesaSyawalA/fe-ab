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
  biaya_bulanan?: number | null;
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
