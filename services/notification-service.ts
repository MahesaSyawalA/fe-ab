import { api } from '@/lib/axios';
import type { NotifikasiListResponse } from '@/types/notification.types';

export const notificationService = {
  async getList(): Promise<NotifikasiListResponse> {
    const res = await api.get<NotifikasiListResponse>('/notifikasi', { params: { limit: 20, order: 'desc' } });
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifikasi/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifikasi/read-all');
  },
};
