import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useSquadListQuery } from '@/hooks/queries';

/** Daftar squad + pencarian & filter status. Manager hanya melihat squad yang ia supervisi. */
export function useSquadList() {
  const { data: session } = useSession();
  const user = session?.user;
  const isManager = user?.role === 'sales_manager';

  const query = useSquadListQuery(
    isManager ? { id_supervisor: user?.id_user } : undefined,
    Boolean(user),
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [status, setStatus] = React.useState('semua');

  const filteredList = React.useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return (query.data?.data ?? []).filter((squad) => {
      if (status !== 'semua' && squad.is_active !== (status === 'aktif')) return false;
      return (
        !keyword ||
        squad.nama_squad.toLowerCase().includes(keyword) ||
        squad.kode_squad.toLowerCase().includes(keyword) ||
        squad.wilayah.toLowerCase().includes(keyword)
      );
    });
  }, [query.data, searchQuery, status]);

  return {
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    filteredList,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
