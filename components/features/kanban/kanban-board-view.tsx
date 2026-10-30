'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MoreHorizontal, Plus } from 'lucide-react';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/reui/kanban';
import { Button } from '@/components/ui/button';
import { SearchFilterBar } from '@/components/ui/search-filter-bar';
import { ChipFilter, ChipFilterItem } from '@/components/ui/chip-filter';
import { KanbanPipelineCard } from './kanban-pipeline-card';
import { KanbanTicketCard } from './kanban-ticket-card';
import {
  INITIAL_KANBAN_FILTER,
  KanbanFilterDrawer,
  countActiveFilters,
  KanbanFilterState,
} from './kanban-filter-drawer';
import { TambahKolomDialog } from './tambah-kolom-dialog';
import { useKanbanStore } from '@/lib/kanban-store';
import { TEAM_CONTRIBUTIONS } from '@/constants/kanban-constants';
import { TiketWithDetails } from '@/types/ticket.types';
import { cn, formatCompactRupiah } from '@/lib/utils';

export type KanbanUserRole = 'sales' | 'manager' | 'director';

interface KanbanBoardViewProps {
  role: KanbanUserRole;
  basePath: string;
}

export function KanbanBoardView({ role, basePath }: KanbanBoardViewProps) {
  const router = useRouter();
  const {
    stages,
    ticketsByStage,
    setTicketsByStage,
    moveTicketToStage,
  } = useKanbanStore();

  const canCreateColumn = role === 'manager' || role === 'director';

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStageId, setSelectedStageId] = React.useState<string>(
    stages[0]?.id_tahap ?? 'penawaran',
  );
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<KanbanFilterState>(
    INITIAL_KANBAN_FILTER,
  );
  const [isTambahKolomOpen, setIsTambahKolomOpen] = React.useState(false);

  // Dragging active states to match Image 2 mockup
  const [activeDraggedTicketId, setActiveDraggedTicketId] = React.useState<
    string | null
  >(null);

  const columnRefs = React.useRef<Record<string, HTMLElement | null>>({});

  // Active column holding the dragged item
  const activeHoldingStageId = React.useMemo(() => {
    if (!activeDraggedTicketId) return null;
    for (const [stageId, list] of Object.entries(ticketsByStage)) {
      if (list.some((item) => item.id_tiket === activeDraggedTicketId)) {
        return stageId;
      }
    }
    return null;
  }, [activeDraggedTicketId, ticketsByStage]);

  // Filtered tickets per stage
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
      const items = ticketsByStage[stage.id_tahap] ?? [];
      result[stage.id_tahap] = items.filter((ticket) => {
        if (
          q &&
          !ticket.judul.toLowerCase().includes(q) &&
          !ticket.nama_faskes.toLowerCase().includes(q) &&
          !ticket.kode_tiket.toLowerCase().includes(q)
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
        if (minVal && ticket.estimasi_nilai < minVal) {
          return false;
        }
        if (maxVal && ticket.estimasi_nilai > maxVal) {
          return false;
        }
        if (
          filterState.salesId &&
          filterState.salesId !== 'all' &&
          ticket.id_user !== filterState.salesId
        ) {
          return false;
        }
        return true;
      });
    });

    return result;
  }, [stages, ticketsByStage, searchQuery, filterState]);

  // Calculate pipeline summary
  const { totalPipelineLabel, activeTicketsCount } = React.useMemo(() => {
    let total = 0;
    let count = 0;
    Object.values(ticketsByStage).forEach((list) => {
      list.forEach((t) => {
        total += t.estimasi_nilai;
        count += 1;
      });
    });
    return {
      totalPipelineLabel: total > 0 ? formatCompactRupiah(total) : 'Rp3,52 M',
      activeTicketsCount: count || 9,
    };
  }, [ticketsByStage]);

  // Build stage filter chips matching mockup (`• Penawaran 2`, `• Negosiasi 2`, `• Selesai 2`, ...)
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

  const handleSelectStageChip = (stageId: string) => {
    setSelectedStageId(stageId);
    const colEl = columnRefs.current[stageId];
    if (colEl) {
      colEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  };

  // Next stage for quick-move floating pill (`→ Pindah ke Negosiasi`)
  const currentStageIndex = stages.findIndex(
    (s) => s.id_tahap === selectedStageId,
  );
  const nextStage =
    stages[(currentStageIndex + 1) % Math.max(stages.length, 1)] ?? stages[1];
  const activeStageTickets = filteredTicketsByStage[selectedStageId] ?? [];
  const quickMoveTicket = activeStageTickets[0];

  const handleQuickMove = () => {
    if (!quickMoveTicket || !nextStage) return;
    moveTicketToStage(quickMoveTicket.id_tiket, nextStage.id_tahap);
    setSelectedStageId(nextStage.id_tahap);
  };

  return (
    <div className='relative flex w-full min-w-0 flex-col gap-3.5 pb-16'>
      {/* Page Title */}
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-lg font-bold tracking-tight text-foreground'>
          Papan Kanban
        </h1>
        <p className='text-xs text-muted-foreground'>
          Pipeline tiket · Squad Jakarta 1
        </p>
      </div>

      {/* Search Bar + Filter Button */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFilterModal={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Blue Pipeline Summary Card */}
      <KanbanPipelineCard
        totalPipelineLabel={totalPipelineLabel}
        activeTicketsCount={activeTicketsCount}
        targetPercentage={62}
        showTeamContributions={canCreateColumn}
        teamContributions={TEAM_CONTRIBUTIONS}
      />

      {/* Stage Filter Chips (`• Penawaran 2`, `• Negosiasi 2`, `• Selesai 2`) */}
      <ChipFilter
        items={stageChips}
        selectedId={selectedStageId}
        onSelect={handleSelectStageChip}
      />

      {/* Kanban Columns Board */}
      <Kanban
        value={ticketsByStage}
        onValueChange={setTicketsByStage}
        getItemValue={(item) => item.id_tiket}
        onDragStart={(event) => {
          setActiveDraggedTicketId(event.active.id as string);
        }}
        onDragEnd={() => {
          setActiveDraggedTicketId(null);
        }}
        onDragCancel={() => {
          setActiveDraggedTicketId(null);
        }}
      >
        <KanbanBoard className='no-scrollbar flex w-full min-w-0 items-start gap-3.5 overflow-x-auto pb-4'>
          {stages.map((stage) => {
            const items = filteredTicketsByStage[stage.id_tahap] ?? [];
            const isFocusedStage = selectedStageId === stage.id_tahap;
            const isHoldingInColumn = Boolean(
              activeHoldingStageId === stage.id_tahap,
            );

            return (
              <div
                key={stage.id_tahap}
                ref={(el) => {
                  columnRefs.current[stage.id_tahap] = el;
                }}
                className={cn(
                  'w-[290px] shrink-0 sm:w-[310px]',
                  !canCreateColumn && 'w-full sm:w-[310px]',
                )}
              >
                <KanbanColumn
                  value={stage.id_tahap}
                  className={cn(
                    'flex flex-col gap-3 rounded-2xl border p-3 transition-all',
                    isHoldingInColumn
                      ? 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]/70'
                      : isFocusedStage
                        ? 'border-primary/30 bg-[#EEF2F6]'
                        : 'border-border/60 bg-[#F1F5F9]/80',
                  )}
                >
                  {/* Column Header */}
                  <div className='flex items-center justify-between px-1 pt-0.5'>
                    <h3 className='text-xs font-bold text-foreground'>
                      {stage.nama_tahap} ({items.length})
                    </h3>
                    <button
                      type='button'
                      onClick={() => setSelectedStageId(stage.id_tahap)}
                      className='rounded-lg p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground cursor-pointer'
                      aria-label={`Opsi kolom ${stage.nama_tahap}`}
                    >
                      <MoreHorizontal className='size-4' />
                    </button>
                  </div>

                  {/* Ticket Cards List */}
                  <KanbanColumnContent
                    value={stage.id_tahap}
                    className='flex flex-col gap-2.5'
                  >
                    {items.map((ticket) => {
                      const isItemDragging =
                        ticket.id_tiket === activeDraggedTicketId;

                      return (
                        <KanbanItem
                          key={ticket.id_tiket}
                          value={ticket.id_tiket}
                          className='rounded-2xl'
                        >
                          <KanbanItemHandle className='rounded-2xl'>
                            {isItemDragging ? (
                              <div className='h-[126px] w-full rounded-2xl bg-[#3B82F6] transition-all' />
                            ) : (
                              <KanbanTicketCard
                                ticket={ticket}
                                onClick={() =>
                                  router.push(`${basePath}/${ticket.id_tiket}`)
                                }
                              />
                            )}
                          </KanbanItemHandle>
                        </KanbanItem>
                      );
                    })}
                  </KanbanColumnContent>

                  {/* + Add Card Button (Allowed for both Sales and Manager/Owner) */}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      router.push(
                        `${basePath}/tambah?tahap=${stage.id_tahap}`,
                      )
                    }
                    className='h-9 w-full gap-1.5 rounded-xl border-dashed border-border bg-white text-xs font-semibold text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
                  >
                    <Plus className='size-3.5' />
                    Add Card
                  </Button>
                </KanbanColumn>
              </div>
            );
          })}

          {/* + Tambah List Button */}
          <div className='w-[270px] shrink-0 sm:w-[290px]'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsTambahKolomOpen(true)}
              className='h-11 w-full gap-1.5 rounded-xl border-dashed border-primary/50 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 hover:text-primary cursor-pointer'
            >
              <Plus className='size-3.5' />
              Tambah List
            </Button>
          </div>
        </KanbanBoard>

        {/* Floating Tilted Drag Overlay (matches Image 2) */}
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return null;
            const draggedTicket = Object.values(ticketsByStage)
              .flat()
              .find((t) => t.id_tiket === value);
            if (!draggedTicket) return null;
            return (
              <div className='w-[290px] rotate-[2deg] scale-[1.02] transition-transform sm:w-[310px]'>
                <KanbanTicketCard
                  ticket={draggedTicket}
                  isSelected
                  className='border-2 border-primary/40 bg-white shadow-2xl'
                />
              </div>
            );
          }}
        </KanbanOverlay>
      </Kanban>

      {/* Floating Bottom Quick-Move Pill (`→ Pindah ke Negosiasi`) */}
      {quickMoveTicket && nextStage && (
        <div className='fixed bottom-5 left-1/2 z-30 -translate-x-1/2'>
          <Button
            type='button'
            onClick={handleQuickMove}
            className='h-10 gap-2 rounded-full bg-[#1E293B] px-5 text-xs font-semibold text-white shadow-lg hover:bg-[#0F172A] cursor-pointer'
          >
            <ArrowRight className='size-3.5' />
            Pindah ke {nextStage.nama_tahap}
          </Button>
        </div>
      )}

      {/* Filter Tiket Bottom Sheet Drawer */}
      <KanbanFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={filterState}
        onApply={setFilterState}
      />

      {/* Tambah Kolom Board Baru (Drawer on Mobile, Dialog on Desktop) */}
      <TambahKolomDialog
        open={isTambahKolomOpen}
        onOpenChange={setIsTambahKolomOpen}
      />
    </div>
  );
}
