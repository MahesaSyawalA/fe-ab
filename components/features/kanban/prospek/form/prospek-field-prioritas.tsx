import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { PRIORITY_CONFIG, PRIORITY_ORDER } from '@/constants/kanban-constants';
import { TiketPrioritas } from '@/types/ticket.types';
import { cn } from '@/lib/utils';

interface ProspekFieldPrioritasProps {
  value: TiketPrioritas;
  onChange: (value: TiketPrioritas) => void;
}

export function ProspekFieldPrioritas({
  value,
  onChange,
}: ProspekFieldPrioritasProps) {
  return (
    <FormField label='Tingkat Prioritas Prospek' required>
      <div className='grid grid-cols-3 gap-2.5'>
        {PRIORITY_ORDER.map((id) => {
          const option = PRIORITY_CONFIG[id];
          return (
            <Button
              key={id}
              type='button'
              variant='outline'
              onClick={() => onChange(id)}
              className={cn(
                'h-10 gap-2 rounded-xl text-xs shadow-none transition-all cursor-pointer',
                value === id
                  ? option.activeClass
                  : 'border-border bg-card font-medium text-foreground hover:bg-muted/40',
              )}
            >
              <span className={cn('size-2 rounded-full', option.dotClass)} />
              {option.formLabel}
            </Button>
          );
        })}
      </div>
    </FormField>
  );
}
