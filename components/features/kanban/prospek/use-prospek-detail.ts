'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from '@heroui/react';
import {
  INITIAL_KANBAN_STAGES,
  AKTIVITAS_STAGE_CONFIG,
  KanbanStageColumn,
} from '@/constants/kanban-constants';
import { useKanbanStore } from '@/store/kanban-store';
import {
  useKanbanTicketDetailQuery,
  useKanbanStagesQuery,
  useMoveTicketMutation,
  useDeleteTicketMutation,
  useCreateAktivitasMutation,
  useCreateBuktiKunjunganMutation,
  useCreateEvidenceMutation,
} from '@/hooks/queries/use-kanban-query';
import { getErrorMessage } from '@/lib/axios';
import { normalizeRole } from '@/lib/rbac';
import { detectFileType } from '../stage-drawer/types';
import { normalizeAudioFile } from '@/lib/file-validation';
import type { StageActivityDrawerProps } from '../stage-activity-drawer';
import type { DetailTab, NegotiationResult, ProspekDetailViewProps } from './types';

export function useProspekDetail({
  ticketId: propTicketId,
  ticket: propTicket,
  basePath,
}: ProspekDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addActivity, moveTicketToStage, updateTicket } = useKanbanStore();
  const normalizedRole = normalizeRole(session?.user?.role);
  const canDeleteTicket = normalizedRole !== 'director';

  const ticketId = propTicketId || propTicket?.id_tiket || '';

  const {
    data: ticketResponse,
    isLoading: isTicketLoading,
    isError,
    refetch,
  } = useKanbanTicketDetailQuery(ticketId, {
    enabled: Boolean(ticketId),
    initialData: propTicket ? { success: true, data: propTicket } : undefined,
  });

  const { data: stagesResponse } = useKanbanStagesQuery();

  const stages: KanbanStageColumn[] = React.useMemo(() => {
    const raw = stagesResponse?.data;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((s) => s.is_aktif ?? true)
        .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
        .map((s, idx) => ({
          ...s,
          dotColor:
            s.dotColor ||
            AKTIVITAS_STAGE_CONFIG[s.jenis_tahap]?.dotColor ||
            INITIAL_KANBAN_STAGES[idx % INITIAL_KANBAN_STAGES.length]?.dotColor ||
            '#7C5CFC',
        }));
    }
    return INITIAL_KANBAN_STAGES;
  }, [stagesResponse]);

  const ticket = ticketResponse?.data ?? propTicket;

  const moveTicketMutation = useMoveTicketMutation();
  const deleteTicketMutation = useDeleteTicketMutation();
  const createAktivitasMutation = useCreateAktivitasMutation();
  const createBuktiKunjunganMutation = useCreateBuktiKunjunganMutation();
  const createEvidenceMutation = useCreateEvidenceMutation();

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState<DetailTab>('info');
  const [activityDrawerOpen, setActivityDrawerOpen] = React.useState(false);
  const [negotiationDrawerOpen, setNegotiationDrawerOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isSubmittingActivity, setIsSubmittingActivity] = React.useState(false);

  const currentStage = React.useMemo(() => {
    if (!ticket) return stages[0];
    return (
      stages.find((s) => s.id_tahap === ticket.id_tahap) ||
      stages.find((s) => s.jenis_tahap === ticket.id_tahap) ||
      stages[0]
    );
  }, [stages, ticket]);

  const stageLabel = currentStage?.nama_tahap ?? 'Tahap Prospek';

  const handleNegotiationResult = async (result: NegotiationResult) => {
    if (!ticket) return;

    const targetStageType = result === 'negosiasi' ? 'follow_up' : 'revenue';
    const targetStageObj =
      stages.find((s) => s.jenis_tahap === targetStageType) ||
      stages.find((s) => s.id_tahap === targetStageType) ||
      stages[stages.length - 1];

    const newStatus =
      result === 'won' ? 'won' : result === 'lost' ? 'lost' : 'open';

    try {
      await moveTicketMutation.mutateAsync({
        id_tiket: ticket.id_tiket,
        id_tahap: targetStageObj.id_tahap,
        ticketUpdates: {
          status: newStatus,
          tanggal_closing: result !== 'negosiasi' ? new Date().toISOString() : null,
        },
        catatan: `Hasil negosiasi: ${result.toUpperCase()} dicatat oleh Sales.`,
      });

      if (result === 'negosiasi') {
        moveTicketToStage(ticket.id_tiket, targetStageObj.id_tahap);
      } else {
        updateTicket(ticket.id_tiket, {
          status: newStatus,
          id_tahap: targetStageObj.id_tahap,
        });
      }

      toast.success('Hasil Negosiasi Tersimpan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Status prospek berhasil diperbarui menjadi ',
          React.createElement('strong', null, result),
          '.',
        ),
      });
      refetch();
    } catch (err: unknown) {
      toast.danger('Gagal Memperbarui Negosiasi', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
        ),
      });
    } finally {
      setNegotiationDrawerOpen(false);
    }
  };

  const handleConfirmActivity: NonNullable<
    StageActivityDrawerProps['onConfirmMove']
  > = async (params) => {
    if (!ticket) return;
    try {
      setIsSubmittingActivity(true);
      await moveTicketMutation.mutateAsync({
        id_tiket: params.id_tiket,
        id_tahap: params.toStageId,
        ticketUpdates: params.ticketUpdates,
        catatan: params.activity.catatan,
      });

      const userId =
        session?.user?.id_user || params.activity.id_user || 'usr-1';
      const createdRes = await createAktivitasMutation.mutateAsync({
        id_user: userId,
        id_tiket: params.id_tiket,
        tanggal: params.activity.tanggal || new Date().toISOString(),
        catatan:
          params.activity.catatan || `Aktivitas tahap ${params.toStageId}`,
        jenis_kegiatan: params.activity.jenis_kegiatan,
        jadwal_follow_up: params.activity.jadwal_follow_up,
      });

      const newAktivitasId = createdRes.data?.id_aktivitas;

      if (newAktivitasId && params.evidenceFile?.rawFile) {
        const targetStageObj = stages.find(
          (s) => s.id_tahap === params.toStageId,
        );
        if (targetStageObj?.jenis_tahap === 'visit') {
          const normalizedFile = normalizeAudioFile(params.evidenceFile.rawFile);
          const formData = new FormData();
          formData.append('id_aktivitas', newAktivitasId);
          formData.append('img_url', normalizedFile);
          if (params.gpsData) {
            formData.append('latitude', String(params.gpsData.latitude));
            formData.append('longitude', String(params.gpsData.longitude));
            formData.append(
              'jarak_klien',
              String(params.gpsData.jarak_klien),
            );
            formData.append(
              'dalam_radius',
              params.gpsData.dalam_radius ? 'true' : 'false',
            );
          }
          await createBuktiKunjunganMutation.mutateAsync(formData);
        } else {
          const normalizedFile = normalizeAudioFile(params.evidenceFile.rawFile);
          const formData = new FormData();
          formData.append('id_aktivitas', newAktivitasId);
          formData.append('file', normalizedFile);
          formData.append(
            'tipe',
            detectFileType(params.evidenceFile.name),
          );
          formData.append('deskripsi', params.evidenceFile.name);
          if (params.activity.catatan) {
            formData.append('catatan', params.activity.catatan);
          }
          await createEvidenceMutation.mutateAsync(formData);
        }
      }

      addActivity(ticket.id_tiket, params.activity);
      if (params.ticketUpdates && Object.keys(params.ticketUpdates).length > 0) {
        updateTicket(ticket.id_tiket, params.ticketUpdates);
      }

      toast.success('Aktivitas Berhasil Disimpan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Catatan aktivitas dan berkas bukti berhasil diperbarui.',
        ),
      });
      refetch();
      setActivityDrawerOpen(false);
    } catch (err: unknown) {
      toast.danger('Gagal Menyimpan Aktivitas', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          err instanceof Error ? err.message : 'Terjadi kesalahan sistem.',
        ),
      });
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket) return;
    try {
      await deleteTicketMutation.mutateAsync(ticket.id_tiket);
      toast.success('Tiket Prospek Dihapus', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Prospek ',
          React.createElement('strong', null, ticket.judul),
          ' telah dihapus dari sistem.',
        ),
      });
      setIsDeleteOpen(false);
      router.replace(basePath);
    } catch (err) {
      toast.danger('Gagal Menghapus Tiket', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          getErrorMessage(err) || 'Terjadi kesalahan sistem saat menghapus tiket.',
        ),
      });
    }
  };

  return {
    ticket,
    stages,
    currentStage,
    stageLabel,
    activeTab,
    setActiveTab,
    activityDrawerOpen,
    setActivityDrawerOpen,
    negotiationDrawerOpen,
    setNegotiationDrawerOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    canDeleteTicket,
    isDeletingTicket: deleteTicketMutation.isPending,
    isSubmittingActivity,
    isTicketLoading,
    isError,
    refetch,
    handleNegotiationResult,
    handleConfirmActivity,
    handleDeleteTicket,
  };
}

