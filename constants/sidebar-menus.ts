import { LayoutGridCircles, KanbanSquare, Hospital, Users, UserCog } from 'lucide-react';

export const salesMenu = [
  { title: 'CRM Kanban', url: '/sales/kanban', icon: KanbanSquare },
  { title: 'Data Pelanggan', url: '/sales/pelanggan', icon: Hospital },
];

export const managerMenu = [
  { title: 'CRM Kanban', url: '/manager/kanban', icon: KanbanSquare },
  { title: 'Rekap Penjualan', url: '/manager/rekap', icon: LayoutGridCircles },
  { title: 'Squad', url: '/manager/squad', icon: Users },
  { title: 'Data Pelanggan', url: '/manager/pelanggan', icon: Hospital },
];

export const directorMenu = [
  { title: 'Dashboard', url: '/director/dashboard', icon: LayoutGridCircles },
  { title: 'CRM Kanban', url: '/director/kanban', icon: KanbanSquare },
  { title: 'Squad', url: '/director/squad', icon: Users },
  { title: 'Data Pelanggan', url: '/director/pelanggan', icon: Hospital },
  { title: 'Kelola Pengguna', url: '/director/kelola-pengguna', icon: UserCog },
];

export const adminMenu = [
  { title: 'Kelola Pengguna', url: '/admin/kelola-pengguna', icon: UserCog },
];
