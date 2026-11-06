import { FormActions } from '@/components/ui/form-actions';

interface ProspekFormActionsProps {
  onCancel: () => void;
  className?: string;
}

export function ProspekFormActions({
  onCancel,
  className,
}: ProspekFormActionsProps) {
  return <FormActions onCancel={onCancel} className={className} />;
}
