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
      <CardContent className='flex flex-col gap-3.5 p-4 sm:p-5'>

        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-xs sm:text-base font-medium text-white/90'>
              Estimasi pipeline aktif
            </span>
            {isLoading ? (
              <Skeleton className='h-7 sm:h-8 w-36 rounded-lg bg-white/20' />
            ) : (
              <span className='text-lg sm:text-xl font-bold tracking-tight text-white'>
                {totalPipelineLabel}
              </span>
            )}
          </div>

          <div className='flex flex-col items-end gap-1.5'>
            {isLoading ? (
              <Skeleton className='h-6 w-24 rounded-full bg-white/20' />
            ) : (
              <Badge className='h-6 rounded-full border-0 bg-white/20 px-3 text-[11px] sm:text-xs font-medium text-white hover:bg-white/25'>
                {activeTicketsCount} tiket aktif
              </Badge>
            )}
            <span className='text-xs sm:text-sm font-normal text-white/90'>
              Target bulan ini {targetPercentage}%
            </span>
          </div>
        </div>

        {showTeamContributions && teamContributions.length > 0 && (
          <div className='flex flex-col gap-2.5 pt-0.5'>
            <div className='flex items-center justify-between'>
              <span className='text-xs sm:text-sm font-medium text-white/90'>
                Kontribusi Anggota Tim:
              </span>
              <button
                type='button'
                onClick={onViewDetails}
                className='text-xs sm:text-sm font-medium text-white underline underline-offset-2 hover:text-white/80 cursor-pointer'
              >
                Lihat Rincian
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5'>
              {teamContributions.map((member) => (
                <div
                  key={member.id}
                  className='flex flex-row sm:flex-col items-center justify-between sm:justify-center rounded-xl border border-white/15 bg-white/15 px-3.5 py-2.5 sm:px-2 sm:py-2.5 text-left sm:text-center backdrop-blur-xs transition-colors hover:bg-white/20'
                >
                  <div className='flex flex-col sm:items-center min-w-0'>
                    <span className='text-xs sm:text-sm font-semibold text-white truncate max-w-full'>
                      {member.name}
                    </span>
                    <span className='text-xs font-semibold text-white/80 sm:mt-1'>
                      {member.ticketsLabel}
                    </span>
                  </div>
                  <span className='text-xs sm:text-sm font-bold text-white shrink-0 sm:mt-0.5'>
                    {member.valueLabel}
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
