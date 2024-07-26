'use client';

import Link from 'next/link';

import { UserTooltip } from '@/components/user-tooltip';
import { UserAvatar } from '@/components/user-avatar';
import { MoreButton } from '@/components/comments/more-button';

import { CommentData } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { useSession } from '@/hooks/use-session';

type Props = {
  comment: CommentData;
};

export const Comment = ({ comment }: Props) => {
  const { user } = useSession();
  return (
    <div className="flex gap-3 justify-between group/comment">
      <div className="flex gap-3 py-3">
        <div className="hidden sm:inline">
          <UserTooltip user={comment.user}>
            <Link href={`/${comment.user.username}`}>
              <UserAvatar avatarUrl={comment.user.avatarUrl} sizes="40" />
            </Link>
          </UserTooltip>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <UserTooltip user={comment.user}>
              <Link
                href={`/${comment.user.username}`}
                className="font-semibold hover:underline"
              >
                {comment.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground text-sm">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          <div>{comment.content}</div>
        </div>
      </div>

      {comment.user.id === user.id && (
        <MoreButton
          comment={comment}
          className="opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
};
