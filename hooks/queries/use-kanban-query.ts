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
  type MoveTicketPayload,
} from '@/services/kanban-service';
import { getErrorMessage } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { TiketWithDetails } from '@/types/ticket.types';

export const kanbanKeys = {
  all: ['kanban'] as const,
  board: (params?: { squadId?: string; salesId?: string; search?: string }) =>
    [...kanbanKeys.all, 'board', params] as const,
  tickets: () => [...kanbanKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...kanbanKeys.tickets(), id] as const,
};

export function useKanbanBoardQuery(
  params?: { squadId?: string; salesId?: string; search?: string },
  options?: Omit<
    UseQueryOptions<ApiResponse<KanbanBoardData>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: kanbanKeys.board(params),
    queryFn: () => kanbanService.getBoard(params),
    ...options,
  });
}

export function useKanbanTicketQuery(
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
      console.error('[Move Ticket Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}
