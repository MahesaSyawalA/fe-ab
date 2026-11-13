import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanQuickMovePillProps {
  nextStageName: string;
  onClick: () => void;
}

export function KanbanQuickMovePill({
  nextStageName,
  onClick,
}: KanbanQuickMovePillProps) {
  return (
    <div className='fixed bottom-5 left-1/2 z-30 -translate-x-1/2'>
      <Button
        type='button'
        onClick={onClick}
        className='h-10 gap-2 rounded-full bg-[#1E293B] px-5 text-xs font-semibold text-white shadow-lg hover:bg-[#0F172A] cursor-pointer'
      >
        <ArrowRight className='size-3.5' />
        Pindah ke {nextStageName}
      </Button>
    </div>
  );
}
