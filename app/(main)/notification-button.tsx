'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { NotificationCount } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { kyInstance } from '@/lib/ky';

type Props = {
  initialState: NotificationCount;
};

export const NotificationButton = ({ initialState }: Props) => {
  const query = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () =>
      kyInstance
        .get(`/api/notifications/unread-count`)
        .json<NotificationCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      className="flex items-center justify-start gap-3"
      variant="ghost"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!query.data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-sky-500 text-primary-foreground px-1 text-xs font-medium tabular-nums">
              {query.data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};
