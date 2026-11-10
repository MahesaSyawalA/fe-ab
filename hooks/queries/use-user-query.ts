import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { userService, type UserListParams, type UserProfile } from '@/services/user-service';
import { getErrorMessage } from '@/lib/axios';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

export function useUserListQuery(params?: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getList(params),
  });
}

export function useUserProfileQuery() {
  const { data: session } = useSession();
  const userId = session?.user?.id_user || session?.user?.id;

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      try {
        const meRes = await userService.getMe();
        if (meRes.data && meRes.data.id_user) {
          return meRes.data;
        }
      } catch (err) {
        console.warn('[useUserProfileQuery] getMe warning, mencoba fallback getUserById:', err);
      }

      if (userId) {
        const userRes = await userService.getUserById(userId);
        return userRes.data;
      }
      return null;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nama?: string; no_telp?: string } }) =>
      userService.updateUser(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.setQueryData(userKeys.me(), (old: UserProfile | null | undefined) => {
        if (!old) return res.data;
        return {
          ...old,
          ...variables.data,
        };
      });
    },
    onError: (error) => {
      console.warn('[useUpdateProfileMutation Error]:', getErrorMessage(error));
    },
  });
}
