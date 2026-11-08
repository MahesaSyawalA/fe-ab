import * as React from 'react';
import { Form, toast } from '@heroui/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { JenisTahap } from '@/types/kanban-stage.types';
import { JENIS_TAHAP_OPTIONS } from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import { useCreateTahapMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/axios';
import {
  TambahKolomTextFieldInput,
  TambahKolomSelectInput,
  TambahKolomSelectOption,
} from './inputs';

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

/** Dirender hanya saat modal terbuka, sehingga state form selalu mulai bersih. */
export function TambahKolomForm({ onClose }: { onClose: () => void }) {
  const { stages, addStage } = useKanbanStore();
  const createTahapMutation = useCreateTahapMutation();

  const [form, setForm] = React.useState({
    nama_tahap: '',
    jenis_tahap: 'follow_up' as JenisTahap,
    urutan: stages.length + 1,
    is_tahap_akhir: false,
    is_aktif: true,
  });
  const [error, setError] = React.useState('');

  const jenisTahapOptions = React.useMemo<TambahKolomSelectOption[]>(
    () => JENIS_TAHAP_OPTIONS.map((opt) => ({ value: opt.id, label: opt.label })),
    [],
  );

  const isPending = createTahapMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_tahap.trim()) {
      setError('Nama tahap wajib diisi');
      return;
    }

    try {
      const payload = {
        nama_tahap: form.nama_tahap.trim(),
        jenis_tahap: form.jenis_tahap,
        urutan: Number(form.urutan) || stages.length + 1,
        is_tahap_akhir: form.is_tahap_akhir,
        is_aktif: form.is_aktif,
      };

      await createTahapMutation.mutateAsync(payload);
      addStage(payload);
      toast.success('Tahap berhasil ditambahkan', {
        description: `Kolom "${payload.nama_tahap}" berhasil ditambahkan ke papan Kanban.`,
      });
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Gagal menambahkan kolom tahap');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='flex flex-col gap-4 py-2' validationBehavior='aria'>
      <TambahKolomTextFieldInput
        label='Nama Kolom / Tahap'
        isRequired
        errorMessage={error}
        value={form.nama_tahap}
        onChange={(val) => {
          setForm((prev) => ({ ...prev, nama_tahap: val }));
          setError('');
        }}
        placeholder='Contoh: Demo Unit, Review Teknis...'
        autoFocus
      />

      <TambahKolomSelectInput
        label='Jenis Tahap'
        isRequired
        value={form.jenis_tahap}
        onChange={(val) =>
          setForm((prev) => ({ ...prev, jenis_tahap: val as JenisTahap }))
        }
        options={jenisTahapOptions}
      />

      <TambahKolomTextFieldInput
        label='Urutan Posisi Kolom'
        type='number'
        min={1}
        value={form.urutan}
        onChange={(val) => setForm((prev) => ({ ...prev, urutan: Number(val) }))}
      />

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
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={isPending}
          className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
        >
          Batal
        </Button>
        <Button
          type='submit'
          disabled={isPending}
          className='h-10 rounded-xl text-xs font-semibold cursor-pointer'
        >
          {isPending ? (
            <>
              <Loader2 className='mr-2 size-4 animate-spin' />
              Menambahkan...
            </>
          ) : (
            'Tambah Kolom'
          )}
        </Button>
      </div>
    </Form>
  );
}
