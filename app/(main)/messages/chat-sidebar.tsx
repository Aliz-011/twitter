import React, { useCallback, useEffect, useState } from 'react';
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from 'stream-chat-react';
import { MailPlus, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { NewChatDialog } from './new-chat-dialog';

import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';

export const ChatSidebar = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
    }
  }, [channel?.id, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={cn(
        'size-full md:flex flex-col border-e md:w-72',
        open ? 'flex' : 'hidden'
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        sort={{ last_message_at: -1 }}
        filters={{ members: { $in: [user.id] }, type: 'messaging' }}
        options={{ state: true, presence: true, limit: 8 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
        showChannelSearch
      />
    </div>
  );
};

const MenuHeader = ({ onClose }: { onClose: () => void }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          onClick={() => setShowDialog(true)}
          size="icon"
          variant="ghost"
          title="Start new chat"
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showDialog && (
        <NewChatDialog
          onOpenChange={setShowDialog}
          onChatCreated={() => {
            setShowDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
