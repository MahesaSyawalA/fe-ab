'use client';

import dynamic from 'next/dynamic';
import { PelangganMapProps } from './pelanggan-map-inner';

const DynamicMap = dynamic(() => import('./pelanggan-map-inner'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-[200px] rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 animate-pulse text-xs text-slate-400'>
      Memuat Peta...
    </div>
  ),
});

export function PelangganMap(props: PelangganMapProps) {
  return <DynamicMap {...props} />;
}
