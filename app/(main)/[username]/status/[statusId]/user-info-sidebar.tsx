import Link from 'next/link';

import { FollowButton } from '@/components/follow-button';
import { Linkify } from '@/components/linkify';
import { UserAvatar } from '@/components/user-avatar';
import { UserTooltip } from '@/components/user-tooltip';

import { validateRequest } from '@/auth';
import { UserData } from '@/types';

export const UserInfoSidebar = async ({ user }: { user: UserData }) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="space-y-5 rounded-xl bg-card border p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <div className="flex items-center justify-between gap-3">
        <UserTooltip user={user}>
          <Link href={`/${user.username}`} className="flex items-center gap-3">
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />

            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground text-sm">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserTooltip>
        {user.id !== loggedInUser.id && (
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === loggedInUser.id
              ),
            }}
          />
        )}
      </div>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
    </div>
  );
};
