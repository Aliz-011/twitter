import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

import { useSession } from './use-session';
import { kyInstance } from '@/lib/ky';

export const useInitializeChatClient = () => {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get(`/api/get-token`)
            .json<{ token: string }>()
            .then((response) => response.token)
      )
      .catch((error) => {
        console.error('Failed to connect user: ' + error);
      })
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client.disconnectUser().catch((error) => {
        console.error(error);
      });
    };
  }, [user]);

  return chatClient;
};
