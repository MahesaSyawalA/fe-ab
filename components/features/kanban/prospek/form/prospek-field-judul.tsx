import { ProspekTextFieldInput } from '../inputs';

interface ProspekFieldJudulProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProspekFieldJudul({
  value,
  onChange,
  error,
}: ProspekFieldJudulProps) {
  return (
    <ProspekTextFieldInput
      label='Judul'
      isRequired
      errorMessage={error}
      value={value}
      onChange={onChange}
      placeholder='Default'
    />
  );
}
