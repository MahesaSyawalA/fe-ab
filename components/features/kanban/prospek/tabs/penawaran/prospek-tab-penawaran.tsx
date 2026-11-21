'use client';

import * as React from 'react';
import {
  Calendar,
  Check,
  Pencil,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { toast } from '@heroui/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentPreviewCard } from '@/components/ui/document-preview-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterDatePicker } from '@/components/features/kanban/filter/inputs/filter-date-picker';
import { FilterSelectInput } from '@/components/features/kanban/filter/inputs/filter-select-input';
import {
  PenawaranStatusBadge,
  PenawaranValidityBadge,
} from '@/components/ui/penawaran-badges';
import { useUpdatePenawaranMutation } from '@/hooks/queries/use-kanban-query';
import { getErrorMessage } from '@/lib/axios';
import {
  PENAWARAN_STATUS_CONFIG,
  PENAWARAN_STATUS_OPTIONS,
  getPenawaranValidity,
  isPenawaranActiveForValidity,
} from '@/lib/penawaran-utils';
import { formatFullRupiah, formatShortDate } from '@/lib/utils';
import type { Penawaran, StatusPenawaran } from '@/types/offer.types';
import type { TiketWithDetails } from '@/types/ticket.types';

interface ProspekTabPenawaranProps {
  ticket: TiketWithDetails;
  canEdit?: boolean;
  isQuotationStage?: boolean;
  onAddQuotation?: () => void;
}

