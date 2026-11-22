import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  userService,
  type UserListParams,
  type UserProfile,
  type CreateUserApiPayload,
  type UpdateProfileApiPayload,
  type UpdateUserApiPayload,
} from '@/services/user-service';
import { authService, type ChangePasswordPayload } from '@/services/auth-service';
import type { ApiPaginatedResponse } from '@/types/api.types';
import type { PublicUserWithSquad } from '@/types/user.types';
import { getErrorMessage } from '@/lib/axios';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  counts: (search?: string) => [...userKeys.all, 'counts', { search: search || undefined }] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

export function useUserListQuery(
  params?: UserListParams,
  options?: Omit<
    UseQueryOptions<ApiPaginatedResponse<PublicUserWithSquad>, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getList(params),
    ...options,
  });
}

export function useUserCountsSourceQuery(search?: string) {
  const normalizedSearch = search?.trim() || undefined;
  return useQuery({
    queryKey: userKeys.counts(normalizedSearch),
    queryFn: async () => {
      const firstPage = await userService.getList({
        page: 1,
        limit: 100,
        search: normalizedSearch,
      });
      const items = [...(firstPage.data ?? [])];
      const totalPages = firstPage.meta?.total_pages ?? 1;
      if (totalPages > 1) {
        const restPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, idx) =>
            userService.getList({
              page: idx + 2,
              limit: 100,
              search: normalizedSearch,
            }),
          ),
        );
        for (const pageRes of restPages) {
          if (Array.isArray(pageRes.data)) {
            items.push(...pageRes.data);
          }
        }
      }
      return items;
    },
    staleTime: 60_000,
  });
}

export function useUserProfileQuery() {
  const { data: session } = useSession();
  const userId = session?.user?.id_user || session?.user?.id;

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      let meData: UserProfile | null = null;
      try {
        const meRes = await userService.getMe();
        if (meRes.data && meRes.data.id_user) {
          meData = meRes.data;
          if (meData.no_telp !== undefined) {
            return meData;
          }
        }
      } catch (err) {
        console.warn('[useUserProfileQuery] getMe warning, mencoba fallback getUserById:', err);
      }

      if (userId) {
        try {
          const userRes = await userService.getUserById(userId);
          return meData ? { ...meData, ...userRes.data } : userRes.data;
        } catch (err) {
          if (meData) return meData;
          throw err;
        }
      }
      return meData;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileApiPayload) => userService.updateMe(data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.setQueryData(userKeys.me(), (old: UserProfile | null | undefined) => {
        if (!old) return res.data;
        return {
          ...old,
          ...res.data,
          ...variables,
        };
      });
    },
    onError: (error) => {
      console.warn('[useUpdateProfileMutation Error]:', getErrorMessage(error));
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserApiPayload) => userService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.warn('[useCreateUserMutation Error]:', getErrorMessage(error));
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserApiPayload }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.warn('[useUpdateUserMutation Error]:', getErrorMessage(error));
    },
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      new_password,
      must_change_password,
    }: {
      id: string;
      new_password: string;
      must_change_password?: boolean;
    }) => userService.resetPassword(id, { new_password, must_change_password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.warn('[useResetPasswordMutation Error]:', getErrorMessage(error));
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.warn('[useDeleteUserMutation Error]:', getErrorMessage(error));
    },
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error) => {
      console.warn('[useChangePasswordMutation Error]:', getErrorMessage(error));
    },
  });
}
