import { ListPageHeader } from '@/components/ui/list-page-header';

export default function DirectorDashboardPage() {
  return (
    <div className='mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 pb-12'>
      <ListPageHeader
        title='Dashboard'
        subtitle='Ringkasan performa penjualan, revenue pipeline, dan aktivitas tim'
        addLabel=''
      />

      <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-12 text-center'>
        <p className='text-sm font-medium text-muted-foreground'>
          Modul Analitik & Dashboard Performa Penjualan Eksekutif sedang disiapkan.
        </p>
      </div>
    </div>
  );
}
