import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
  AnalyticsParams,
  PerformaSales,
  SiklusPenjualan,
  TopSpenderItem,
} from '@/types/analytics.types';

async function fetchAnalytics<T>(path: string, params: AnalyticsParams): Promise<T> {
  const response = await api.get<ApiResponse<T>>(`/analytics/${path}`, { params });
  return response.data.data;
}

export const analyticsService = {
  getSiklusPenjualan: (params: AnalyticsParams) =>
    fetchAnalytics<SiklusPenjualan>('siklus-penjualan', params),
  getPerformaSales: (params: AnalyticsParams) =>
    fetchAnalytics<PerformaSales>('performa-sales', params),
  getTopSpenders: (params: AnalyticsParams) =>
    fetchAnalytics<TopSpenderItem[]>('top-spenders', params),
};
