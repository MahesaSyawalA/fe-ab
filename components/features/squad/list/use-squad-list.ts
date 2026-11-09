import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useSquadListQuery } from '@/hooks/queries';
import { useDebounce } from '@/hooks/use-debounce';
import type { SquadListParams } from '@/services/squad-service';
import type { SquadWithDetails } from '@/types/squad.types';

/** Daftar squad + pencarian & filter status dengan server-side pagination. Manager hanya melihat squad yang ia supervisi. */
export function useSquadList() {
  const { data: session } = useSession();
  const user = session?.user;
  const isManager = user?.role === 'sales_manager';

  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [status, setStatus] = React.useState('semua');

  // Sesuaikan halaman kembali ke 1 saat pencarian atau status berubah (pola resmi React render-time adjustment)
  const [prevSearch, setPrevSearch] = React.useState(debouncedSearchQuery);
  const [prevStatus, setPrevStatus] = React.useState(status);

  if (prevSearch !== debouncedSearchQuery || prevStatus !== status) {
    setPrevSearch(debouncedSearchQuery);
    setPrevStatus(status);
    setPage(1);
  }

  const queryParams: SquadListParams = React.useMemo(
    () => ({
      page,
      limit: 10,
      order: 'desc',
      search: debouncedSearchQuery.trim() || undefined,
      is_active: status === 'semua' ? undefined : status === 'aktif',
      id_supervisor: isManager ? user?.id_user : undefined,
    }),
    [page, debouncedSearchQuery, status, isManager, user?.id_user],
  );

  const query = useSquadListQuery(queryParams, Boolean(user));

  const rawList = query.data?.data;
  const squadList: SquadWithDetails[] = React.useMemo(() => {
    if (Array.isArray(rawList)) return rawList;
    if (Array.isArray(query.data)) return query.data as unknown as SquadWithDetails[];
    return [];
  }, [rawList, query.data]);

  // Client-side filtering fallback jika backend merespons tanpa filter DB
  const filteredList = React.useMemo(() => {
    const keyword = debouncedSearchQuery.trim().toLowerCase();

    return squadList.filter((squad) => {
      if (status !== 'semua' && squad.is_active !== (status === 'aktif')) return false;
      return (
        !keyword ||
        squad.nama_squad.toLowerCase().includes(keyword) ||
        squad.kode_squad.toLowerCase().includes(keyword) ||
        squad.wilayah.toLowerCase().includes(keyword)
      );
    });
  }, [squadList, debouncedSearchQuery, status]);

  return {
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    page,
    setPage,
    filteredList,
    squadList,
    paginationMeta: query.data?.meta,
    totalPages: query.data?.meta?.total_pages ?? 1,
    total: query.data?.meta?.total ?? filteredList.length,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
