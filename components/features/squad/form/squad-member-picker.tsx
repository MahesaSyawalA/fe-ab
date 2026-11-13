import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { cn } from '@/lib/utils';
import type { SquadMember } from '@/types/squad.types';

interface SquadMemberPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: SquadMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function SquadMemberPicker({
  open,
  onOpenChange,
  candidates,
  selectedIds,
  onToggle,
}: SquadMemberPickerProps) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title='Tambahkan Member'
      description='Ketuk sales untuk memilih, ketuk lagi untuk membatalkan.'
    >
      <div className='flex flex-col gap-3'>
        <ul className='flex max-h-72 flex-col gap-1.5 overflow-y-auto'>
          {candidates.length === 0 && (
            <li className='py-6 text-center text-xs text-muted-foreground'>Belum ada sales tersedia.</li>
          )}
          {candidates.map((user) => {
            const selected = selectedIds.includes(user.id_user);

            return (
              <li key={user.id_user}>
                <button
                  type='button'
                  aria-pressed={selected}
                  onClick={() => onToggle(user.id_user)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-muted/60',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                      selected
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground/40 bg-transparent',
                    )}
                  >
                    {selected && <Check className='size-3.5 stroke-3' />}
                  </span>
                  <span className='flex min-w-0 flex-1 flex-col'>
                    <span className='truncate text-xs font-semibold text-foreground'>{user.nama}</span>
                    <span className='truncate text-[11px] text-secondary-foreground'>{user.email}</span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-[11px] font-semibold',
                      selected ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {selected ? 'Terpilih' : 'Pilih'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Button
          type='button'
          onClick={() => onOpenChange(false)}
          className='h-10 w-full rounded-md bg-primary-default text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer'
        >
          Selesai ({selectedIds.length} dipilih)
        </Button>
      </div>
    </ResponsiveModal>
  );
}
