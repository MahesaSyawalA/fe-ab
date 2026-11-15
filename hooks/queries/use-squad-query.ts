import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { squadService, type SquadListParams } from '@/services/squad-service';
import { getErrorMessage } from '@/lib/axios';
import type { CreateSquadInput, UpdateSquadInput } from '@/types/squad.types';

export const squadKeys = {
  all: ['squad'] as const,
  lists: () => [...squadKeys.all, 'list'] as const,
  list: (params?: SquadListParams) => [...squadKeys.lists(), params] as const,
  detail: (id: string) => [...squadKeys.all, 'detail', id] as const,
};

export function useSquadListQuery(params?: SquadListParams, enabled = true) {
  const normalizedParams: SquadListParams = {
    page: 1,
    limit: 10,
    order: 'desc',
    ...params,
  };

  return useQuery({
    queryKey: squadKeys.list(normalizedParams),
    queryFn: () => squadService.getList(normalizedParams),
    enabled,
  });
}

export function useSquadDetailQuery(id: string) {
  return useQuery({
    queryKey: squadKeys.detail(id),
    queryFn: () => squadService.getById(id),
    enabled: Boolean(id),
  });
}

function useSquadMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  label: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: squadKeys.all }),
    onError: (error) => console.warn(`[${label} Squad Error]:`, getErrorMessage(error)),
  });
}

export const useCreateSquadMutation = () =>
  useSquadMutation((payload: CreateSquadInput) => squadService.create(payload), 'Create');

export const useUpdateSquadMutation = (id: string) =>
  useSquadMutation((payload: UpdateSquadInput) => squadService.update(id, payload), 'Update');

export const useDeleteSquadMutation = () =>
  useSquadMutation((id: string) => squadService.delete(id), 'Delete');
