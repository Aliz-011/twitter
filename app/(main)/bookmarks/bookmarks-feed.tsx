'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Post, PostSkeleton } from '@/components/post';
import { InfiniteScrollContainer } from '@/components/infinite-scroll-container';
import { Button } from '@/components/ui/button';

import { PostsPage } from '@/types';
import { kyInstance } from '@/lib/ky';

export const BookmarksFeed = () => {
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
    queryKey: ['post-feed', 'bookmarks'],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          '/api/posts/bookmarks',
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

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

  if (!hasNextPage && posts.length < 0) {
    return (
      <p className="text-center text-muted-foreground">
        You do not have any bookmarks.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks.
      </p>
    );
  }

  console.log(posts);

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
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