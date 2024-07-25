'use client';

import { useQuery } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { kyInstance } from '@/lib/ky';
import { MessageCount } from '@/types';

export const MessagesButton = ({
  initialState,
}: {
  initialState: MessageCount;
}) => {
  const query = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () =>
      kyInstance.get(`/api/messages/unread-count`).json<MessageCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      className="flex items-center justify-start gap-3"
      variant="ghost"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!query.data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full text-white bg-sky-500 text-primary-foreground px-1 text-xs font-medium tabular-nums">
              {query.data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};
