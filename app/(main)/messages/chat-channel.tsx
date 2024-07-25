import { Menu } from 'lucide-react';
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenSidebar: () => void;
};

export const ChatChannel = ({ open, onOpenSidebar }: Props) => {
  return (
    <div className={cn('w-full md:block', !open && 'hidden')}>
      <Channel>
        <Window>
          <CustomeChannelHeader onOpenSidebar={onOpenSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

interface CustomChannelHeader extends ChannelHeaderProps {
  onOpenSidebar: () => void;
}

const CustomeChannelHeader = ({
  onOpenSidebar,
  ...props
}: CustomChannelHeader) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="p-2 h-full md:hidden">
        <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
};
