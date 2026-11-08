import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamContributionItem } from '@/types/ticket.types';

interface KanbanPipelineCardProps {
  totalPipelineLabel: string;
  activeTicketsCount: number;
  targetPercentage?: number;
  showTeamContributions?: boolean;
  teamContributions?: TeamContributionItem[];
  onViewDetails?: () => void;
  isLoading?: boolean;
}

export function KanbanPipelineCard({
  totalPipelineLabel,
  activeTicketsCount,
  targetPercentage = 62,
  showTeamContributions = false,
  teamContributions = [],
  onViewDetails,
  isLoading = false,
}: KanbanPipelineCardProps) {
  return (
    <Card className='rounded-2xl border-0 bg-linear-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] py-0 text-white shadow-sm ring-0'>
      <CardContent className='flex flex-col gap-3.5 p-4'>
        {/* Top Summary Row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-[11px] font-normal text-white/85'>
              Estimasi pipeline aktif
            </span>
            {isLoading ? (
              <Skeleton className='h-7 w-36 rounded-lg bg-white/20' />
            ) : (
              <span className='text-xl font-bold tracking-tight text-white'>
                {totalPipelineLabel}
              </span>
            )}
          </div>

          <div className='flex flex-col items-end gap-1.5'>
            {isLoading ? (
              <Skeleton className='h-6 w-24 rounded-full bg-white/20' />
            ) : (
              <Badge className='h-6 rounded-full border-0 bg-white/20 px-3 text-[11px] font-medium text-white hover:bg-white/25'>
                {activeTicketsCount} tiket aktif
              </Badge>
            )}
            <span className='text-[11px] font-normal text-white/90'>
              Target bulan ini {targetPercentage}%
            </span>
          </div>
        </div>

        {/* Manager / Owner Team Contribution Section */}
        {showTeamContributions && teamContributions.length > 0 && (
          <div className='flex flex-col gap-2 pt-0.5'>
            <div className='flex items-center justify-between'>
              <span className='text-[11px] font-normal text-white/90'>
                Kontribusi Anggota Tim:
              </span>
              <button
                type='button'
                onClick={onViewDetails}
                className='text-[11px] font-medium text-white underline underline-offset-2 hover:text-white/80 cursor-pointer'
              >
                Lihat Rincian
              </button>
            </div>

            <div className='grid grid-cols-3 gap-2'>
              {teamContributions.map((member) => (
                <div
                  key={member.id}
                  className='flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/15 px-2 py-2.5 text-center backdrop-blur-xs'
                >
                  <span className='text-xs font-semibold text-white'>
                    {member.name}
                  </span>
                  <span className='mt-0.5 text-[11px] font-normal text-white/90'>
                    {member.valueLabel}
                  </span>
                  <span className='mt-1 text-[10px] font-normal text-white/75'>
                    {member.ticketsLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
