import * as React from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@heroui/react';
import { useKanbanStore } from '@/store/kanban-store';
import {
  useMoveTicketMutation,
  useCreateTicketMutation,
  useCreateAktivitasMutation,
  useCreateBuktiKunjunganMutation,
  useCreateEvidenceMutation,
} from '@/hooks/queries/use-kanban-query';
import { normalizeAudioFile } from '@/lib/file-validation';
import { getErrorMessage } from '@/lib/axios';
import { detectFileType } from '../stage-drawer/types';
import type { KanbanStageColumn } from '@/constants/kanban-constants';
import type { CreateTiketInput, TiketWithDetails } from '@/types/ticket.types';
import type { StageDrawerMode, StageActivityDrawerProps } from '../stage-activity-drawer';
import type { PendingStageMove } from './use-kanban-dnd';

export interface UseKanbanTicketMoveProps {
  stages: KanbanStageColumn[];
  activeSelectedStageId: string;
  quickMoveTicket?: TiketWithDetails;
  nextStage: KanbanStageColumn | null;
  setSelectedStageId: (stageId: string) => void;
  scrollToStage: (stageId: string) => void;
}

export function useKanbanTicketMove({
  stages,
  activeSelectedStageId,
  quickMoveTicket,
  nextStage,
  setSelectedStageId,
  scrollToStage,
}: UseKanbanTicketMoveProps) {
  const { data: session } = useSession();
  const { moveTicketWithStageUpdate } = useKanbanStore();

  const moveTicketMutation = useMoveTicketMutation();
  const createTicketMutation = useCreateTicketMutation();
  const createAktivitasMutation = useCreateAktivitasMutation();
  const createBuktiKunjunganMutation = useCreateBuktiKunjunganMutation();
  const createEvidenceMutation = useCreateEvidenceMutation();

  const [drawerMode, setDrawerMode] = React.useState<StageDrawerMode>('move');
  const [targetStageForAction, setTargetStageForAction] =
    React.useState<KanbanStageColumn | null>(null);
  const [pendingStageMove, setPendingStageMove] =
    React.useState<PendingStageMove | null>(null);
  const [isStageDrawerOpen, setIsStageDrawerOpen] = React.useState(false);

  const [isSubmittingMove, setIsSubmittingMove] = React.useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = React.useState(false);
  const isSubmitting = isSubmittingMove || isCreatingTicket;

  const startMove = (pending: PendingStageMove) => {
    setDrawerMode('move');
    setTargetStageForAction(pending.targetStage);
    setPendingStageMove(pending);
    setIsStageDrawerOpen(true);
  };

  const handleQuickMove = () => {
    if (!quickMoveTicket || !nextStage) return;
    const currentStageObj =
      stages.find((s) => s.id_tahap === activeSelectedStageId) ??
      stages.find((s) => s.id_tahap === quickMoveTicket.id_tahap) ??
      stages[0];

    startMove({
      ticket: quickMoveTicket,
      fromStage: currentStageObj,
      targetStage: nextStage,
      targetIndex: 0,
    });
  };

  const handleOpenAddCardDrawer = (stage: KanbanStageColumn) => {
    setDrawerMode('create');
    setTargetStageForAction(stage);
    setPendingStageMove(null);
    setIsStageDrawerOpen(true);
  };

  const handleConfirmStageMove: NonNullable<
    StageActivityDrawerProps['onConfirmMove']
  > = async (params) => {
    setIsSubmittingMove(true);

    const isDocumentActivity =
      params.activity?.jenis_kegiatan === 'quotation' ||
      params.activity?.jenis_kegiatan === 'po' ||
      params.activity?.jenis_kegiatan === 'revenue';
    const moveTicketUpdates =
      isDocumentActivity && params.ticketUpdates
        ? (() => {
            const rest = { ...params.ticketUpdates };
            delete rest.estimasi_nilai;
            return rest;
          })()
        : params.ticketUpdates;

    moveTicketWithStageUpdate({
      ...params,
      ticketUpdates: moveTicketUpdates,
    });

    try {
      await moveTicketMutation.mutateAsync({
        id_tiket: params.id_tiket,
        id_tahap: params.toStageId,
        fromStageId: params.fromStageId,
        toStageId: params.toStageId,
        targetIndex: params.targetIndex,
        ticketUpdates: moveTicketUpdates,
        catatan: params.activity?.catatan,
        tanggal_dokumen: params.activity?.tanggal || undefined,
        nilai_dokumen: isDocumentActivity
          ? params.ticketUpdates?.estimasi_nilai
          : undefined,
        posisi:
          typeof params.targetIndex === 'number'
            ? params.targetIndex + 1
            : undefined,
      });

      const userId =
        session?.user?.id_user || params.activity.id_user || 'usr-1';
      const createdAktivitasRes = await createAktivitasMutation.mutateAsync({
        id_user: userId,
        id_tiket: params.id_tiket,
        tanggal: params.activity.tanggal || new Date().toISOString(),
        catatan:
          params.activity.catatan || `Aktivitas tahap ${params.toStageId}`,
        jenis_kegiatan: params.activity.jenis_kegiatan,
        jadwal_follow_up: params.activity.jadwal_follow_up,
        ...(params.activity.jenis_kegiatan === 'quotation' &&
        params.ticketUpdates?.estimasi_nilai !== undefined
          ? { total_nilai: params.ticketUpdates.estimasi_nilai }
          : {}),
      });

      const newAktivitasId = createdAktivitasRes?.data?.id_aktivitas;

      if (newAktivitasId && params.evidenceFile?.rawFile) {
        const targetStageObj = stages.find(
          (s) => s.id_tahap === params.toStageId,
        );
        const stageType = targetStageObj?.jenis_tahap;

        if (stageType === 'visit') {
          const normalizedFile = normalizeAudioFile(params.evidenceFile.rawFile);
          const formData = new FormData();
          formData.append('id_aktivitas', newAktivitasId);
          formData.append('img_url', normalizedFile);
          if (params.gpsData) {
            formData.append('latitude', String(params.gpsData.latitude));
            formData.append('longitude', String(params.gpsData.longitude));
            formData.append('jarak_klien', String(params.gpsData.jarak_klien));
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
          formData.append('tipe', detectFileType(params.evidenceFile.name));
          formData.append('deskripsi', params.evidenceFile.name);
          if (params.activity.catatan) {
            formData.append('catatan', params.activity.catatan);
          }
          await createEvidenceMutation.mutateAsync(formData);
        }
      }

      const targetStageName =
        stages.find((s) => s.id_tahap === params.toStageId)?.nama_tahap ||
        'tahap baru';

      toast.success(`Tiket berhasil dipindahkan ke tahap ${targetStageName}`, {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Tiket berhasil dipindahkan dan berkas bukti tercatat.',
        ),
      });

      setSelectedStageId(params.toStageId);
      scrollToStage(params.toStageId);
      setIsStageDrawerOpen(false);
      setPendingStageMove(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.danger('Gagal Memproses Perpindahan', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          message,
        ),
      });
    } finally {
      setIsSubmittingMove(false);
    }
  };

  const handleConfirmCreateTicket: NonNullable<
    StageActivityDrawerProps['onCreateTicket']
  > = async (params) => {
    setIsCreatingTicket(true);
    try {
      const userId = session?.user?.id_user || 'usr-1';
      const createPayload: CreateTiketInput = {
        ...params.createPayload,
        id_user: userId,
        ...(params.activityPayload?.tanggal
          ? { tanggal_dokumen: params.activityPayload.tanggal }
          : {}),
      };

      const res = await createTicketMutation.mutateAsync(createPayload);
      const createdTicket = res?.data;
      const createdTicketId = createdTicket?.id_tiket;

      if (createdTicketId && params.activityPayload) {
        try {
          const createdAktivitasRes = await createAktivitasMutation.mutateAsync({
            id_user: userId,
            id_tiket: createdTicketId,
            tanggal: params.activityPayload.tanggal || new Date().toISOString(),
            catatan: params.activityPayload.catatan,
            jenis_kegiatan: params.activityPayload.jenis_kegiatan,
            jadwal_follow_up: params.activityPayload.jadwal_follow_up,
            ...(params.activityPayload.jenis_kegiatan === 'quotation'
              ? { total_nilai: createPayload.estimasi_nilai }
              : {}),
          });

          const newAktivitasId = createdAktivitasRes?.data?.id_aktivitas;

          if (newAktivitasId && params.evidenceFile?.rawFile) {
            const targetStageObj = stages.find(
              (s) => s.id_tahap === params.createPayload.id_tahap,
            );
            const stageType = targetStageObj?.jenis_tahap;

            if (stageType === 'visit') {
              const normalizedFile = normalizeAudioFile(params.evidenceFile.rawFile);
              const formData = new FormData();
              formData.append('id_aktivitas', newAktivitasId);
              formData.append('img_url', normalizedFile);
              if (params.gpsData) {
                formData.append('latitude', String(params.gpsData.latitude));
                formData.append('longitude', String(params.gpsData.longitude));
                formData.append('jarak_klien', String(params.gpsData.jarak_klien));
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
              formData.append('tipe', detectFileType(params.evidenceFile.name));
              formData.append('deskripsi', params.evidenceFile.name);
              if (params.activityPayload.catatan) {
                formData.append('catatan', params.activityPayload.catatan);
              }
              await createEvidenceMutation.mutateAsync(formData);
            }
          }
        } catch (chainErr) {
          toast.warning('Prospek Dibuat, Aktivitas Gagal Disimpan', {
            description: React.createElement(
              'span',
              { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
              getErrorMessage(chainErr),
            ),
          });
        }
      }

      toast.success('Tiket prospek berhasil dibuat', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          'Prospek ',
          React.createElement('strong', null, createPayload.judul),
          ' berhasil ditambahkan.',
        ),
      });

      const targetStageId = params.createPayload.id_tahap || 'visit';
      setSelectedStageId(targetStageId);
      scrollToStage(targetStageId);
      setIsStageDrawerOpen(false);
      setPendingStageMove(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.danger('Gagal Membuat Prospek', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          message,
        ),
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleCancelMove = () => {
    setPendingStageMove(null);
    setTargetStageForAction(null);
  };

  return {
    drawerMode,
    targetStageForAction,
    pendingStageMove,
    isStageDrawerOpen,
    setIsStageDrawerOpen,
    isMovingTicket: moveTicketMutation.isPending,
    isCreatingTicket,
    isSubmittingMove,
    isSubmitting,
    startMove,
    handleQuickMove,
    handleOpenAddCardDrawer,
    handleConfirmStageMove,
    handleConfirmCreateTicket,
    handleCancelMove,
  };
}

