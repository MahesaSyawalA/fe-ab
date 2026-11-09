import { useQuery } from '@tanstack/react-query';
import { userService, type UserListParams } from '@/services/user-service';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
};

export function useUserListQuery(params?: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getList(params),
  });
}