function toDateInputValue(val: Date | string): string {
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ProspekTabPenawaran({
  ticket,
  canEdit = false,
  isQuotationStage = false,
  onAddQuotation,
}: ProspekTabPenawaranProps) {
  const penawaranList = ticket.penawaran_list ?? [];
  const updatePenawaranMutation = useUpdatePenawaranMutation(ticket.id_tiket);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [editingDateId, setEditingDateId] = React.useState<string | null>(null);
  const [draftDate, setDraftDate] = React.useState('');

  const handleStatusChange = async (
    item: Penawaran,
    nextStatus: StatusPenawaran,
  ) => {
    if (item.status === nextStatus) return;
    setUpdatingId(item.id_penawaran);
    try {
      await updatePenawaranMutation.mutateAsync({
        id: item.id_penawaran,
        payload: { status: nextStatus },
      });
      toast.success('Status Penawaran Diperbarui', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Penawaran <strong>{item.no_penawaran}</strong> diubah menjadi{' '}
            <strong>{PENAWARAN_STATUS_CONFIG[nextStatus].label}</strong>.
          </span>
        ),
      });
    } catch (err) {
      toast.danger('Gagal Memperbarui Status Penawaran', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {getErrorMessage(err) || 'Terjadi kesalahan saat menyimpan status.'}
          </span>
        ),
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveDate = async (item: Penawaran) => {
    if (!draftDate) return;
    setUpdatingId(item.id_penawaran);
    try {
      await updatePenawaranMutation.mutateAsync({
        id: item.id_penawaran,
        payload: { tanggal_penawaran: draftDate },
      });
      toast.success('Tanggal Penawaran Diperbarui', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            Tanggal penawaran <strong>{item.no_penawaran}</strong> berhasil diperbarui.
          </span>
        ),
      });
      setEditingDateId(null);
    } catch (err) {
      toast.danger('Gagal Memperbarui Tanggal', {
        description: (
          <span className='text-xs sm:text-sm text-secondary-foreground leading-relaxed'>
            {getErrorMessage(err) || 'Terjadi kesalahan saat menyimpan tanggal.'}
          </span>
        ),
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className='flex flex-col gap-3.5 p-3.5 sm:p-5'>
      {penawaranList.length === 0 ? (
        <div className='flex flex-col gap-3'>
          <EmptyState
            title='Belum Ada Penawaran'
            description='Pindahkan prospek ke tahap Quotation atau tambahkan aktivitas penawaran untuk menerbitkan surat penawaran.'
          />
          {canEdit && isQuotationStage && onAddQuotation && (
            <Button
              type='button'
              variant='outline'
              onClick={onAddQuotation}
              className='h-10 w-full gap-1.5 rounded-md border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
            >
              <Plus className='size-3.5' />
              Buat Penawaran Pertama
            </Button>
          )}
        </div>
      ) : (
        <>
          {penawaranList.map((item) => {
            const validity = getPenawaranValidity(item.tanggal_penawaran);
            const showValidity = isPenawaranActiveForValidity(item.status);
            const isBusy = updatingId === item.id_penawaran;
            const isEditingDate = editingDateId === item.id_penawaran;

            return (
              <Card
                key={item.id_penawaran}
                className='rounded-xl border border-border/70 bg-card py-0 shadow-2xs'
              >
                <CardContent className='flex flex-col gap-3 p-4 sm:p-5'>
                  <div className='flex flex-wrap items-start justify-between gap-2'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex flex-wrap items-center gap-1.5'>
                        <span className='font-mono text-xs sm:text-sm font-bold text-foreground'>
                          {item.no_penawaran}
                        </span>
                        <Badge
                          variant='outline'
                          className='h-5 rounded-full border-border bg-muted/60 px-2 text-[10px] font-semibold text-muted-foreground'
                        >
                          Penawaran ke-{item.revisi_ke + 1}
                          {item.revisi_ke > 0 ? ` (Revisi ${item.revisi_ke})` : ''}
                        </Badge>
                      </div>
                      <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
                        <PenawaranStatusBadge status={item.status} />
                        {showValidity && (
                          <PenawaranValidityBadge
                            validity={validity}
                            showDetail
                          />
                        )}
                      </div>
                    </div>

                    <div className='text-left sm:text-right'>
                      <span className='block text-[11px] text-muted-foreground'>
                        Total Nilai
                      </span>
                      <span className='text-sm sm:text-base font-bold text-accent'>
                        {formatFullRupiah(item.total_nilai)}
                      </span>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl border border-border bg-muted/20 p-3 text-xs'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-[11px] text-muted-foreground'>
                        Tanggal Penawaran
                      </span>
                      {isEditingDate ? (
                        <div className='flex items-center gap-1.5'>
                          <FilterDatePicker
                            aria-label={`Tanggal penawaran ${item.no_penawaran}`}
                            value={draftDate}
                            onChange={setDraftDate}
                            isDisabled={isBusy}
                            className='w-auto min-w-[148px]'
                            groupClassName='h-8 rounded-lg text-xs'
                          />
                          <Button
                            type='button'
                            size='icon-sm'
                            disabled={isBusy || !draftDate}
                            onClick={() => handleSaveDate(item)}
                            aria-label='Simpan tanggal penawaran'
                            className='h-8 w-8 shrink-0 rounded-lg cursor-pointer'
                          >
                            <Check className='size-3.5' />
                          </Button>
                          <Button
                            type='button'
                            size='icon-sm'
                            variant='ghost'
                            disabled={isBusy}
                            onClick={() => setEditingDateId(null)}
                            aria-label='Batal ubah tanggal'
                            className='h-8 w-8 shrink-0 rounded-lg cursor-pointer'
                          >
                            <X className='size-3.5' />
                          </Button>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1.5 font-semibold text-foreground'>
                          <Calendar className='size-3.5 text-muted-foreground shrink-0' />
                          <span>{formatShortDate(item.tanggal_penawaran)}</span>
                          {canEdit && (
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon-sm'
                              onClick={() => {
                                setDraftDate(toDateInputValue(item.tanggal_penawaran));
                                setEditingDateId(item.id_penawaran);
                              }}
                              aria-label='Ubah tanggal penawaran'
                              className='h-6 w-6 rounded-md text-muted-foreground hover:text-foreground cursor-pointer'
                            >
                              <Pencil className='size-3' />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col gap-1'>
                      <span className='text-[11px] text-muted-foreground'>
                        Batas Masa Berlaku (30 Hari)
                      </span>
                      <span className='font-semibold text-foreground'>
                        {validity ? formatShortDate(validity.expiryDate) : '-'}
                      </span>
                    </div>
                  </div>

                  {item.url_file_penawaran && (
                    <DocumentPreviewCard
                      url={item.url_file_penawaran}
                      fileName={
                        decodeURIComponent(
                          item.url_file_penawaran.split('/').pop()?.split('?')[0] || '',
                        ) || 'Dokumen Penawaran.pdf'
                      }
                    />
                  )}

                  {canEdit && (
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-border/60 pt-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-medium text-muted-foreground shrink-0'>
                          Status:
                        </span>
                        <FilterSelectInput
                          aria-label={`Ubah status penawaran ${item.no_penawaran}`}
                          options={PENAWARAN_STATUS_OPTIONS.map((opt) => ({
                            value: opt.value,
                            label: opt.label,
                          }))}
                          value={item.status}
                          isDisabled={isBusy}
                          onChange={(val) =>
                            handleStatusChange(item, val as StatusPenawaran)
                          }
                          className='w-36'
                          triggerClassName='h-8 rounded-lg text-xs font-medium'
                        />
                      </div>

                      <div className='flex flex-wrap items-center gap-1.5'>
                        {item.status === 'draft' && (
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            disabled={isBusy}
                            onClick={() => handleStatusChange(item, 'dikirim')}
                            className='h-8 gap-1.5 rounded-lg border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold cursor-pointer'
                          >
                            <Send className='size-3' />
                            Tandai Dikirim
                          </Button>
                        )}
                        {item.status === 'dikirim' && (
                          <>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                              disabled={isBusy}
                              onClick={() => handleStatusChange(item, 'disetujui')}
                              className='h-8 gap-1.5 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold cursor-pointer'
                            >
                              <Check className='size-3.5' />
                              Setujui
                            </Button>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                              disabled={isBusy}
                              onClick={() => handleStatusChange(item, 'ditolak')}
                              className='h-8 gap-1.5 rounded-lg border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold cursor-pointer'
                            >
                              <X className='size-3.5' />
                              Tolak
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {canEdit && isQuotationStage && onAddQuotation && (
            <Button
              type='button'
              variant='outline'
              onClick={onAddQuotation}
              className='h-10 w-full gap-1.5 rounded-md border-dashed border-primary/40 bg-primary/5 text-xs font-semibold text-primary shadow-none hover:bg-primary/10 cursor-pointer'
            >
              <Plus className='size-3.5' />
              Buat Revisi Penawaran (ke-{penawaranList.length + 1})
            </Button>
          )}
        </>
      )}
    </div>
  );
}
