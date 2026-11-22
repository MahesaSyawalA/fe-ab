'use client';

import * as React from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCompactRupiah } from '@/lib/utils';
import type { TiketStatus, TiketWithDetails } from '@/types/ticket.types';
import {
  LostReasonFields,
  formatLostReason,
  parseLostReason,
} from '../../../shared/lost-reason-fields';
import type { NegotiationResult } from '../../types';

export interface ProspekNegotiationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TiketWithDetails;
  currentStatus?: TiketStatus;
  isSubmitting?: boolean;
  onSelect: (result: NegotiationResult, alasanLost?: string | null) => void | Promise<void>;
}

export type NegotiationStep = 'select' | 'lost-reason';

export function useNegotiationDrawerState({
  open,
  onOpenChange,
  ticket,
  currentStatus,
  isSubmitting = false,
  onSelect,
}: ProspekNegotiationDrawerProps) {
  const isDecided = currentStatus === 'won' || currentStatus === 'lost';
  const initialParsed = React.useMemo(
    () => parseLostReason(ticket.alasan_lost),
    [ticket.alasan_lost],
  );

  const [step, setStep] = React.useState<NegotiationStep>('select');
  const [selectedOption, setSelectedOption] = React.useState<NegotiationResult>(
    currentStatus === 'won' ? 'negosiasi' : 'won',
  );
  const [lostCategory, setLostCategory] = React.useState(initialParsed.category || '');
  const [lostDetail, setLostDetail] = React.useState(initialParsed.detail || '');
  const [lostTouched, setLostTouched] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setStep('select');
    setSelectedOption(currentStatus === 'won' ? 'negosiasi' : 'won');
    const parsed = parseLostReason(ticket.alasan_lost);
    setLostCategory(parsed.category || '');
    setLostDetail(parsed.detail || '');
    setLostTouched(false);
  }, [currentStatus, ticket.alasan_lost]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm],
  );

  const handleClose = React.useCallback(() => {
    if (isSubmitting) return;
    handleOpenChange(false);
  }, [isSubmitting, handleOpenChange]);

  const handleContinueSelect = async () => {
    if (selectedOption === 'lost') {
      setStep('lost-reason');
      return;
    }
    await onSelect(selectedOption, null);
  };

  const handleConfirmLost = async () => {
    setLostTouched(true);
    if (!lostCategory || !lostDetail.trim()) return;
    const formatted = formatLostReason(lostCategory, lostDetail);
    await onSelect('lost', formatted);
  };

  const isLostFormValid = Boolean(lostCategory && lostDetail.trim().length > 0);

  const headerTitle =
    step === 'lost-reason'
      ? 'Tandai Tiket Lost'
      : isDecided
        ? 'Ubah Hasil Negosiasi'
        : 'Hasil Negosiasi';

  const headerSubtitle =
    step === 'lost-reason'
      ? undefined
      : isDecided
        ? `Status prospek saat ini: ${currentStatus === 'won' ? 'WON' : 'LOST'}. Pilih status baru jika ingin memperbarui.`
        : 'Tiket sudah di tahap akhir. Tentukan hasil akhirnya.';

  return {
    open,
    step,
    isDecided,
    selectedOption,
    setSelectedOption,
    lostCategory,
    setLostCategory,
    lostDetail,
    setLostDetail,
    lostTouched,
    setLostTouched,
    isLostFormValid,
    headerTitle,
    headerSubtitle,
    handleOpenChange,
    handleClose,
    handleContinueSelect,
    handleConfirmLost,
  };
}

function TicketMiniSummary({ ticket }: { ticket: TiketWithDetails }) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5'>
      <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        <Building2 className='size-4.5' />
      </div>
      <div className='flex min-w-0 flex-col gap-0.5 text-left'>
        <span className='truncate text-xs sm:text-sm font-semibold text-foreground'>
          {ticket.judul} · {ticket.kode_tiket}
        </span>
        <span className='truncate text-xs sm:text-sm text-secondary-foreground'>
          {ticket.nama_outlet} · {formatCompactRupiah(ticket.estimasi_nilai)}
        </span>
      </div>
    </div>
  );
}

interface NegotiationOptionCardProps {
  selected: boolean;
  disabled?: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  activeCardClass: string;
  activeBorderClass: string;
  activeDotClass: string;
  onSelect: () => void;
}

function NegotiationOptionCard({
  selected,
  disabled,
  title,
  description,
  icon,
  iconBgClass,
  activeCardClass,
  activeBorderClass,
  activeDotClass,
  onSelect,
}: NegotiationOptionCardProps) {
  return (
    <div
      role='radio'
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex items-center justify-between gap-2.5 sm:gap-3 py-2.5 px-3 sm:px-3.5 min-h-[54px] rounded-xl select-none border transition-colors duration-150 outline-none shadow-2xs',
        disabled
          ? 'opacity-50 cursor-not-allowed border-border/60 bg-muted/30'
          : 'cursor-pointer',
        !disabled && selected
          ? activeCardClass
          : !disabled && 'border-border/80 hover:border-slate-300 bg-card',
      )}
    >
      <div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
        <div
          className={cn(
            'size-8.5 sm:size-9 rounded-full flex items-center justify-center shrink-0',
            iconBgClass,
          )}
        >
          {icon}
        </div>
        <div className='flex flex-col gap-0.5 text-left min-w-0'>
          <span className='text-xs sm:text-sm font-bold text-foreground leading-tight'>
            {title}
          </span>
          <span className='text-xs text-secondary-foreground leading-snug'>
            {description}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'size-4.5 sm:size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150',
          selected
            ? cn(activeBorderClass, 'bg-white dark:bg-card')
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-card',
        )}
      >
        <div
          className={cn(
            'size-2 sm:size-2.5 rounded-full transition-transform duration-150',
            selected ? cn('scale-100', activeDotClass) : 'scale-0 bg-transparent',
          )}
        />
      </div>
    </div>
  );
}

