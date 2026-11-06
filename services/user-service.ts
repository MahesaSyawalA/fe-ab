import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/user.types';

export type PublicUser = Omit<User, 'password_hash'>;

export const userService = {
  async getList(): Promise<ApiResponse<PublicUser[]>> {
    const response = await api.get<ApiResponse<PublicUser[]>>('/users');
    return response.data;
  },
};
