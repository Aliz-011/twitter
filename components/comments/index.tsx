import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { CommentInput } from './comment-input';
import { Comment } from './comment';

import { CommentsPage, PostData } from '@/types';
import { kyInstance } from '@/lib/ky';
import { Button } from '../ui/button';

type Props = {
  post: PostData;
};

export const Comments = ({ post }: Props) => {
  const {
    data,
    hasNextPage,
    isFetching,
    isError,
    isLoading,
    isPending,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select(data) {
      return {
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      };
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin size-5" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading the comments.
      </p>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="mt-2 space-y-3">
      <CommentInput post={post} />

      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block text-sky-500"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}

      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
