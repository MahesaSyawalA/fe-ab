import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics-service';
import type { AnalyticsParams } from '@/types/analytics.types';

export const analyticsKeys = {
  all: ['analytics'] as const,
  siklus: (p: AnalyticsParams) => [...analyticsKeys.all, 'siklus', p] as const,
  performa: (p: AnalyticsParams) => [...analyticsKeys.all, 'performa', p] as const,
  topSpenders: (p: AnalyticsParams) => [...analyticsKeys.all, 'top-spenders', p] as const,
};

export const useSiklusPenjualanQuery = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.siklus(params),
    queryFn: () => analyticsService.getSiklusPenjualan(params),
  });

export const usePerformaSalesQuery = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.performa(params),
    queryFn: () => analyticsService.getPerformaSales(params),
  });

export const useTopSpendersQuery = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.topSpenders(params),
    queryFn: () => analyticsService.getTopSpenders(params),
  });
