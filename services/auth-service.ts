import { api } from '@/lib/axios';
import { logoutUser } from '@/lib/auth-helpers';
import type { ApiResponse } from '@/types/api.types';

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export const authService = {
  logout: logoutUser,

  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
    const response = await api.post<ApiResponse<null>>('/auth/change-password', payload);
    return response.data;
  },
};

export { logoutUser };
