import { Trash2, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatRoleLabel } from '@/lib/auth-helpers';
import type { SquadMember } from '@/types/squad.types';

interface SquadMemberCardProps {
  member: SquadMember;
  onRemove?: () => void;
}

/** Kartu anggota di form squad: identitas, kontak, role, dan tombol hapus dari squad. */
export function SquadMemberCard({ member, onRemove }: SquadMemberCardProps) {
  return (
    <div className='flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/5 p-3'>
      <Avatar className='after:border-0'>
        <AvatarFallback className='bg-blue-100/80 text-slate-800'>
          <UserRound className='size-4' />
        </AvatarFallback>
      </Avatar>

      <div className='flex min-w-0 flex-1 flex-col text-[11px] text-secondary-foreground'>
        <div className='flex items-center justify-between gap-2'>
          <span className='truncate text-xs font-bold text-foreground'>{member.nama}</span>
          <span className='shrink-0'>{formatRoleLabel(member.role)}</span>
        </div>
        <span>{member.no_telp}</span>
        <span className='truncate'>{member.email}</span>
      </div>

      {onRemove && (
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          onClick={onRemove}
          title='Keluarkan dari squad'
          className='text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer'
        >
          <Trash2 className='size-4' />
        </Button>
      )}
    </div>
  );
}
