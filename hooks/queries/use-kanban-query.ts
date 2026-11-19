import * as React from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  kanbanService,
  type KanbanBoardFilterParams,
  type MoveTicketPayload,
  type MoveTicketStagePayload,
} from '@/services/kanban-service';
import { getErrorMessage } from '@/lib/axios';
import { toast } from '@heroui/react';
import type { ApiResponse } from '@/types/api.types';
import type {
  TiketWithDetails,
  CreateTiketInput,
  UpdateTiketInput,
} from '@/types/ticket.types';
import type {
  TahapKanban,
  CreateTahapKanbanInput,
  UpdateTahapKanbanInput,
} from '@/types/kanban-stage.types';
import type {
  CreateAktivitasInput,
  UpdateAktivitasInput,
  AktivitasWithDetails,
  EvidenceItem,
} from '@/types/activity.types';
import type { BuktiKunjungan } from '@/types/visit-proof.types';

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

export const useKanbanTicketQuery = useKanbanTicketDetailQuery;

interface MoveTicketContext {
  previousQueries: [readonly unknown[], ApiResponse<TiketWithDetails[]> | undefined][];
  previousTicketDetail?: ApiResponse<TiketWithDetails>;
}

export function useMoveTicketMutation(
  options?: UseMutationOptions<
    ApiResponse<TiketWithDetails>,
    Error,
    MoveTicketPayload,
    MoveTicketContext
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: MoveTicketPayload) => kanbanService.moveTicket(payload),
    onMutate: async (...args) => {
      const payload = args[0];

      await queryClient.cancelQueries({ queryKey: kanbanKeys.all });

      const previousQueries = queryClient.getQueriesData<ApiResponse<TiketWithDetails[]>>({
        queryKey: ['kanban', 'board'],
      });
      const previousTicketDetail = queryClient.getQueryData<ApiResponse<TiketWithDetails>>(
        kanbanKeys.ticket(payload.id_tiket),
      );

      const targetStageId = payload.id_tahap || payload.id_tahap_tujuan || payload.toStageId;

      if (targetStageId) {
        queryClient.setQueriesData<ApiResponse<TiketWithDetails[]>>(
          { queryKey: ['kanban', 'board'] },
          (old) => {
            if (!old || !Array.isArray(old.data)) return old;
            return {
              ...old,
              data: old.data.map((ticket) =>
                ticket.id_tiket === payload.id_tiket
                  ? {
                      ...ticket,
                      ...payload.ticketUpdates,
                      id_tahap: targetStageId,
                      posisi: payload.posisi ?? ticket.posisi,
                    }
                  : ticket,
              ),
            };
          },
        );

        if (previousTicketDetail?.data) {
          queryClient.setQueryData<ApiResponse<TiketWithDetails>>(
            kanbanKeys.ticket(payload.id_tiket),
            {
              ...previousTicketDetail,
              data: {
                ...previousTicketDetail.data,
                ...payload.ticketUpdates,
                id_tahap: targetStageId,
              },
            },
          );
        }
      }

      await options?.onMutate?.(...args);

      return { previousQueries, previousTicketDetail };
    },
    onError: (...args) => {
      const [err, variables, context] = args;

      if (context?.previousQueries) {
        context.previousQueries.forEach(([qKey, prevData]) => {
          queryClient.setQueryData(qKey, prevData);
        });
      }
      if (context?.previousTicketDetail) {
        queryClient.setQueryData(
          kanbanKeys.ticket(variables.id_tiket),
          context.previousTicketDetail,
        );
      }

      const errMsg = getErrorMessage(err);
      console.warn('[Move Ticket Error]:', errMsg);

      try {
        toast.danger('Gagal memindahkan prospek', {
          description: React.createElement(
            'span',
            { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
            errMsg || 'Terjadi kesalahan saat memindahkan tahap tiket.',
          ),
        });
      } catch {

      }

      options?.onError?.(...args);
    },
    onSettled: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await options?.onSettled?.(...args);
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

export function useCreateAktivitasMutation(
  options?: UseMutationOptions<ApiResponse<AktivitasWithDetails>, Error, CreateAktivitasInput>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateAktivitasInput) => kanbanService.createAktivitas(payload),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kanbanKeys.all }),
        queryClient.invalidateQueries({ queryKey: kanbanKeys.ticket(args[1].id_tiket) }),
      ]);
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Aktivitas Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useCreateBuktiKunjunganMutation(
  options?: UseMutationOptions<ApiResponse<BuktiKunjungan>, Error, FormData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (formData: FormData) => kanbanService.createBuktiKunjungan(formData),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Bukti Kunjungan Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useCreateEvidenceMutation(
  options?: UseMutationOptions<ApiResponse<EvidenceItem>, Error, FormData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (formData: FormData) => kanbanService.createEvidence(formData),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Evidence Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useCreateTicketMutation(
  options?: UseMutationOptions<
    ApiResponse<TiketWithDetails>,
    Error,
    CreateTiketInput
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (payload: CreateTiketInput) => kanbanService.createTicket(payload),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.board() });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Create Ticket Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useUpdateTicketMutation(
  options?: UseMutationOptions<
    ApiResponse<TiketWithDetails>,
    Error,
    { id: string; payload: UpdateTiketInput }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTiketInput }) =>
      kanbanService.updateTicket(id, payload),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.board() });
      await queryClient.invalidateQueries({
        queryKey: kanbanKeys.ticket(args[1].id),
      });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Update Ticket Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useDeleteTicketMutation(
  options?: UseMutationOptions<ApiResponse<null>, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => kanbanService.deleteTicket(id),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.board() });
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Delete Ticket Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useUpdateAktivitasMutation(
  idTiket: string,
  options?: UseMutationOptions<
    ApiResponse<AktivitasWithDetails>,
    Error,
    { id: string; data: UpdateAktivitasInput }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: string; data: UpdateAktivitasInput }) =>
      kanbanService.updateAktivitas(id, data),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.ticket(idTiket) });
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.activities(idTiket) });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Update Aktivitas Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}

export function useDeleteAktivitasMutation(
  idTiket: string,
  options?: UseMutationOptions<ApiResponse<null>, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => kanbanService.deleteAktivitas(id),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.ticket(idTiket) });
      await queryClient.invalidateQueries({ queryKey: kanbanKeys.activities(idTiket) });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      console.warn('[Delete Aktivitas Error]:', getErrorMessage(args[0]));
      options?.onError?.(...args);
    },
  });
}