interface NegotiationBodyContentProps {
  ticket: TiketWithDetails;
  currentStatus?: TiketStatus;
  isSubmitting?: boolean;
  state: ReturnType<typeof useNegotiationDrawerState>;
}

export function NegotiationBodyContent({
  ticket,
  currentStatus,
  isSubmitting = false,
  state,
}: NegotiationBodyContentProps) {
  if (state.step === 'select') {
    return (
      <div className='flex flex-col gap-3.5'>
        <TicketMiniSummary ticket={ticket} />

        <div
          role='radiogroup'
          aria-label='Pilih Hasil Negosiasi'
          className='flex flex-col gap-2.5'
        >
          <NegotiationOptionCard
            selected={state.selectedOption === 'won'}
            disabled={currentStatus === 'won'}
            title={`WON${currentStatus === 'won' ? ' (Saat Ini)' : ''}`}
            description='Penawaran disetujui. Lanjut input Purchase Order.'
            icon={<CheckCircle2 className='size-4.5 sm:size-5 text-[#22C55E]' strokeWidth={2.2} />}
            iconBgClass='bg-[#E8FAF0] dark:bg-emerald-950/40'
            activeCardClass='border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500'
            activeBorderClass='border-emerald-500'
            activeDotClass='bg-emerald-500'
            onSelect={() => state.setSelectedOption('won')}
          />

          <NegotiationOptionCard
            selected={state.selectedOption === 'lost'}
            disabled={currentStatus === 'lost'}
            title={`LOST${currentStatus === 'lost' ? ' (Saat Ini)' : ''}`}
            description='Deal batal. Wajib isi alasan kalah.'
            icon={<XCircle className='size-4.5 sm:size-5 text-[#EF4444]' strokeWidth={2.2} />}
            iconBgClass='bg-[#FEECEC] dark:bg-rose-950/40'
            activeCardClass='border-rose-500 bg-rose-50/25 ring-1 ring-rose-500'
            activeBorderClass='border-rose-500'
            activeDotClass='bg-rose-500'
            onSelect={() => state.setSelectedOption('lost')}
          />

          <NegotiationOptionCard
            selected={state.selectedOption === 'negosiasi'}
            title={
              state.isDecided
                ? 'Buka Kembali ke Tahap Negosiasi (Open)'
                : 'Pindahkan ke Tahap Negosiasi'
            }
            description='Lanjutkan proses follow up & negosiasi dengan klien.'
            icon={<ArrowLeftRight className='size-4 sm:size-4.5 text-primary' strokeWidth={2.2} />}
            iconBgClass='bg-primary/10'
            activeCardClass='border-primary bg-primary/5 ring-1 ring-primary'
            activeBorderClass='border-primary'
            activeDotClass='bg-primary'
            onSelect={() => state.setSelectedOption('negosiasi')}
          />
        </div>

        <div className='mt-1 grid grid-cols-2 gap-3 w-full sm:flex sm:justify-end sm:items-center sm:gap-2.5'>
          <Button
            type='button'
            variant='outline'
            disabled={isSubmitting}
            onClick={state.handleClose}
            className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs text-foreground font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
          >
            Batal
          </Button>
          <Button
            type='button'
            disabled={isSubmitting}
            onClick={state.handleContinueSelect}
            className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[130px] sm:px-5 rounded-md text-xs font-semibold text-white shadow-sm bg-primary-default hover:bg-primary-hover active:bg-primary data-[pressed=true]:bg-primary transition-all cursor-pointer disabled:opacity-50'
          >
            {isSubmitting ? 'Menyimpan...' : 'Lanjutkan'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3.5'>
      <TicketMiniSummary ticket={ticket} />

      <div className='flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive'>
        <AlertTriangle className='size-4 shrink-0 mt-0.5' />
        <span className='leading-relaxed'>
          Status tiket akan menjadi LOST dan tidak bisa dipindah ke tahap lain.
        </span>
      </div>

      <LostReasonFields
        selectedCategory={state.lostCategory}
        onCategoryChange={state.setLostCategory}
        detail={state.lostDetail}
        onDetailChange={state.setLostDetail}
        touched={state.lostTouched}
        onTouchedChange={state.setLostTouched}
      />

      <div className='mt-1 grid grid-cols-2 gap-3 w-full sm:flex sm:justify-end sm:items-center sm:gap-2.5'>
        <Button
          type='button'
          variant='outline'
          disabled={isSubmitting}
          onClick={state.handleClose}
          className='h-10 sm:h-9 w-full sm:w-28 rounded-md text-xs text-foreground font-semibold cursor-pointer border-border bg-card shadow-none hover:bg-muted/50'
        >
          Batal
        </Button>
        <Button
          type='button'
          disabled={!state.isLostFormValid || isSubmitting}
          onClick={state.handleConfirmLost}
          className='h-10 sm:h-9 w-full sm:w-auto sm:min-w-[130px] sm:px-5 rounded-md bg-destructive hover:bg-destructive/90 active:bg-destructive text-xs font-semibold text-white shadow-sm cursor-pointer disabled:opacity-50'
        >
          {isSubmitting ? 'Menyimpan...' : 'Tandai Lost'}
        </Button>
      </div>
    </div>
  );
}
