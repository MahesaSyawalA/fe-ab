import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PillGroupProps {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function PillGroup({ label, options, selected, onToggle }: PillGroupProps) {
  return (
    <div className='flex flex-col gap-2'>
      <Label className='text-xs sm:text-sm font-medium text-foreground'>{label}</Label>
      <div className='flex flex-wrap gap-2'>
        {options.map((option) => (
          <Button
            key={option.id}
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onToggle(option.id)}
            className={cn(
              'h-8 rounded-full px-3.5 text-xs font-medium shadow-none transition-all cursor-pointer',
              selected.includes(option.id)
                ? 'border-[#F97316] bg-[#FFF7ED] font-semibold text-[#EA580C] hover:bg-[#FFEDD5] hover:text-[#EA580C]'
                : 'border-border bg-card text-foreground hover:bg-muted/40',
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
