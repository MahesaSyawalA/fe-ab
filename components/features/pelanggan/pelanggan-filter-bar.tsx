import { ChipFilterItem } from '@/components/ui/chip-filter';
import { SearchFilterBar } from '@/components/ui/search-filter-bar';

interface PelangganFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filterChips: ChipFilterItem[];
  onOpenFilterModal?: () => void;
}

export function PelangganFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  filterChips,
  onOpenFilterModal,
}: PelangganFilterBarProps) {
  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      filterChips={filterChips}
      onOpenFilterModal={onOpenFilterModal}
    />
  );
}
