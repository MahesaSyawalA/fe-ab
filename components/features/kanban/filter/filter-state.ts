export interface KanbanFilterState {
  stages: string[];
  priorities: string[];
  closingFrom: string;
  closingTo: string;
  minEstimate: string;
  maxEstimate: string;
  salesId: string;
}

export const INITIAL_KANBAN_FILTER: KanbanFilterState = {
  stages: [],
  priorities: [],
  closingFrom: '',
  closingTo: '',
  minEstimate: '',
  maxEstimate: '',
  salesId: '',
};

export function countActiveFilters(filter: KanbanFilterState): number {
  const { stages, priorities, ...scalars } = filter;
  return (
    stages.length + priorities.length + Object.values(scalars).filter(Boolean).length
  );
}
