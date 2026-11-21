import * as React from 'react';
import { useSession } from 'next-auth/react';
import type { ChipFilterItem } from '@/components/ui/chip-filter';
import { normalizeRole } from '@/lib/rbac';
import { countActiveFilters } from '../filter';
import { useKanbanFilterStore } from '@/store/kanban-filter-store';
import { useKanbanStore } from '@/store/kanban-store';
import {
  INITIAL_KANBAN_STAGES,
  AKTIVITAS_STAGE_CONFIG,
  KanbanStageColumn,
} from '@/constants/kanban-constants';
import {
  TiketWithDetails,
  TeamContributionItem,
} from '@/types/ticket.types';
import { formatCompactRupiah } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useKanbanStagesQuery,
  useKanbanBoardQuery,
  useMoveTicketMutation,
} from '@/hooks/queries/use-kanban-query';
import { useSquadListQuery } from '@/hooks/queries';
import type { KanbanBoardFilterParams } from '@/services/kanban-service';
import { useKanbanDnd, type PendingStageMove } from './use-kanban-dnd';
import { useKanbanTicketMove } from './use-kanban-ticket-move';

export type { PendingStageMove };

export function useKanbanBoard() {
  const { data: session, status: sessionStatus } = useSession();
  const activeRole = normalizeRole(session?.user?.role);
  const isSalesRole = activeRole === 'sales';
  const currentUserId = session?.user?.id_user || session?.user?.id || '';
  const currentUserSquadId = session?.user?.id_squad ?? null;

  const {
    ticketsByStage,
    setTicketsByStage,
  } = useKanbanStore();

  const {
    searchQuery,
    setSearchQuery,
    selectedStageId: storeSelectedStageId,
    setSelectedStageId,
    isFilterDrawerOpen: filterOpen,
    setFilterDrawerOpen: setFilterOpen,
    isTambahKolomOpen,
    setIsTambahKolomOpen,
    filterState,
    setFilterState,
    resetFilters,
  } = useKanbanFilterStore();

  const stagesQuery = useKanbanStagesQuery();
  const squadsQuery = useSquadListQuery({ limit: 100 });
  const moveTicketMutation = useMoveTicketMutation();

  const stages: KanbanStageColumn[] = React.useMemo(() => {
    const raw = stagesQuery.data?.data;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((s) => s.is_aktif ?? true)
        .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
        .map((s, idx) => ({
          ...s,
          dotColor:
            s.dotColor ||
            AKTIVITAS_STAGE_CONFIG[s.jenis_tahap]?.dotColor ||
            INITIAL_KANBAN_STAGES[idx % INITIAL_KANBAN_STAGES.length]?.dotColor ||
            '#7C5CFC',
        }));
    }
    return INITIAL_KANBAN_STAGES;
  }, [stagesQuery.data]);

  const activeSelectedStageId = React.useMemo(() => {
    if (!stages.length) return storeSelectedStageId;
    const exists = stages.some((s) => s.id_tahap === storeSelectedStageId);
    return exists ? storeSelectedStageId : (stages[0]?.id_tahap ?? storeSelectedStageId);
  }, [stages, storeSelectedStageId]);

  React.useEffect(() => {
    if (stages.length > 0 && !stages.some((s) => s.id_tahap === storeSelectedStageId)) {
      setSelectedStageId(stages[0].id_tahap);
    }
  }, [stages, storeSelectedStageId, setSelectedStageId]);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const queryParams: KanbanBoardFilterParams = React.useMemo(() => {
    const minVal = filterState.minEstimate
      ? Number(filterState.minEstimate.replace(/\D/g, ''))
      : undefined;
    const maxVal = filterState.maxEstimate
      ? Number(filterState.maxEstimate.replace(/\D/g, ''))
      : undefined;

    const selectedSalesId = isSalesRole
      ? currentUserId || undefined
      : filterState.salesId && filterState.salesId !== 'all'
        ? filterState.salesId
        : undefined;
    const selectedSquadId = isSalesRole
      ? undefined
      : filterState.squadId && filterState.squadId !== 'all'
        ? filterState.squadId
        : undefined;

    return {
      search: debouncedSearchQuery.trim() || undefined,
      id_user: selectedSalesId,
      id_squad: selectedSquadId,
      priorities:
        filterState.priorities.length > 0 ? filterState.priorities : undefined,
      minEstimate: minVal,
      maxEstimate: maxVal,
      closingFrom: filterState.closingFrom || undefined,
      closingTo: filterState.closingTo || undefined,
    };
  }, [debouncedSearchQuery, filterState, isSalesRole, currentUserId]);

  const boardQuery = useKanbanBoardQuery(queryParams, {
    enabled: sessionStatus !== 'loading' && (!isSalesRole || Boolean(currentUserId)),
  });

  const rawTickets = React.useMemo(() => {
    const data = boardQuery.data?.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [boardQuery.data]);

  const ticketsByStageFromApi = React.useMemo(() => {
    const map: Record<string, TiketWithDetails[]> = {};
    stages.forEach((stage) => {
      map[stage.id_tahap] = [];
    });
    (rawTickets || []).forEach((ticket) => {
      const stageId = ticket.id_tahap;
      if (map[stageId]) {
        map[stageId].push(ticket);
      } else {
        map[stageId] = [ticket];
      }
    });
    Object.values(map).forEach((list) => {
      list.sort((a, b) => {
        const posDiff =
          (a.posisi ?? Number.MAX_SAFE_INTEGER) - (b.posisi ?? Number.MAX_SAFE_INTEGER);
        if (posDiff !== 0) return posDiff;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
    });
    return map;
  }, [stages, rawTickets]);

  React.useEffect(() => {
    if (ticketsByStageFromApi && Object.keys(ticketsByStageFromApi).length > 0) {
      setTicketsByStage(ticketsByStageFromApi);
    }
  }, [ticketsByStageFromApi, setTicketsByStage]);

  const normalizedTicketsByStage = React.useMemo(() => {
    const result: Record<string, TiketWithDetails[]> = {};
    stages.forEach((st) => {
      const stageId = st.id_tahap;
      result[stageId] = ticketsByStage[stageId] || [];
    });
    Object.entries(ticketsByStage).forEach(([key, items]) => {
      if (!result[key]) {
        result[key] = items;
      }
    });
    return result;
  }, [stages, ticketsByStage]);

  const columnRefs = React.useRef<Record<string, HTMLElement | null>>({});

  const scrollToStage = (stageId: string) => {
    columnRefs.current[stageId]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  const filteredTicketsByStage = React.useMemo(() => {
    const result: Record<string, TiketWithDetails[]> = {};
    const stageJenisById = new Map(stages.map((s) => [s.id_tahap, s.jenis_tahap]));
    const q = debouncedSearchQuery.trim().toLowerCase();
    const minVal = filterState.minEstimate
      ? Number(filterState.minEstimate.replace(/\D/g, ''))
      : null;
    const maxVal = filterState.maxEstimate
      ? Number(filterState.maxEstimate.replace(/\D/g, ''))
      : null;

    stages.forEach((stage) => {
      const items = normalizedTicketsByStage[stage.id_tahap] ?? [];
      result[stage.id_tahap] = items.filter((ticket) => {
        if (
          q &&
          !ticket.judul?.toLowerCase().includes(q) &&
          !ticket.nama_outlet?.toLowerCase().includes(q) &&
          !ticket.kode_tiket?.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (filterState.stages.length > 0) {
          const stageJenis = stageJenisById.get(ticket.id_tahap);
          const matchesStage =
            filterState.stages.includes(ticket.id_tahap) ||
            (stageJenis ? filterState.stages.includes(stageJenis) : false) ||
            filterState.stages.includes(ticket.status);
          if (!matchesStage) {
            return false;
          }
        }
        if (
          filterState.priorities.length > 0 &&
          !filterState.priorities.includes(ticket.prioritas)
        ) {
          return false;
        }
        if (minVal !== null && !isNaN(minVal) && (ticket.estimasi_nilai ?? 0) < minVal) {
          return false;
        }
        if (maxVal !== null && !isNaN(maxVal) && (ticket.estimasi_nilai ?? 0) > maxVal) {
          return false;
        }
        if (isSalesRole) {
          if (!currentUserId || ticket.id_user !== currentUserId) {
            return false;
          }
        } else {
          if (
            filterState.salesId &&
            filterState.salesId !== 'all' &&
            ticket.id_user !== filterState.salesId
          ) {
            return false;
          }
          if (filterState.squadId && filterState.squadId !== 'all') {
            const ticketSquadId =
              ticket.id_squad ??
              ticket.user?.id_squad ??
              ticket.squad?.id_squad ??
              ticket.user?.squad?.id_squad;
            if (ticketSquadId && ticketSquadId !== filterState.squadId) {
              return false;
            }
          }
        }
        if (filterState.closingFrom && ticket.estimasi_closing) {
          const ticketTime = new Date(ticket.estimasi_closing).getTime();
          const fromTime = new Date(filterState.closingFrom).getTime();
          if (!isNaN(ticketTime) && !isNaN(fromTime) && ticketTime < fromTime) {
            return false;
          }
        }
        if (filterState.closingTo && ticket.estimasi_closing) {
          const ticketTime = new Date(ticket.estimasi_closing).getTime();
          const toDate = new Date(filterState.closingTo);
          toDate.setHours(23, 59, 59, 999);
          const toTime = toDate.getTime();
          if (!isNaN(ticketTime) && !isNaN(toTime) && ticketTime > toTime) {
            return false;
          }
        }
        return true;
      });
    });

    return result;
  }, [stages, normalizedTicketsByStage, debouncedSearchQuery, filterState, isSalesRole, currentUserId]);

  const { totalPipelineLabel, activeTicketsCount, targetPercentage } =
    React.useMemo(() => {
      let total = 0;
      let count = 0;
      let wonCount = 0;

      Object.values(filteredTicketsByStage).forEach((list) => {
        list.forEach((t) => {
          total += t.estimasi_nilai || 0;
          count += 1;
          if (t.status === 'won' || t.id_tahap === 'revenue') {
            wonCount += 1;
          }
        });
      });

      const percentage = count > 0 ? Math.round((wonCount / count) * 100) : 0;

      return {
        totalPipelineLabel: total > 0 ? formatCompactRupiah(total) : 'Rp0',
        activeTicketsCount: count,
        targetPercentage: percentage,
      };
    }, [filteredTicketsByStage]);

  const teamContributions: TeamContributionItem[] = React.useMemo(() => {
    const salesMap: Record<
      string,
      { name: string; totalVal: number; count: number; wonCount: number }
    > = {};

    Object.values(normalizedTicketsByStage).forEach((list) => {
      list.forEach((t) => {
        const key = t.id_user || t.nama_sales || 'unknown';
        const name = t.nama_sales || 'Sales';
        if (!salesMap[key]) {
          salesMap[key] = { name, totalVal: 0, count: 0, wonCount: 0 };
        }
        salesMap[key].totalVal += t.estimasi_nilai || 0;
        salesMap[key].count += 1;
        if (t.status === 'won' || t.id_tahap === 'revenue') {
          salesMap[key].wonCount += 1;
        }
      });
    });

    const entries = Object.entries(salesMap);
    if (entries.length === 0) return [];

    return entries.slice(0, 3).map(([id, item]) => {
      const rate =
        item.count > 0 ? Math.round((item.wonCount / item.count) * 100) : 0;
      return {
        id,
        name: item.name,
        valueLabel: formatCompactRupiah(item.totalVal),
        ticketsLabel: `${item.count} Tiket (${rate}%)`,
      };
    });
  }, [normalizedTicketsByStage]);

  const stageChips: ChipFilterItem[] = React.useMemo(
    () =>
      stages.map((stage) => ({
        id: stage.id_tahap,
        label: stage.nama_tahap,
        count: (filteredTicketsByStage[stage.id_tahap] ?? []).length,
        dotColor: stage.dotColor,
      })),
    [stages, filteredTicketsByStage],
  );

  const activeFilterCount = countActiveFilters(filterState, {
    hideTeamFilters: isSalesRole,
  });

  const squadLabel = React.useMemo(() => {
    const squads = squadsQuery.data?.data ?? [];
    if (isSalesRole) {
      if (currentUserSquadId) {
        const matched = squads.find((s) => s.id_squad === currentUserSquadId);
        if (matched?.nama_squad) return matched.nama_squad;
      }
      return 'Prospek Saya';
    }
    if (filterState.squadId && filterState.squadId !== 'all') {
      const matched = squads.find((s) => s.id_squad === filterState.squadId);
      if (matched?.nama_squad) return matched.nama_squad;
    }
    return 'Semua Squad';
  }, [squadsQuery.data, isSalesRole, currentUserSquadId, filterState.squadId]);

  const handleSelectStageChip = (stageId: string) => {
    setSelectedStageId(stageId);
    scrollToStage(stageId);
  };

  const currentStageIndex = stages.findIndex(
    (s) => s.id_tahap === activeSelectedStageId,
  );
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex < stages.length - 1
      ? stages[currentStageIndex + 1]
      : null;
  const activeStageTickets = filteredTicketsByStage[activeSelectedStageId] ?? [];
  const quickMoveTicket = activeStageTickets[0];

  const ticketMove = useKanbanTicketMove({
    stages,
    activeSelectedStageId,
    quickMoveTicket,
    nextStage,
    setSelectedStageId,
    scrollToStage,
  });

  const dnd = useKanbanDnd({
    stages,
    normalizedTicketsByStage,
    setTicketsByStage,
    startMove: ticketMove.startMove,
  });

  return {
    stages,
    ticketsByStage: normalizedTicketsByStage,
    setTicketsByStage,
    columnRefs,
    searchQuery,
    setSearchQuery,
    selectedStageId: activeSelectedStageId,
    setSelectedStageId,
    filterOpen,
    setFilterOpen,
    filterState,
    setFilterState,
    resetFilters,
    isTambahKolomOpen,
    setIsTambahKolomOpen,
    activeDraggedTicketId: dnd.activeDraggedTicketId,
    activeHoldingStageId: dnd.activeHoldingStageId,
    drawerMode: ticketMove.drawerMode,
    targetStageForAction: ticketMove.targetStageForAction,
    pendingStageMove: ticketMove.pendingStageMove,
    isStageDrawerOpen: ticketMove.isStageDrawerOpen,
    setIsStageDrawerOpen: ticketMove.setIsStageDrawerOpen,
    filteredTicketsByStage,
    totalPipelineLabel,
    activeTicketsCount,
    targetPercentage,
    teamContributions,
    stageChips,
    activeFilterCount,
    squadLabel,
    nextStage,
    quickMoveTicket,
    isMovingTicket: moveTicketMutation.isPending,
    isCreatingTicket: ticketMove.isCreatingTicket,
    isSubmittingMove: ticketMove.isSubmittingMove,
    isSubmitting: ticketMove.isSubmitting,
    isLoading: stagesQuery.isLoading || boardQuery.isLoading,
    isFetching: stagesQuery.isFetching || boardQuery.isFetching,
    isError: stagesQuery.isError || boardQuery.isError,
    error: stagesQuery.error || boardQuery.error,
    refetch: () => {
      stagesQuery.refetch();
      boardQuery.refetch();
    },
    handleSelectStageChip,
    handleQuickMove: ticketMove.handleQuickMove,
    handleOpenAddCardDrawer: ticketMove.handleOpenAddCardDrawer,
    handleDragStart: dnd.handleDragStart,
    handleDragEnd: dnd.handleDragEnd,
    handleDragCancel: dnd.handleDragCancel,
    handleMove: dnd.handleMove,
    handleConfirmStageMove: ticketMove.handleConfirmStageMove,
    handleConfirmCreateTicket: ticketMove.handleConfirmCreateTicket,
    handleCancelMove: ticketMove.handleCancelMove,
  };
}
