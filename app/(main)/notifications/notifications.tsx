'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { PostSkeleton } from '@/components/post';
import { InfiniteScrollContainer } from '@/components/infinite-scroll-container';
import { Button } from '@/components/ui/button';
import { Notification } from './notification';

import { NotificationPage } from '@/types';
import { kyInstance } from '@/lib/ky';
import { useEffect } from 'react';

export const Notifications = () => {
  const {
    data,
    isError,
    isLoading,
    isPending,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          '/api/notifications',
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => kyInstance.patch(`/api/notifications/mark-as-read`),
    onSuccess: () => {
      queryClient.setQueryData(['unread-notifications-count'], {
        unreadCount: 0,
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (isPending || isLoading) {
    return (
      <div className="space-y-3">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (!hasNextPage && notifications.length < 0) {
    return (
      <p className="text-center text-muted-foreground">
        You do not have any notification.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading notifications.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="animate-spin size-8 mx-auto" />
      )}
      {hasNextPage && !isFetching && (
        <div className="flex items-center justify-center">
          <Button variant="ghost" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        </div>
      )}
    </InfiniteScrollContainer>
  );
};
