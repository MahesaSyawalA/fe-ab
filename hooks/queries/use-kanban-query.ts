import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  kanbanService,
  type KanbanBoardData,
  type KanbanBoardFilterParams,
  type MoveTicketPayload,
  type MoveTicketStagePayload,
} from '@/services/kanban-service';
import { getErrorMessage } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { TiketWithDetails } from '@/types/ticket.types';
import type {
  TahapKanban,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from '@/types/kanban-stage.types';

export const kanbanKeys = {
  all: ['kanban'] as const,
  stages: () => [...kanbanKeys.all, 'stages'] as const,
  board: (params?: KanbanBoardFilterParams) =>
    [...kanbanKeys.all, 'board', params] as const,
  tickets: () => [...kanbanKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...kanbanKeys.tickets(), id] as const,
  activities: (ticketId: string) =>
    [...kanbanKeys.ticket(ticketId), 'activities'] as const,
  history: (ticketId: string) =>
    [...kanbanKeys.ticket(ticketId), 'history'] as const,
};

// ---------------------------------------------------------
// QUERY HOOKS
// ---------------------------------------------------------

export function useKanbanStagesQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<TahapKanban[]>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: kanbanKeys.stages(),
    queryFn: () => kanbanService.getStages(),
    ...options,
  });
}

export function useKanbanBoardQuery(
  params?: KanbanBoardFilterParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<TiketWithDetails[]>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: kanbanKeys.board(params),
    queryFn: () => kanbanService.getBoard(params),
    ...options,
  });
}

export function useKanbanTicketDetailQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TiketWithDetails>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: kanbanKeys.ticket(id),
    queryFn: () => kanbanService.getTicketById(id),
    enabled: Boolean(id),
    ...options,
  });
}

/**
 * Backward-compatible alias for useKanbanTicketDetailQuery
 */
export const useKanbanTicketQuery = useKanbanTicketDetailQuery;

// ---------------------------------------------------------
// MUTATION HOOKS
// ---------------------------------------------------------

export function useMoveTicketMutation(
  options?: UseMutationOptions<ApiResponse<TiketWithDetails>, Error, MoveTicketPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: MoveTicketPayload) => kanbanService.moveTicket(payload),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Move Ticket Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useMoveTicketStageMutation(
  options?: UseMutationOptions<
    ApiResponse<TiketWithDetails>,
    Error,
    { id: string; payload: MoveTicketStagePayload }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }: { id: string; payload: MoveTicketStagePayload }) =>
      kanbanService.moveTicketStage(id, payload),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kanbanKeys.board() }),
        queryClient.invalidateQueries({ queryKey: kanbanKeys.ticket(args[1].id) }),
      ]);
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Move Ticket Stage Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useCreateTahapMutation(
  options?: UseMutationOptions<ApiResponse<TahapKanban>, Error, CreateTahapKanbanInput>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateTahapKanbanInput) => kanbanService.createTahap(payload),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kanbanKeys.stages() }),
        queryClient.invalidateQueries({ queryKey: kanbanKeys.board() }),
      ]);
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Tahap Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useUpdateTahapMutation(
  options?: UseMutationOptions<
    ApiResponse<TahapKanban>,
    Error,
    { id: string; payload: UpdateTahapKanbanInput }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTahapKanbanInput }) =>
      kanbanService.updateTahap(id, payload),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kanbanKeys.stages() }),
        queryClient.invalidateQueries({ queryKey: kanbanKeys.board() }),
      ]);
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Update Tahap Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useDeleteTahapMutation(
  options?: UseMutationOptions<ApiResponse<void>, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => kanbanService.deleteTahap(id),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kanbanKeys.stages() }),
        queryClient.invalidateQueries({ queryKey: kanbanKeys.board() }),
      ]);
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Delete Tahap Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}
