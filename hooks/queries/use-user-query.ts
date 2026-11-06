import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user-service';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
};

export function useUserListQuery() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => userService.getList(),
  });
}
