import { ChipFilter } from '@/components/ui/chip-filter';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { SQUAD_STATUS_OPTIONS } from '@/constants/squad-constants';

interface SquadFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

export function SquadFilterModal({ open, onOpenChange, status, onStatusChange }: SquadFilterModalProps) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title='Filter Squad'>
      <div className='flex flex-col gap-2'>
        <span className='text-xs font-semibold text-foreground'>Status</span>
        <ChipFilter
          items={SQUAD_STATUS_OPTIONS}
          selectedId={status}
          onSelect={(id) => {
            onStatusChange(id);
            onOpenChange(false);
          }}
        />
      </div>
    </ResponsiveModal>
  );
}
