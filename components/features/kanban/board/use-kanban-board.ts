import * as React from 'react';
import { useSession } from 'next-auth/react';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  KanbanMoveEvent,
  KanbanRootProps,
} from '@/components/reui/kanban';
import type { ChipFilterItem } from '@/components/ui/chip-filter';
import { toast } from '@/components/ui/toast';
import { countActiveFilters } from '../filter';
import { useKanbanFilterStore } from '@/store/kanban-filter-store';
import { StageDrawerMode, StageActivityDrawerProps } from '../stage-activity-drawer';
import { detectFileType } from '../stage-drawer/types';
import { useKanbanStore } from '@/lib/kanban-store';
import {
  INITIAL_KANBAN_STAGES,
  AKTIVITAS_STAGE_CONFIG,
  KanbanStageColumn,
} from '@/constants/kanban-constants';
import {
  TiketWithDetails,
  TeamContributionItem,
  CreateTiketInput,
} from '@/types/ticket.types';
import { formatCompactRupiah } from '@/lib/utils';
import {
  useKanbanStagesQuery,
  useKanbanBoardQuery,
  useMoveTicketMutation,
  useCreateTicketMutation,
  useCreateAktivitasMutation,
  useCreateBuktiKunjunganMutation,
  useCreateEvidenceMutation,
} from '@/hooks/queries/use-kanban-query';
import type { KanbanBoardFilterParams } from '@/services/kanban-service';

type KanbanProps = KanbanRootProps<TiketWithDetails>;
type DragStartEvent = Parameters<NonNullable<KanbanProps['onDragStart']>>[0];
type DragEndEvent = Parameters<NonNullable<KanbanProps['onDragEnd']>>[0];

export interface PendingStageMove {
  ticket: TiketWithDetails;
  fromStage: KanbanStageColumn | null;
  targetStage: KanbanStageColumn;
  targetIndex?: number;
}

