import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePelangganStore } from '@/lib/pelanggan-store';
import { useKanbanStore } from '@/lib/kanban-store';
import { TiketPrioritas } from '@/types/ticket.types';
import { formatNumberInput } from '@/lib/utils';
import { FilePenawaran, ProspekFormViewProps } from '../types';
import {
  ProspekFormValues,
  buildNewTicket,
  buildTicketUpdates,
} from './build-prospek-ticket';

export function useProspekForm({
  mode,
  basePath,
  initialStageId = 'visit',
  ticket,
}: ProspekFormViewProps) {
  const router = useRouter();
  const { pelangganList } = usePelangganStore();
  const { addTicket, updateTicket } = useKanbanStore();

  const [judul, setJudul] = React.useState(ticket?.judul ?? '');
  const [selectedOutletId, setSelectedOutletId] = React.useState(
    ticket?.id_pelanggan ?? '',
  );
  const [pickedKontakId, setSelectedKontakId] = React.useState(
    ticket?.id_kontak ?? '',
  );
  const [estimasiDisplay, setEstimasiDisplay] = React.useState(
    ticket?.estimasi_nilai ? formatNumberInput(ticket.estimasi_nilai) : '',
  );
  const [targetClosing, setTargetClosing] = React.useState(
    ticket?.closing_full_label
      ? ticket.closing_full_label
      : ticket?.estimasi_closing
        ? String(ticket.estimasi_closing)
        : '',
  );
  const [prioritas, setPrioritas] = React.useState<TiketPrioritas>(
    ticket?.prioritas ?? 'tinggi',
  );
  const [filePenawaran, setFilePenawaran] =
    React.useState<FilePenawaran | null>(
      ticket?.file_penawaran ??
        (mode === 'edit' ? { name: 'penawaran.pdf', size: '731 KB' } : null),
    );
  const [submitted, setSubmitted] = React.useState(false);

  const selectedOutlet = React.useMemo(
    () => pelangganList.find((p) => p.id_pelanggan === selectedOutletId),
    [pelangganList, selectedOutletId],
  );

  const kontakOptions = React.useMemo(
    () => selectedOutlet?.kontak_list ?? [],
    [selectedOutlet],
  );
  // Default ke kontak pertama saat belum ada yang dipilih
  const selectedKontakId = pickedKontakId || (kontakOptions[0]?.id_kontak ?? '');

  const errors = {
    judul: submitted && !judul.trim() ? 'Judul tiket wajib diisi' : '',
    outlet:
      submitted && !selectedOutletId ? 'Pilih pelanggan terlebih dahulu' : '',
  };

  const errorCount = (errors.judul ? 1 : 0) + (errors.outlet ? 1 : 0);

  const backPath =
    mode === 'edit' && ticket ? `${basePath}/${ticket.id_tiket}` : basePath;

  const selectOutlet = (id: string) => {
    setSelectedOutletId(id);
    setSelectedKontakId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!judul.trim() || !selectedOutletId) {
      return;
    }

    const values: ProspekFormValues = {
      judul,
      outletId: selectedOutletId,
      estimasiDisplay,
      targetClosing,
      prioritas,
      filePenawaran,
    };
    const kontak = kontakOptions.find((k) => k.id_kontak === selectedKontakId);

    if (mode === 'edit' && ticket) {
      updateTicket(
        ticket.id_tiket,
        buildTicketUpdates({ values, outlet: selectedOutlet, kontak, ticket }),
      );
      router.push(backPath);
      return;
    }

    addTicket(
      buildNewTicket({
        values,
        outlet: selectedOutlet,
        kontak,
        stageId: initialStageId,
      }),
    );
    router.push(basePath);
  };

  return {
    pelangganList,
    kontakOptions,
    errors,
    errorCount,
    backPath,
    judul,
    setJudul,
    selectedOutletId,
    selectOutlet,
    selectedKontakId,
    setSelectedKontakId,
    estimasiDisplay,
    setEstimasiDisplay,
    targetClosing,
    setTargetClosing,
    prioritas,
    setPrioritas,
    filePenawaran,
    setFilePenawaran,
    handleSubmit,
  };
}
