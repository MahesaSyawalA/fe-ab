'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
import { TEAM_CONTRIBUTIONS } from '@/constants/kanban-constants';

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
      {/* Page Title */}
      <div className='flex flex-col gap-0.5 w-full max-w-full'>
        <h1 className='text-lg font-bold tracking-tight text-foreground'>
          Papan Kanban
        </h1>
        <p className='text-xs text-muted-foreground'>
          Pipeline 7 Tahap Aktivitas Penjualan · Squad Jakarta 1
        </p>
      </div>

      {/* Search Bar + Filter Button */}
      <div className='w-full max-w-full min-w-0'>
        <SearchFilterBar
          searchQuery={board.searchQuery}
          onSearchChange={board.setSearchQuery}
          onOpenFilterModal={() => board.setFilterOpen(true)}
          activeFilterCount={board.activeFilterCount}
        />
      </div>

      {/* Blue Pipeline Summary Card */}
      <div className='w-full max-w-full min-w-0'>
        <KanbanPipelineCard
          totalPipelineLabel={board.totalPipelineLabel}
          activeTicketsCount={board.activeTicketsCount}
          targetPercentage={68}
          showTeamContributions={canCreateColumn}
          teamContributions={TEAM_CONTRIBUTIONS}
        />
      </div>

      {/* Stage Filter Chips (7 Tahapan: Visit, Kebutuhan, Opportunity, Follow Up, Quotation, PO, Revenue) */}
      <div className='w-full max-w-full min-w-0 overflow-hidden'>
        <ChipFilter
          items={board.stageChips}
          selectedId={board.selectedStageId}
          onSelect={board.handleSelectStageChip}
        />
      </div>

      {/* Kanban Columns Board with drag-and-drop & automatic Bottom Drawer */}
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

            {/* + Tambah List: hanya Manager Sales & Director/Owner */}
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

      {/* Smooth Shadcn UI Bottom Drawer Form (for Move & Add Card) */}
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
        onConfirmMove={board.handleConfirmStageMove}
        onCreateTicket={board.handleConfirmCreateTicket}
        onCancelMove={board.handleCancelMove}
      />

      {/* Filter Tiket Bottom Sheet Drawer */}
      <KanbanFilterDrawer
        open={board.filterOpen}
        onOpenChange={board.setFilterOpen}
        value={board.filterState}
        onApply={board.setFilterState}
      />

      {/* Tambah Kolom Board Baru: hanya Manager Sales & Director/Owner */}
      {canCreateColumn && (
        <TambahKolomDialog
          open={board.isTambahKolomOpen}
          onOpenChange={board.setIsTambahKolomOpen}
        />
      )}
    </div>
  );
}
