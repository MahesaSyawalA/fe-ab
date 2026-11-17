import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { pelangganService, type PelangganListParams } from '@/services/pelanggan-service';
import { getErrorMessage } from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api.types';
import type {
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from '@/types/customer.types';
import type { CreateKontakInput, Kontak, UpdateKontakInput } from '@/types/contact.types';

export const pelangganKeys = {
  all: ['pelanggan'] as const,
  lists: () => [...pelangganKeys.all, 'list'] as const,
  list: (params?: PelangganListParams) => [...pelangganKeys.lists(), params] as const,
  counts: (search?: string) => [...pelangganKeys.all, 'counts', { search: search || undefined }] as const,
  details: () => [...pelangganKeys.all, 'detail'] as const,
  detail: (id: string) => [...pelangganKeys.details(), id] as const,
};

export function usePelangganCountsSourceQuery(search?: string) {
  const normalizedSearch = search?.trim() || undefined;
  return useQuery({
    queryKey: pelangganKeys.counts(normalizedSearch),
    queryFn: async () => {
      const firstPage = await pelangganService.getList({
        page: 1,
        limit: 100,
        order: 'desc',
        search: normalizedSearch,
      });
      const items = [...(firstPage.data ?? [])];
      const totalPages = firstPage.meta?.total_pages ?? 1;
      if (totalPages > 1) {
        const restPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, idx) =>
            pelangganService.getList({
              page: idx + 2,
              limit: 100,
              order: 'desc',
              search: normalizedSearch,
            }),
          ),
        );
        for (const pageRes of restPages) {
          if (Array.isArray(pageRes.data)) {
            items.push(...pageRes.data);
          }
        }
      }
      return items;
    },
    staleTime: 60_000,
  });
}

export function usePelangganListQuery(
  params?: PelangganListParams,
  options?: Omit<
    UseQueryOptions<ApiPaginatedResponse<PelangganWithDetails>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const normalizedParams: PelangganListParams = {
    page: 1,
    limit: 10,
    order: 'desc',
    ...params,
  };

  return useQuery({
    queryKey: pelangganKeys.list(normalizedParams),
    queryFn: () => pelangganService.getList(normalizedParams),
    ...options,
  });
}

export function usePelangganDetailQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PelangganWithDetails>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: pelangganKeys.detail(id),
    queryFn: () => pelangganService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreatePelangganMutation(
  options?: UseMutationOptions<ApiResponse<PelangganWithDetails>, Error, CreatePelangganInput | FormData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreatePelangganInput | FormData) => pelangganService.create(payload),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Pelanggan Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useUpdatePelangganMutation(
  id: string,
  options?: UseMutationOptions<ApiResponse<PelangganWithDetails>, Error, UpdatePelangganInput | FormData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: UpdatePelangganInput | FormData) => pelangganService.update(id, payload),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Update Pelanggan Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useDeletePelangganMutation(
  options?: UseMutationOptions<ApiResponse<null>, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => pelangganService.delete(id),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Delete Pelanggan Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useAddPelangganContactMutation(
  idPelanggan: string,
  options?: UseMutationOptions<ApiResponse<Kontak>, Error, Omit<CreateKontakInput, 'id_pelanggan'>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: Omit<CreateKontakInput, 'id_pelanggan'>) =>
      pelangganService.addContact({ ...payload, id_pelanggan: idPelanggan }),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.detail(idPelanggan) });
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Add Pelanggan Contact Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useUpdatePelangganContactMutation(
  idPelanggan: string,
  options?: UseMutationOptions<
    ApiResponse<Kontak>,
    Error,
    { idKontak: string; data: UpdateKontakInput }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ idKontak, data }: { idKontak: string; data: UpdateKontakInput }) =>
      pelangganService.updateContact(idKontak, data),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.detail(idPelanggan) });
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Update Pelanggan Contact Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useDeletePelangganContactMutation(
  idPelanggan: string,
  options?: UseMutationOptions<ApiResponse<null>, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (idKontak: string) => pelangganService.deleteContact(idKontak),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.detail(idPelanggan) });
      await queryClient.invalidateQueries({ queryKey: pelangganKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Delete Pelanggan Contact Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}
