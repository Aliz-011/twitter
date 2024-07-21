'use client';

import { useFollowerInfo } from '@/hooks/use-follower-info';
import { cn, formatNumber } from '@/lib/utils';
import { FollowerInfo } from '@/types';

type Props = {
  userId: string;
  initialState: FollowerInfo;
  className?: string;
};

export const FollowerCount = ({ initialState, userId, className }: Props) => {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <p className={cn('font-semibold', className)}>
      {formatNumber(data.followers)}{' '}
      <span className="font-normal">
        {data.followers > 1 ? 'Followers' : 'Follower'}
      </span>
    </p>
  );
};
