import * as React from 'react';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { FileType } from '@/components/reui/file-type';
import { FilePenawaran } from '../types';

interface ProspekFieldPenawaranProps {
  value: FilePenawaran | null;
  onChange: (value: FilePenawaran | null) => void;
}

export function ProspekFieldPenawaran({
  value,
  onChange,
}: ProspekFieldPenawaranProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    onChange({ name: file.name, size: `${kb} KB` });
  };

  const handleConfirmRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowConfirmRemove(false);
  };

  return (
    <FormField label='Upload File Penawaran'>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.doc,.docx'
        onChange={handleFileChange}
        className='hidden'
      />

      {value ? (
        <Attachment className='w-full rounded-xl border-border bg-card p-1'>
          <AttachmentMedia className='bg-rose-500/10'>
            <FileType type='pdf' size='xs' />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle className='text-xs font-semibold text-foreground'>
              {value.name}
            </AttachmentTitle>
            <AttachmentDescription className='text-[11px] text-muted-foreground'>
              {value.size}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions className='pr-2'>
            <AttachmentAction
              type='button'
              onClick={() => setShowConfirmRemove(true)}
              className='text-muted-foreground hover:text-destructive cursor-pointer'
              aria-label='Hapus file penawaran'
            >
              <Trash2 className='size-4' />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ) : (
        <Button
          type='button'
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
          className='h-12 w-full gap-2 rounded-xl border-dashed border-border bg-muted/20 text-xs font-medium text-muted-foreground shadow-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer'
        >
          <Upload className='size-4' />
          Unggah dokumen penawaran (.PDF)
        </Button>
      )}

      <ConfirmModal
        open={showConfirmRemove}
        onOpenChange={setShowConfirmRemove}
        title='Hapus Berkas Penawaran?'
        description={`Berkas "${value?.name || 'penawaran ini'}" akan dihapus dari formulir prospek.`}
        confirmLabel='Hapus'
        cancelLabel='Batal'
        icon={<Trash2 className='size-7 text-rose-600' />}
        onConfirm={handleConfirmRemove}
      />
    </FormField>
  );
}
