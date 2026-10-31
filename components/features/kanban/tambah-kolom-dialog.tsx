'use client';

import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { NativeSelect } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { JenisTahap } from '@/types/kanban-stage.types';
import { useKanbanStore } from '@/lib/kanban-store';

interface TambahKolomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JENIS_TAHAP_OPTIONS: { value: JenisTahap; label: string }[] = [
  { value: 'visit', label: 'Visit' },
  { value: 'kebutuhan', label: 'Kebutuhan' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'quotation', label: 'Quotation' },
  { value: 'po', label: 'PO' },
  { value: 'revenue', label: 'Revenue' },
];

const CHECKBOX_FIELDS = [
  {
    key: 'is_tahap_akhir',
    label: 'Tahap Akhir (Closing / Selesai)',
    hint: 'Tandai jika tiket pada kolom ini dianggap telah mencapai keputusan akhir (WON / LOST).',
  },
  {
    key: 'is_aktif',
    label: 'Status Aktif',
    hint: 'Kolom akan langsung ditampilkan dan aktif di papan Kanban.',
  },
] as const;

export function TambahKolomDialog({ open, onOpenChange }: TambahKolomDialogProps) {
  const { stages, addStage } = useKanbanStore();

  const getInitialForm = React.useCallback(
    () => ({
      nama_tahap: '',
      jenis_tahap: 'follow_up' as JenisTahap,
      urutan: stages.length + 1,
      is_tahap_akhir: false,
      is_aktif: true,
    }),
    [stages.length],
  );

  const [form, setForm] = React.useState(getInitialForm);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setForm(getInitialForm());
      setError('');
    }
  }, [open, getInitialForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_tahap.trim()) {
      setError('Nama tahap wajib diisi');
      return;
    }
    addStage({ ...form, urutan: Number(form.urutan) || stages.length + 1 });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title='Tambah Kolom Board Baru'
      description='Atur nama kolom dan tipe tahap kanban sesuai alur CRM'
    >
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 py-2'>
        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Nama Kolom / Tahap <span className='text-destructive'>*</span>
          </Label>
          <Input
            value={form.nama_tahap}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, nama_tahap: e.target.value }));
              setError('');
            }}
            placeholder='Contoh: Demo Unit, Review Teknis...'
            className='h-10 rounded-xl text-xs'
            autoFocus
          />
          {error && <p className='text-[11px] font-medium text-destructive'>{error}</p>}
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>
            Jenis Tahap <span className='text-destructive'>*</span>
          </Label>
          <NativeSelect
            value={form.jenis_tahap}
            onChange={(e) => setForm((prev) => ({ ...prev, jenis_tahap: e.target.value as JenisTahap }))}
            className='border-border font-medium'
          >
            {JENIS_TAHAP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label className='text-xs font-semibold'>Urutan Posisi Kolom</Label>
          <Input
            type='number'
            min={1}
            value={form.urutan}
            onChange={(e) => setForm((prev) => ({ ...prev, urutan: Number(e.target.value) }))}
            className='h-10 rounded-xl text-xs'
          />
        </div>

        <div className='flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-3'>
          {CHECKBOX_FIELDS.map(({ key, label, hint }) => (
            <div key={key} className='flex items-start gap-2.5'>
              <Checkbox
                id={key}
                checked={form[key]}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, [key]: Boolean(checked) }))}
                className='mt-0.5'
              />
              <div className='flex flex-col gap-0.5'>
                <Label htmlFor={key} className='cursor-pointer text-xs font-semibold'>
                  {label}
                </Label>
                <span className='text-[10px] text-muted-foreground'>{hint}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-3 pt-2'>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)} className='h-10 rounded-xl text-xs font-semibold cursor-pointer'>
            Batal
          </Button>
          <Button type='submit' className='h-10 rounded-xl text-xs font-semibold cursor-pointer'>
            Tambah Kolom
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
