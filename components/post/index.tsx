'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MessagesSquare } from 'lucide-react';

import { UserAvatar } from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Linkify } from '@/components/linkify';
import { Comments } from '@/components/comments';
import { UserTooltip } from '@/components/user-tooltip';
import { MoreButton } from './more-button';
import { MediaPreview } from './media-preview';
import { LikeButton } from './like-button';
import { BookmarkButton } from './bookmark-button';

import { PostData } from '@/types';
import { cn, formatRelativeDate } from '@/lib/utils';
import { useSession } from '@/hooks/use-session';

type Props = {
  post: PostData;
};

export const Post = ({ post }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-xl bg-card border p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/${post.user.username}`} className="flex items-center">
              <UserAvatar
                avatarUrl={post.user.avatarUrl}
                className="flex-none"
              />
            </Link>
          </UserTooltip>

          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/${post.user.username}`}
                className="font-medium hover:underline block"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/${post.user.username}/status/${post.id}`}
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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      <div
        className={cn(
          'flex flex-col gap-3',
          post.attachments.length > 1 && 'sm:grid sm:grid-cols-2'
        )}
      >
        {!!post.attachments.length &&
          post.attachments.map((att) => (
            <MediaPreview key={att.id} media={att} />
          ))}
      </div>
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <button
            className="flex items-center gap-2"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <MessagesSquare className="size-5" />
            <span className="text-sm font-medium tabular-nums">
              {post._count.comments}{' '}
              <span className="hidden sm:inline">comments</span>
            </span>
          </button>

          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((p) => p.userId === user.id),
            }}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
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
