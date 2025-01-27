import { Bookmark, Home, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { NotificationButton } from './notification-button';
import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import { MessagesButton } from './messages-button';
import streamServerClient from '@/lib/stream';

type Props = {
  className?: string;
};

export const MenuBar = async ({ className }: Props) => {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    client.notification.count({
      where: {
        recipientId: user.id,
        isRead: false,
      },
    }),

    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={cn(className)}>
      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};
