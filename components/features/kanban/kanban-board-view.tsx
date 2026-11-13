'use client';

import { useRouter } from 'next/navigation';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Kanban, KanbanBoard } from '@/components/reui/kanban';
import { Button } from '@/components/ui/button';
import { SearchFilterBar } from '@/components/ui/search-filter-bar';
import { ChipFilter } from '@/components/ui/chip-filter';
import { KanbanFilterDrawer } from './filter';
import { TambahKolomDialog } from './tambah-kolom';
import { StageActivityDrawer } from './stage-activity-drawer';
import {
  KanbanBoardColumn,
  KanbanDragOverlay,
  KanbanPipelineCard,
  KanbanQuickMovePill,
  useKanbanBoard,
} from './board';

export type KanbanUserRole = 'sales' | 'manager' | 'director';

interface KanbanBoardViewProps {
  role: KanbanUserRole;
  basePath: string;
}

export function KanbanBoardView({ role, basePath }: KanbanBoardViewProps) {
  const router = useRouter();
  const board = useKanbanBoard();
  const { pendingStageMove, drawerMode, targetStageForAction } = board;

  const canCreateColumn = role === 'manager' || role === 'director';

  return (
    <div className='relative flex w-full max-w-full min-w-0 flex-col gap-3.5 pb-20'>

      <div className='flex flex-col gap-0.5 sm:gap-1 w-full max-w-full'>
        <h1 className='text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug'>
          Papan Kanban
        </h1>
        <p className='text-xs sm:text-sm text-secondary-foreground leading-snug'>
          Pipeline 7 Tahap Aktivitas Penjualan · Squad Jakarta 1
        </p>
      </div>

      {board.isError && (
        <div className='flex items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive'>
          <div className='flex items-center gap-2'>
            <AlertCircle className='size-4 shrink-0' />
            <span>Gagal memuat data Kanban board dari server.</span>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => board.refetch()}
            className='h-7 gap-1.5 rounded-lg border-destructive/30 bg-destructive/10 text-xs text-destructive hover:bg-destructive/20 cursor-pointer'
          >
            <RefreshCw className='size-3' />
            Coba Lagi
          </Button>
        </div>
      )}

      <div className='w-full max-w-full min-w-0'>
        <SearchFilterBar
          searchQuery={board.searchQuery}
          onSearchChange={board.setSearchQuery}
          onOpenFilterModal={() => board.setFilterOpen(true)}
          activeFilterCount={board.activeFilterCount}
        />
      </div>

      <div className='w-full max-w-full min-w-0'>
        <KanbanPipelineCard
          totalPipelineLabel={board.totalPipelineLabel}
          activeTicketsCount={board.activeTicketsCount}
          targetPercentage={board.targetPercentage}
          showTeamContributions={canCreateColumn}
          teamContributions={board.teamContributions}
          isLoading={board.isLoading}
        />
      </div>

      <div className='w-full max-w-full min-w-0 overflow-hidden'>
        <ChipFilter
          items={board.stageChips}
          selectedId={board.selectedStageId}
          onSelect={board.handleSelectStageChip}
        />
      </div>

      <div className='w-full max-w-full min-w-0'>
        <Kanban
          id='kanban-board-dnd'
          className='w-full max-w-full min-w-0'
          value={board.ticketsByStage}
          onValueChange={board.setTicketsByStage}
          getItemValue={(item) => item.id_tiket}
          onDragStart={board.handleDragStart}
          onDragEnd={board.handleDragEnd}
          onDragCancel={board.handleDragCancel}
          onMove={board.handleMove}
        >
          <KanbanBoard className='no-scrollbar flex w-full min-w-0 items-start gap-3.5 overflow-x-auto pb-4'>
            {board.stages.map((stage) => (
              <KanbanBoardColumn
                key={stage.id_tahap}
                stage={stage}
                items={board.filteredTicketsByStage[stage.id_tahap] ?? []}
                isLoading={board.isLoading}
                isFocused={board.selectedStageId === stage.id_tahap}
                isHolding={board.activeHoldingStageId === stage.id_tahap}
                activeDraggedTicketId={board.activeDraggedTicketId}
                columnRef={(el) => {
                  board.columnRefs.current[stage.id_tahap] = el;
                }}
                onTicketClick={(ticket) =>
                  router.push(`${basePath}/${ticket.id_tiket}`)
                }
                onAddCard={() => board.handleOpenAddCardDrawer(stage)}
                onOpenOptions={() => board.setSelectedStageId(stage.id_tahap)}
              />
            ))}

            {canCreateColumn && (
              <div className='w-[270px] shrink-0 sm:w-[290px]'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => board.setIsTambahKolomOpen(true)}
                  className='h-11 w-full gap-1.5 rounded-xl border-dashed border-primary/50 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 hover:text-primary cursor-pointer'
                >
                  <Plus className='size-3.5' />
                  Tambah List
                </Button>
              </div>
            )}
          </KanbanBoard>

          <KanbanDragOverlay ticketsByStage={board.ticketsByStage} />
        </Kanban>
      </div>

      {board.quickMoveTicket && board.nextStage && (
        <KanbanQuickMovePill
          nextStageName={board.nextStage.nama_tahap}
          onClick={board.handleQuickMove}
        />
      )}

      <StageActivityDrawer
        open={board.isStageDrawerOpen}
        onOpenChange={board.setIsStageDrawerOpen}
        mode={drawerMode}
        ticket={pendingStageMove?.ticket ?? null}
        fromStage={pendingStageMove?.fromStage ?? null}
        targetStage={
          drawerMode === 'create'
            ? targetStageForAction
            : pendingStageMove?.targetStage ?? targetStageForAction
        }
        targetIndex={pendingStageMove?.targetIndex}
        isSubmitting={board.isSubmitting}
        onConfirmMove={board.handleConfirmStageMove}
        onCreateTicket={board.handleConfirmCreateTicket}
        onCancelMove={board.handleCancelMove}
      />

      <KanbanFilterDrawer
        open={board.filterOpen}
        onOpenChange={board.setFilterOpen}
        value={board.filterState}
        onApply={board.setFilterState}
      />

      {canCreateColumn && (
        <TambahKolomDialog
          open={board.isTambahKolomOpen}
          onOpenChange={board.setIsTambahKolomOpen}
        />
      )}
    </div>
  );
}
