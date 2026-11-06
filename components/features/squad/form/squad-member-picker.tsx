import { Checkbox } from '@/components/ui/checkbox';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import type { SquadMember } from '@/types/squad.types';

interface SquadMemberPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: SquadMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

/** Modal pilih anggota squad dari daftar kandidat (centang untuk menambah/mengeluarkan). */
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
      description='Pilih sales yang akan masuk ke squad ini.'
    >
      <ul className='flex max-h-72 flex-col gap-1 overflow-y-auto'>
        {candidates.length === 0 && (
          <li className='py-6 text-center text-xs text-muted-foreground'>Belum ada sales tersedia.</li>
        )}
        {candidates.map((user) => (
          <li key={user.id_user}>
            <label className='flex cursor-pointer items-center gap-3 rounded-xl p-2.5 hover:bg-muted/60'>
              <Checkbox
                checked={selectedIds.includes(user.id_user)}
                onCheckedChange={() => onToggle(user.id_user)}
              />
              <span className='flex min-w-0 flex-col'>
                <span className='truncate text-xs font-semibold text-foreground'>{user.nama}</span>
                <span className='truncate text-[11px] text-secondary-foreground'>{user.email}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </ResponsiveModal>
  );
}
