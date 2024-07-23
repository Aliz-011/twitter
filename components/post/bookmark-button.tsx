'use client';

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { kyInstance } from '@/lib/ky';
import { BookmarkInfo } from '@/types';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  postId: string;
  initialState: BookmarkInfo;
};

export const BookmarkButton = ({ initialState, postId }: Props) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['bookmark-info', postId];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      query.data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    async onMutate(variables) {
      toast.success(
        `${
          query.data.isBookmarkedByUser
            ? 'Removed from bookmarks'
            : 'Bookmarked'
        }`
      );
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);

      toast.error(error.message);
      console.error(error);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center gap-2"
    >
      <Bookmark
        className={cn(
          'size-5',
          query.data.isBookmarkedByUser && 'text-sky-500 fill-sky-500'
        )}
      />
    </button>
  );
};
