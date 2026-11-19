'use client';

import * as React from 'react';
import { History } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { useKanbanStore } from '@/store/kanban-store';
import type { TiketWithDetails } from '@/types/ticket.types';
import {
  ProspekDeletedAktivitasItem,
  ProspekRiwayatItem,
} from './prospek-riwayat-item';

type RiwayatEntry =
  | {
      kind: 'stage';
      id: string;
      timestamp: number;
      data: NonNullable<TiketWithDetails['riwayat_list']>[number];
    }
  | {
      kind: 'deleted_activity';
      id: string;
      timestamp: number;
      data: NonNullable<
        ReturnType<typeof useKanbanStore.getState>['deletedActivityLogs'][string]
      >[number];
    };

export function ProspekTabRiwayat({ ticket }: { ticket: TiketWithDetails }) {
  const deletedActivityLogs = useKanbanStore((s) => s.deletedActivityLogs);
  const hydrateDeletedActivityLogs = useKanbanStore((s) => s.hydrateDeletedActivityLogs);

  React.useEffect(() => {
    hydrateDeletedActivityLogs();
  }, [hydrateDeletedActivityLogs]);

  const entries: RiwayatEntry[] = React.useMemo(() => {
    const stageMoves: RiwayatEntry[] = (ticket.riwayat_list ?? []).map((item) => ({
      kind: 'stage',
      id: `stage-${item.id_riwayat}`,
      timestamp: item.waktu_pindah ? new Date(item.waktu_pindah).getTime() : 0,
      data: item,
    }));

    const deletedLogs: RiwayatEntry[] = (
      deletedActivityLogs[ticket.id_tiket] ?? []
    ).map((log) => ({
      kind: 'deleted_activity',
      id: log.id_log,
      timestamp: log.waktu_hapus ? new Date(log.waktu_hapus).getTime() : 0,
      data: log,
    }));

    return [...stageMoves, ...deletedLogs].sort((a, b) => b.timestamp - a.timestamp);
  }, [ticket.riwayat_list, ticket.id_tiket, deletedActivityLogs]);

  return (
    <CardContent className='flex flex-col gap-3 p-4 sm:p-6'>
      {entries.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border/70 bg-muted/20'>
          <History className='size-10 text-muted-foreground/40 mb-2.5' />
          <p className='text-xs sm:text-sm font-semibold text-foreground'>
            Belum Ada Riwayat Perpindahan Tahap
          </p>
          <p className='text-[11px] sm:text-xs text-muted-foreground max-w-sm mt-1'>
            Setiap kali tiket dipindahkan ke tahapan baru, riwayat aktivitas dan nama pengguna yang memindahkan akan tercatat otomatis di sini.
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-2.5'>
          {entries.map((entry) =>
            entry.kind === 'stage' ? (
              <ProspekRiwayatItem key={entry.id} item={entry.data} />
            ) : (
              <ProspekDeletedAktivitasItem key={entry.id} log={entry.data} />
            ),
          )}
        </div>
      )}
    </CardContent>
  );
}
