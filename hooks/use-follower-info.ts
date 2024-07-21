import { useQuery } from '@tanstack/react-query';

import { kyInstance } from '@/lib/ky';
import { FollowerInfo } from '@/types';

export const useFollowerInfo = (userId: string, initialState: FollowerInfo) => {
  const query = useQuery({
    queryKey: ['follower-info', userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
