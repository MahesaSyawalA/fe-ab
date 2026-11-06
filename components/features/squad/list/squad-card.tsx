import { CalendarDays, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SQUAD_AVATAR_COLORS, SQUAD_AVATAR_MAX_VISIBLE } from '@/constants/squad-constants';
import { getUserInitials } from '@/lib/auth-helpers';
import { cn, formatShortDate } from '@/lib/utils';
import type { SquadWithDetails } from '@/types/squad.types';

interface SquadCardProps {
  squad: SquadWithDetails;
  onEdit: () => void;
  className?: string;
}

export function SquadCard({ squad, onEdit, className }: SquadCardProps) {
  const visible = squad.members.slice(0, SQUAD_AVATAR_MAX_VISIBLE);
  const hidden = squad.member_count - visible.length;

  return (
    <Card size='sm' className={cn('rounded-2xl border border-border ring-0 shadow-2xs', className)}>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <h3 className='truncate text-sm font-bold text-foreground'>{squad.nama_squad}</h3>
            <p className='text-[11px] text-secondary-foreground'>{squad.member_count} member</p>
          </div>

          <AvatarGroup>
            {visible.map((member, index) => (
              <Avatar key={member.id_user} size='sm' className='size-7'>
                <AvatarFallback
                  className={cn(
                    'text-[10px] font-semibold text-white',
                    SQUAD_AVATAR_COLORS[index % SQUAD_AVATAR_COLORS.length],
                  )}
                >
                  {getUserInitials(member.nama)}
                </AvatarFallback>
              </Avatar>
            ))}
            {hidden > 0 && (
              <AvatarGroupCount className='size-7 text-[10px]'>+{hidden}</AvatarGroupCount>
            )}
          </AvatarGroup>
        </div>

        <ProgressBar label='Finished' value={squad.progress_persen} />

        <div className='flex items-center justify-between gap-2'>
          <span className='flex items-center gap-1.5 text-[11px] text-secondary-foreground'>
            <CalendarDays className='size-3.5' />
            Created {formatShortDate(squad.created_at)}
          </span>
          <Button
            type='button'
            size='xs'
            onClick={onEdit}
            className='h-7 gap-1 rounded-md bg-kanban-orange px-3 text-[11px] font-semibold text-white hover:bg-kanban-orange/90 cursor-pointer'
          >
            <Pencil className='size-3' />
            Edit Squad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
