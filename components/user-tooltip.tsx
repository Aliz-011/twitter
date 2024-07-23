'use client';

import Link from 'next/link';

import { FollowButton } from '@/components/follow-button';
import { FollowerCount } from '@/components/follower-count';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { UserAvatar } from './user-avatar';
import { UserData } from '@/types';
import { useSession } from '@/hooks/use-session';

export const UserTooltip = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserData;
}) => {
  const { user: loggedInUser } = useSession();

  const followerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id
    ),
  };
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4 space-y-2">
          <UserAvatar avatarUrl={user.avatarUrl} className="size-16" />
          {user.id === loggedInUser.id ? undefined : (
            <FollowButton initialState={followerInfo} userId={user.id} />
          )}
        </div>

        <div>
          <Link href={`/${user.username}`} className="hover:underline">
            <h4 className="text-xl font-semibold">{user.displayName}</h4>
          </Link>
          <Link href={`/${user.username}`}>
            <p className="text-muted-foreground">@{user.username}</p>
          </Link>
          {user.bio && <p className="text-sm">{user.bio}</p>}
          <div className="flex items-center gap-x-4 pt-2">
            <p className="font-semibold text-sm">
              0&nbsp;<span className="font-normal">Following</span>
            </p>
            <FollowerCount
              initialState={followerInfo}
              userId={user.id}
              className="text-sm"
            />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
