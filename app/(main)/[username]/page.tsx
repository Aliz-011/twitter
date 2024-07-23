import { formatDate } from 'date-fns';
import { CalendarDays } from 'lucide-react';

import { FollowerCount } from '@/components/follower-count';
import { TrendsSidebar } from '@/components/trends-sidebar';
import { UserAvatar } from '@/components/user-avatar';
import { FollowButton } from '@/components/follow-button';
import { Linkify } from '@/components/linkify';
import { UserPosts } from './user-posts';

import { validateRequest } from '@/auth';
import { getUser } from '@/lib/queries';
import { formatNumber } from '@/lib/utils';
import { EditProfileButton } from './edit-profile-button';

export const generateMetadata = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
};

const UserPage = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  const followerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id
    ),
  };

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="h-fit w-full space-y-5 rounded-xl bg-card p-5 shadow-sm border">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            sizes="250"
            className="mx-auto size-full max-h-60 max-w-60 w-full"
          />

          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="me-auto space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              {user.bio && (
                <>
                  <Linkify>
                    <div className="whitespace-pre-line overflow-hidden break-words">
                      {user.bio}
                    </div>
                  </Linkify>
                </>
              )}
              <div className="text-muted-foreground font-medium text-sm flex items-center">
                <CalendarDays className="size-5 mr-2" />
                Joined {formatDate(user.createdAt, 'MMM yyyy')}
              </div>

              <div className="flex items-center gap-3">
                <p className="font-semibold">
                  {formatNumber(user._count.posts)}{' '}
                  <span className="font-normal">
                    {user._count.posts > 1 ? 'posts' : 'post'}
                  </span>
                </p>
                <FollowerCount initialState={followerInfo} userId={user.id} />
              </div>
            </div>

            {user.id === loggedInUser.id ? (
              <EditProfileButton user={user} />
            ) : (
              <FollowButton initialState={followerInfo} userId={user.id} />
            )}
          </div>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default UserPage;
