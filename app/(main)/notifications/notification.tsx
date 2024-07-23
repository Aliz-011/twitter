import { Heart, LucideIcon, MessageCircle, User2 } from 'lucide-react';
import Link from 'next/link';

import { UserAvatar } from '@/components/user-avatar';

import { cn } from '@/lib/utils';
import { NotificationData } from '@/types';
import { NotificationType } from '@prisma/client';

type Props = {
  notification: NotificationData;
};

export const Notification = ({ notification }: Props) => {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: LucideIcon; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you`,
      icon: User2,
      href: `/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post.`,
      icon: MessageCircle,
      href: `/${notification.recipient.username}/status/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} like your post.`,
      icon: Heart,
      href: `/${notification.issuer.username}`,
    },
  };

  const { message, href, icon: Icon } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          'flex gap-3 rounded-xl bg-card p-5 shadow-sm border transition-colors hover:bg-card/70',
          !notification.isRead && 'bg-sky-500/10'
        )}
      >
        <div className="my-1">
          <Icon
            className={cn(
              'size-7',
              Icon === Heart ? 'fill-rose-500 text-rose-500' : 'text-sky-700'
            )}
          />
        </div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} sizes="36" />
          <div>
            <span className="font-bold">
              {notification.issuer.displayName}&nbsp;
            </span>
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-2 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};