export function useKanbanBoard() {
  const {
    ticketsByStage,
    setTicketsByStage,
    moveTicketWithStageUpdate,
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

  // -------------------------------------------------------------------
  // 1. TanStack Query: Fetch Stages & Mutations
  // -------------------------------------------------------------------
  const { data: session } = useSession();
  const stagesQuery = useKanbanStagesQuery();
  const moveTicketMutation = useMoveTicketMutation();
  const createTicketMutation = useCreateTicketMutation();
  const createAktivitasMutation = useCreateAktivitasMutation();
  const createBuktiKunjunganMutation = useCreateBuktiKunjunganMutation();
  const createEvidenceMutation = useCreateEvidenceMutation();

  const [isSubmittingMove, setIsSubmittingMove] = React.useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = React.useState(false);
  const isSubmitting = isSubmittingMove || isCreatingTicket;

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

  // Ensure active selected stage defaults to stages[0]?.id_tahap (UUID tahap riil)
  const activeSelectedStageId = React.useMemo(() => {
    if (!stages.length) return storeSelectedStageId;
    const exists = stages.some((s) => s.id_tahap === storeSelectedStageId);
    return exists ? storeSelectedStageId : (stages[0]?.id_tahap ?? storeSelectedStageId);
  }, [stages, storeSelectedStageId]);

  // Synchronize store when stages arrive and storeSelectedStageId is not in stages
  React.useEffect(() => {
    if (stages.length > 0 && !stages.some((s) => s.id_tahap === storeSelectedStageId)) {
      setSelectedStageId(stages[0].id_tahap);
    }
  }, [stages, storeSelectedStageId, setSelectedStageId]);

  // -------------------------------------------------------------------
  // 2. TanStack Query: Fetch Board Tickets
  // -------------------------------------------------------------------
  const queryParams: KanbanBoardFilterParams = React.useMemo(() => {
    const minVal = filterState.minEstimate
      ? Number(filterState.minEstimate.replace(/\D/g, ''))
      : undefined;
    const maxVal = filterState.maxEstimate
      ? Number(filterState.maxEstimate.replace(/\D/g, ''))
      : undefined;

    return {
      search: searchQuery.trim() || undefined,
      salesId:
        filterState.salesId && filterState.salesId !== 'all'
          ? filterState.salesId
          : undefined,
      squadId: filterState.squadId || undefined,
      priorities:
        filterState.priorities.length > 0 ? filterState.priorities : undefined,
      stages: filterState.stages.length > 0 ? filterState.stages : undefined,
      minEstimate: minVal,
      maxEstimate: maxVal,
      closingFrom: filterState.closingFrom || undefined,
      closingTo: filterState.closingTo || undefined,
    };
  }, [searchQuery, filterState]);

  const boardQuery = useKanbanBoardQuery(queryParams);

  // Parse flat array of tickets returned from backend GET /tiket
  const rawTickets = React.useMemo(() => {
    const data = boardQuery.data?.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [boardQuery.data]);

  // Group real tickets by id_tahap (UUID stages from GET /tahap-kanban)
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
    return map;
  }, [stages, rawTickets]);

  // Synchronize Zustand store when backend TanStack Query data arrives
  React.useEffect(() => {
    if (ticketsByStageFromApi && Object.keys(ticketsByStageFromApi).length > 0) {
      setTicketsByStage(ticketsByStageFromApi);
    }
  }, [ticketsByStageFromApi, setTicketsByStage]);

  // Guaranteed normalization so every rendered stage column ALWAYS has an array (never undefined)
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

  // -------------------------------------------------------------------
  // 3. Dragging active states
  // -------------------------------------------------------------------
  const [activeDraggedTicketId, setActiveDraggedTicketId] = React.useState<
    string | null
  >(null);
  const dragSourceStageRef = React.useRef<string | null>(null);

  // Stage Activity Drawer state (supports 'move' and 'create' modes)
  const [drawerMode, setDrawerMode] = React.useState<StageDrawerMode>('move');
  const [targetStageForAction, setTargetStageForAction] =
    React.useState<KanbanStageColumn | null>(null);
  const [pendingStageMove, setPendingStageMove] =
    React.useState<PendingStageMove | null>(null);
  const [isStageDrawerOpen, setIsStageDrawerOpen] = React.useState(false);

  const columnRefs = React.useRef<Record<string, HTMLElement | null>>({});

  // Active column holding the dragged item
  const activeHoldingStageId = React.useMemo(() => {
    if (!activeDraggedTicketId) return null;
    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      if (list.some((item) => item.id_tiket === activeDraggedTicketId)) {
        return stageId;
      }
    }
    return null;
  }, [activeDraggedTicketId, normalizedTicketsByStage]);

  // -------------------------------------------------------------------
  // 4. Client-Side Filtering Fallback
  // -------------------------------------------------------------------
  const filteredTicketsByStage = React.useMemo(() => {
    const result: Record<string, TiketWithDetails[]> = {};
    const q = searchQuery.trim().toLowerCase();
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
        if (
          filterState.stages.length > 0 &&
          !filterState.stages.includes(ticket.id_tahap) &&
          !filterState.stages.includes(ticket.status)
        ) {
          return false;
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
        if (
          filterState.salesId &&
          filterState.salesId !== 'all' &&
          ticket.id_user !== filterState.salesId
        ) {
          return false;
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
  }, [stages, normalizedTicketsByStage, searchQuery, filterState]);

  // -------------------------------------------------------------------
  // 5. Dynamic Pipeline Summary Calculation
  // -------------------------------------------------------------------
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

  // Dynamic team contribution aggregation
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

  // Stage filter chips (all 7 stages)
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

  const activeFilterCount = countActiveFilters(filterState);

  const scrollToStage = (stageId: string) => {
    columnRefs.current[stageId]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  const handleSelectStageChip = (stageId: string) => {
    setSelectedStageId(stageId);
    scrollToStage(stageId);
  };

  // Next stage for floating quick-move pill
  const currentStageIndex = stages.findIndex(
    (s) => s.id_tahap === activeSelectedStageId,
  );
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex < stages.length - 1
      ? stages[currentStageIndex + 1]
      : null;
  const activeStageTickets = filteredTicketsByStage[activeSelectedStageId] ?? [];
  const quickMoveTicket = activeStageTickets[0];

  const startMove = (pending: PendingStageMove) => {
    setDrawerMode('move');
    setTargetStageForAction(pending.targetStage);
    setPendingStageMove(pending);
    setIsStageDrawerOpen(true);
  };

  const handleQuickMove = () => {
    if (!quickMoveTicket || !nextStage) return;
    const currentStageObj =
      stages.find((s) => s.id_tahap === activeSelectedStageId) ??
      stages.find((s) => s.id_tahap === quickMoveTicket.id_tahap) ??
      stages[0];

    startMove({
      ticket: quickMoveTicket,
      fromStage: currentStageObj,
      targetStage: nextStage,
      targetIndex: 0,
    });
  };

  // Trigger Add Card Drawer for a specific stage
  const handleOpenAddCardDrawer = (stage: KanbanStageColumn) => {
    setDrawerMode('create');
    setTargetStageForAction(stage);
    setPendingStageMove(null);
    setIsStageDrawerOpen(true);
  };

  // Drag-and-drop end resolution handler
  const handleDragOrMoveEnd = (
    activeId: string,
    overId: string | undefined,
  ) => {
    if (!overId) return;

    let fromStageId = dragSourceStageRef.current;
    let draggedTicket: TiketWithDetails | null = null;

    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      const match = list.find((t) => t.id_tiket === activeId);
      if (match) {
        if (!fromStageId) fromStageId = stageId;
        draggedTicket = match;
        break;
      }
    }

    let toStageId: string | null = null;
    if (stages.some((s) => s.id_tahap === overId)) {
      toStageId = overId;
    } else {
      for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
        if (list.some((t) => t.id_tiket === overId)) {
          toStageId = stageId;
          break;
        }
      }
    }

    if (!fromStageId || !toStageId || !draggedTicket) return;

    // Dropped in SAME stage -> reorder
    if (fromStageId === toStageId) {
      const list = [...(normalizedTicketsByStage[fromStageId] ?? [])];
      const oldIdx = list.findIndex((t) => t.id_tiket === activeId);
      const newIdx = list.findIndex((t) => t.id_tiket === overId);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        setTicketsByStage({
          ...normalizedTicketsByStage,
          [fromStageId]: arrayMove(list, oldIdx, newIdx),
        });
      }
      return;
    }

    // Dropped into DIFFERENT stage -> trigger drawer
    const fromStageObj = stages.find((s) => s.id_tahap === fromStageId) ?? null;
    const toStageObj = stages.find((s) => s.id_tahap === toStageId) ?? null;

    if (toStageObj) {
      startMove({
        ticket: draggedTicket,
        fromStage: fromStageObj,
        targetStage: toStageObj,
        targetIndex: 0,
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    setActiveDraggedTicketId(activeId);
    for (const [stageId, list] of Object.entries(normalizedTicketsByStage)) {
      if (list.some((t) => t.id_tiket === activeId)) {
        dragSourceStageRef.current = stageId;
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDraggedTicketId(null);
    if (event.over) {
      handleDragOrMoveEnd(String(event.active.id), String(event.over.id));
    }
    dragSourceStageRef.current = null;
  };

  const handleDragCancel = () => {
    setActiveDraggedTicketId(null);
    dragSourceStageRef.current = null;
  };

  const handleMove = ({
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
  }: KanbanMoveEvent) => {
    if (activeContainer === overContainer) {
      const list = normalizedTicketsByStage[activeContainer] ?? [];
      setTicketsByStage({
        ...normalizedTicketsByStage,
        [activeContainer]: arrayMove(list, activeIndex, overIndex),
      });
      return;
    }

    const fromStageObj =
      stages.find((s) => s.id_tahap === activeContainer) ?? null;
    const toStageObj = stages.find((s) => s.id_tahap === overContainer) ?? null;
    const draggedItem = normalizedTicketsByStage[activeContainer]?.[activeIndex];

    if (!draggedItem || !toStageObj) return;

    startMove({
      ticket: draggedItem,
      fromStage: fromStageObj,
      targetStage: toStageObj,
      targetIndex: overIndex,
    });
  };

  // Confirm ticket move
  const handleConfirmStageMove: NonNullable<
    StageActivityDrawerProps['onConfirmMove']
  > = async (params) => {
    setIsSubmittingMove(true);

    // 1. Local optimistic update in store for immediate rendering
    moveTicketWithStageUpdate(params);

    try {
      // 2. Step 1: Move ticket (PATCH /tiket/:id)
      await moveTicketMutation.mutateAsync({
        id_tiket: params.id_tiket,
        id_tahap: params.toStageId,
        fromStageId: params.fromStageId,
        toStageId: params.toStageId,
        targetIndex: params.targetIndex,
        ticketUpdates: params.ticketUpdates,
        catatan: params.activity?.catatan,
        posisi:
          typeof params.targetIndex === 'number'
            ? params.targetIndex + 1
            : undefined,
      });

      // 3. Step 2: Create activity (POST /aktivitas)
      const userId =
        session?.user?.id_user || params.activity.id_user || 'usr-1';
      const createdAktivitasRes = await createAktivitasMutation.mutateAsync({
        id_user: userId,
        id_tiket: params.id_tiket,
        tanggal: params.activity.tanggal || new Date().toISOString(),
        catatan:
          params.activity.catatan || `Aktivitas tahap ${params.toStageId}`,
        jenis_kegiatan: params.activity.jenis_kegiatan,
        jadwal_follow_up: params.activity.jadwal_follow_up,
      });

      const newAktivitasId = createdAktivitasRes?.data?.id_aktivitas;

      // 4. Step 3: Bukti Berkas Chaining
      if (newAktivitasId && params.evidenceFile?.rawFile) {
        const targetStageObj = stages.find(
          (s) => s.id_tahap === params.toStageId,
        );
        const stageType = targetStageObj?.jenis_tahap;

        if (stageType === 'visit') {
          // POST /bukti-kunjungan (multipart/form-data)
          const formData = new FormData();
          formData.append('id_aktivitas', newAktivitasId);
          formData.append('img_url', params.evidenceFile.rawFile);
          if (params.gpsData) {
            formData.append('latitude', String(params.gpsData.latitude));
            formData.append('longitude', String(params.gpsData.longitude));
            formData.append('jarak_klien', String(params.gpsData.jarak_klien));
            formData.append(
              'dalam_radius',
              params.gpsData.dalam_radius ? 'true' : 'false',
            );
          }
          await createBuktiKunjunganMutation.mutateAsync(formData);
        } else {
          // POST /evidence (multipart/form-data)
          const formData = new FormData();
          formData.append('id_aktivitas', newAktivitasId);
          formData.append('file', params.evidenceFile.rawFile);
          formData.append('tipe', detectFileType(params.evidenceFile.name));
          formData.append('deskripsi', params.evidenceFile.name);
          if (params.activity.catatan) {
            formData.append('catatan', params.activity.catatan);
          }
          await createEvidenceMutation.mutateAsync(formData);
        }
      }

      toast.add({
        title: 'Berhasil Memindahkan Tiket',
        description: 'Tiket berhasil dipindahkan dan berkas bukti tercatat.',
        type: 'success',
      });

      setSelectedStageId(params.toStageId);
      scrollToStage(params.toStageId);
      setIsStageDrawerOpen(false);
      setPendingStageMove(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses aktivitas tiket.';
      toast.add({
        title: 'Gagal Memproses Perpindahan',
        description: message,
        type: 'error',
      });
    } finally {
      setIsSubmittingMove(false);
    }
  };

  // Confirm new ticket creation in that stage
  const handleConfirmCreateTicket: NonNullable<
    StageActivityDrawerProps['onCreateTicket']
  > = async (params) => {
    setIsCreatingTicket(true);
    try {
      const userId = session?.user?.id_user || 'usr-1';
      const createPayload: CreateTiketInput = {
        ...params.createPayload,
        id_user: userId,
      };

      // 1. Step 1: Create Ticket (POST /tiket)
      const res = await createTicketMutation.mutateAsync(createPayload);
      const createdTicket = res?.data;
      const createdTicketId = createdTicket?.id_tiket;

      // 2. Step 2: Chaining Activity (POST /aktivitas)
      if (createdTicketId && params.activityPayload) {
        try {
          const createdAktivitasRes = await createAktivitasMutation.mutateAsync({
            id_user: userId,
            id_tiket: createdTicketId,
            tanggal: params.activityPayload.tanggal || new Date().toISOString(),
            catatan: params.activityPayload.catatan,
            jenis_kegiatan: params.activityPayload.jenis_kegiatan,
            jadwal_follow_up: params.activityPayload.jadwal_follow_up,
          });

          const newAktivitasId = createdAktivitasRes?.data?.id_aktivitas;

          // 3. Step 3: Chaining Bukti Berkas
          if (newAktivitasId && params.evidenceFile?.rawFile) {
            const targetStageObj = stages.find(
              (s) => s.id_tahap === params.createPayload.id_tahap,
            );
            const stageType = targetStageObj?.jenis_tahap;

            if (stageType === 'visit') {
              const formData = new FormData();
              formData.append('id_aktivitas', newAktivitasId);
              formData.append('img_url', params.evidenceFile.rawFile);
              if (params.gpsData) {
                formData.append('latitude', String(params.gpsData.latitude));
                formData.append('longitude', String(params.gpsData.longitude));
                formData.append('jarak_klien', String(params.gpsData.jarak_klien));
                formData.append(
                  'dalam_radius',
                  params.gpsData.dalam_radius ? 'true' : 'false',
                );
              }
              await createBuktiKunjunganMutation.mutateAsync(formData);
            } else {
              const formData = new FormData();
              formData.append('id_aktivitas', newAktivitasId);
              formData.append('file', params.evidenceFile.rawFile);
              formData.append('tipe', detectFileType(params.evidenceFile.name));
              formData.append('deskripsi', params.evidenceFile.name);
              if (params.activityPayload.catatan) {
                formData.append('catatan', params.activityPayload.catatan);
              }
              await createEvidenceMutation.mutateAsync(formData);
            }
          }
        } catch (actErr) {
          console.warn('[Create Activity Chaining Warning]:', actErr);
        }
      }

      toast.add({
        title: 'Berhasil Membuat Prospek',
        description: `Prospek "${createPayload.judul}" berhasil ditambahkan.`,
        type: 'success',
      });

      const targetStageId = params.createPayload.id_tahap || 'visit';
      setSelectedStageId(targetStageId);
      scrollToStage(targetStageId);
      setIsStageDrawerOpen(false);
      setPendingStageMove(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat membuat tiket prospek.';
      toast.add({
        title: 'Gagal Membuat Prospek',
        description: message,
        type: 'error',
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleCancelMove = () => {
    setPendingStageMove(null);
    setTargetStageForAction(null);
  };

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
    activeDraggedTicketId,
    activeHoldingStageId,
    drawerMode,
    targetStageForAction,
    pendingStageMove,
    isStageDrawerOpen,
    setIsStageDrawerOpen,
    filteredTicketsByStage,
    totalPipelineLabel,
    activeTicketsCount,
    targetPercentage,
    teamContributions,
    stageChips,
    activeFilterCount,
    nextStage,
    quickMoveTicket,
    isMovingTicket: moveTicketMutation.isPending,
    isCreatingTicket,
    isSubmittingMove,
    isSubmitting,
    isLoading: stagesQuery.isLoading || boardQuery.isLoading,
    isFetching: stagesQuery.isFetching || boardQuery.isFetching,
    isError: stagesQuery.isError || boardQuery.isError,
    error: stagesQuery.error || boardQuery.error,
    refetch: () => {
      stagesQuery.refetch();
      boardQuery.refetch();
    },
    handleSelectStageChip,
    handleQuickMove,
    handleOpenAddCardDrawer,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleMove,
    handleConfirmStageMove,
    handleConfirmCreateTicket,
    handleCancelMove,
  };
}
