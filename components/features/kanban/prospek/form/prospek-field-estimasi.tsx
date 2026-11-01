import { FormField } from '@/components/ui/form-field';
import { Separator } from '@/components/ui/separator';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { formatNumberInput } from '@/lib/utils';

interface ProspekFieldEstimasiProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProspekFieldEstimasi({
  value,
  onChange,
}: ProspekFieldEstimasiProps) {
  return (
    <FormField label='Estimasi Nilai Penawaran' required>
      <InputGroup className='h-10 rounded-xl border-primary/40 bg-card shadow-none'>
        <InputGroupAddon
          align='inline-start'
          className='gap-2.5 pl-3.5 pr-1 text-xs font-semibold text-muted-foreground'
        >
          <span>RP</span>
          <Separator orientation='vertical' className='h-4' />
        </InputGroupAddon>
        <InputGroupInput
          type='text'
          value={value}
          onChange={(e) => onChange(formatNumberInput(e.target.value))}
          placeholder='Default'
          className='text-xs font-medium text-foreground'
        />
      </InputGroup>
    </FormField>
  );
}
