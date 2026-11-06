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
  return useQuery({
    queryKey: squadKeys.list(params),
    queryFn: () => squadService.getList(params),
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

/** Mutasi create/update/delete; semuanya membatalkan cache squad (list + detail). */
function useSquadMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  label: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: squadKeys.all }),
    onError: (error) => console.error(`[${label} Squad Error]:`, getErrorMessage(error)),
  });
}

export const useCreateSquadMutation = () =>
  useSquadMutation((payload: CreateSquadInput) => squadService.create(payload), 'Create');

export const useUpdateSquadMutation = (id: string) =>
  useSquadMutation((payload: UpdateSquadInput) => squadService.update(id, payload), 'Update');

export const useDeleteSquadMutation = () =>
  useSquadMutation((id: string) => squadService.delete(id), 'Delete');
