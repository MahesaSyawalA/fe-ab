import * as React from 'react';
import { Form } from '@heroui/react';
import { FormField } from '@/components/ui/form-field';
import { NativeSelect } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { JenisTahap } from '@/types/kanban-stage.types';
import { JENIS_TAHAP_OPTIONS } from '@/constants/kanban-constants';
import { useKanbanStore } from '@/lib/kanban-store';
import { TambahKolomTextFieldInput } from './inputs';

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

  const [form, setForm] = React.useState({
    nama_tahap: '',
    jenis_tahap: 'follow_up' as JenisTahap,
    urutan: stages.length + 1,
    is_tahap_akhir: false,
    is_aktif: true,
  });
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_tahap.trim()) {
      setError('Nama tahap wajib diisi');
      return;
    }
    addStage({ ...form, urutan: Number(form.urutan) || stages.length + 1 });
    onClose();
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

      <FormField label='Jenis Tahap' required>
        <NativeSelect
          value={form.jenis_tahap}
          onChange={(e) => setForm((prev) => ({ ...prev, jenis_tahap: e.target.value as JenisTahap }))}
          className='border-border font-medium'
        >
          {JENIS_TAHAP_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </NativeSelect>
      </FormField>

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
        <Button type='button' variant='outline' onClick={onClose} className='h-10 rounded-xl text-xs font-semibold cursor-pointer'>
          Batal
        </Button>
        <Button type='submit' className='h-10 rounded-xl text-xs font-semibold cursor-pointer'>
          Tambah Kolom
        </Button>
      </div>
    </Form>
  );
}
