import Link from 'next/link';

import { UserAvatar } from '@/components/user-avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/components/follow-button';
import { FollowerCount } from '@/components/follower-count';
import { MoreButton } from './more-button';

import { PostData } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { useSession } from '@/hooks/use-session';

type Props = {
  post: PostData;
};

export const Post = ({ post }: Props) => {
  const { user } = useSession();

  const followerInfo = {
    followers: post.user._count.followers,
    isFollowedByUser: post.user.followers.some(
      ({ followerId }) => followerId === user.id
    ),
  };

  return (
    <article className="group/post space-y-3 rounded-xl bg-card border p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/${post.user.username}`} className="flex items-center">
            <UserAvatar avatarUrl={post.user.avatarUrl} className="flex-none" />
          </Link>

          <div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={`/${post.user.username}`}
                  className="font-medium hover:underline block"
                >
                  {post.user.displayName}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4 space-y-2">
                  <UserAvatar
                    avatarUrl={post.user.avatarUrl}
                    className="size-16"
                  />
                  {user.id === post.user.id ? undefined : (
                    <FollowButton
                      initialState={followerInfo}
                      userId={user.id}
                    />
                  )}
                </div>

                <div>
                  <Link
                    href={`/${post.user.username}`}
                    className="hover:underline"
                  >
                    <h4 className="text-xl font-semibold">
                      {post.user.displayName}
                    </h4>
                  </Link>
                  <Link href={`/${post.user.username}`}>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </Link>
                  {post.user.bio && <p className="text-sm">{post.user.bio}</p>}
                  <div className="flex items-center gap-x-4 pt-2">
                    <p className="font-semibold text-sm">
                      2&nbsp;<span className="font-normal">Following</span>
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

            <Link
              href={`/posts/${post.id}`}
              className="text-sm block text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>

        {post.user.id === user.id && (
          <MoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export const PostSkeleton = () => (
  <div className="w-full animate-pulse space-y-3 rounded-xl bg-card p-5 shadow-sm border">
    <div className="flex flex-wrap gap-3">
      <Skeleton className="size-12 rounded-full" />

      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>

    <Skeleton className="h-16 rounded" />
  </div>
);
