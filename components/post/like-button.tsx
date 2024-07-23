'use client';

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { kyInstance } from '@/lib/ky';
import { LikeInfo } from '@/types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  postId: string;
  initialState: LikeInfo;
};

export const LikeButton = ({ initialState, postId }: Props) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['like-info', postId];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      query.data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
      <Heart
        className={cn(
          'size-5',
          query.data.isLikedByUser && 'text-rose-500 fill-rose-500'
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {query.data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};
