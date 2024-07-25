'use client';

import { Loader2 } from 'lucide-react';
import { Chat as StreamChat } from 'stream-chat-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import 'stream-chat-react/dist/css/v2/index.css';

import { useInitializeChatClient } from '@/hooks/use-initialize-chat-client';
import { ChatSidebar } from './chat-sidebar';
import { ChatChannel } from './chat-channel';

export const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme } = useTheme();
  const chatClient = useInitializeChatClient();

  if (!chatClient) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <main className="relative w-full overflow-hidden rounded-xl bg-card border shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          theme={
            theme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light'
          }
          client={chatClient}
        >
          <ChatSidebar
            open={showSidebar}
            onClose={() => setShowSidebar(false)}
          />
          <ChatChannel
            open={!showSidebar}
            onOpenSidebar={() => setShowSidebar(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};
