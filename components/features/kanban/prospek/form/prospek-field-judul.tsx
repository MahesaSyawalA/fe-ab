import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <FormField label='Judul' required error={error}>
      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Default'
        className={cn(
          'h-10 rounded-xl bg-card px-3.5 text-xs shadow-none',
          error
            ? 'border-destructive focus-visible:border-destructive'
            : 'border-primary/40 focus-visible:border-primary',
        )}
      />
    </FormField>
  );
}
