'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import { notificationService } from '@/services/notification-service';

/** Daftar notifikasi milik user login, disegarkan lewat Pusher. */
export function useNotifications() {
  const { data: session } = useSession();
  const userId = session?.user?.id_user || session?.user?.id || '';
  const queryClient = useQueryClient();
  const queryKey = React.useMemo(() => ['notifikasi', userId], [userId]);

  const query = useQuery({
    queryKey,
    queryFn: notificationService.getList,
    enabled: Boolean(userId),
  });

  React.useEffect(() => {
    if (!userId || !pusherClient) return;
    const channelName = `private-user-${userId}`;
    const channel = pusherClient.subscribe(channelName);
    const handle = (data: { title: string; message: string }) => {
      toast.info(data.title, {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          data.message,
        ),
      });
      void queryClient.invalidateQueries({ queryKey });
    };
    channel.bind('notifikasi-baru', handle);
    return () => {
      channel.unbind('notifikasi-baru', handle);
      pusherClient?.unsubscribe(channelName);
    };
  }, [userId, queryClient, queryKey]);

  const onSuccess = () => queryClient.invalidateQueries({ queryKey });
  const markAsRead = useMutation({ mutationFn: notificationService.markAsRead, onSuccess });
  const markAllAsRead = useMutation({ mutationFn: notificationService.markAllAsRead, onSuccess });

  return {
    items: query.data?.data ?? [],
    unread: query.data?.unread ?? 0,
    isError: query.isError,
    isLoading: query.isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: () => markAllAsRead.mutate(),
  };
}
