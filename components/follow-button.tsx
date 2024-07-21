'use client';

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useFollowerInfo } from '@/hooks/use-follower-info';
import { kyInstance } from '@/lib/ky';
import { FollowerInfo } from '@/types';

type Props = {
  userId: string;
  initialState: FollowerInfo;
};

export const FollowButton = ({ initialState, userId }: Props) => {
  const { data } = useFollowerInfo(userId, initialState);

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['follower-info', userId];

  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    async onMutate() {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
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
    <Button
      variant={data.isFollowedByUser ? 'secondary' : 'default'}
      onClick={() => mutation.mutate()}
      className="rounded-full"
    >
      {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
    </Button>
  );
};
