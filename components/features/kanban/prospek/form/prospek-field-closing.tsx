import { Calendar } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Separator } from '@/components/ui/separator';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

interface ProspekFieldClosingProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProspekFieldClosing({
  value,
  onChange,
}: ProspekFieldClosingProps) {
  return (
    <FormField
      label='Target Tanggal Closing'
      required
      hint='Baseline SLA proyeksi Q4 Tahun Anggaran 2024'
    >
      <InputGroup className='h-10 rounded-xl border-primary/40 bg-card shadow-none'>
        <InputGroupAddon
          align='inline-start'
          className='gap-2.5 pl-3.5 pr-1 text-muted-foreground'
        >
          <Calendar className='size-4' />
          <Separator orientation='vertical' className='h-4' />
        </InputGroupAddon>
        <InputGroupInput
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Default'
          className='text-xs font-medium text-foreground'
        />
      </InputGroup>
    </FormField>
  );
}
