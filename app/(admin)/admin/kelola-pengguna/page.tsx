import { UserManagementView } from '@/components/features/user-management';

export const metadata = {
  title: 'Kelola Pengguna | AB Medical+',
  description: 'Manajemen pengguna dan peran akun AB Medical+',
};

export default function AdminKelolaPenggunaPage() {
  return <UserManagementView />;
}

