import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '@/components/user-avatar';
import { FollowButton } from '@/components/follow-button';

import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { getTrendingTropics } from '@/lib/queries';
import { formatNumber } from '@/lib/utils';
import { getUserDataSelect } from '@/types';

export const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden md:block lg:w-80 w-72 h-fit flex-none space-y-5">
      <Suspense
        fallback={
          <div className="space-y-4 flex items-center justify-center">
            <Loader2 className="animate-spin size-8" />
            <Loader2 className="animate-spin size-8" />
          </div>
        }
      >
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

const WhoToFollow = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const usersToFollow = await client.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm border">
      <h2 className="text-xl font-bold">Who to follow</h2>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
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

          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
};

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTropics();

  return (
    <div className="space-y-5 rounded-xl bg-card shadow-sm p-5 border">
      <h2 className="text-lg font-bold">Trending topics</h2>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split('#')[1];

        return (
          <Link href={`/hashtag/${title}`} key={title} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
