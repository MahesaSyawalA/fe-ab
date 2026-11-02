import { ProspekCurrencyInput } from '../inputs';

interface ProspekFieldEstimasiProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProspekFieldEstimasi({
  value,
  onChange,
  error,
}: ProspekFieldEstimasiProps) {
  return (
    <ProspekCurrencyInput
      label='Estimasi Nilai Penawaran'
      isRequired
      errorMessage={error}
      value={value}
      onChange={onChange}
      placeholder='Default'
      prefix='RP'
      prefixClassName='text-muted-foreground'
      inputClassName='font-medium text-foreground'
    />
  );
}
