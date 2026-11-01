import { cn } from '@/lib/utils';
import { DetailTab } from '../types';

interface ProspekDetailTabsProps {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
  riwayatCount: number;
  aktivitasCount: number;
}

export function ProspekDetailTabs({
  active,
  onChange,
  riwayatCount,
  aktivitasCount,
}: ProspekDetailTabsProps) {
  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'info', label: 'Info' },
    { id: 'riwayat', label: `Riwayat (${riwayatCount})` },
    { id: 'aktivitas', label: `Aktivitas (${aktivitasCount})` },
  ];

  return (
    <div className='grid grid-cols-3 border-b border-border/70 bg-muted/20'>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type='button'
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative py-3 text-center text-xs sm:text-sm font-semibold transition-colors cursor-pointer',
              isActive
                ? 'text-primary bg-card'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
            )}
          >
            {tab.label}
            {isActive && (
              <span className='absolute inset-x-6 sm:inset-x-10 bottom-0 h-0.5 rounded-full bg-primary' />
            )}
          </button>
        );
      })}
    </div>
  );
}
