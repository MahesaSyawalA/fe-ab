import { KanbanBoardView } from '@/components/features/kanban/kanban-board-view';

export default function AdminKanbanPage() {
  return <KanbanBoardView role='admin' basePath='/admin/kanban' />;
}
