import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react';
import { useState } from 'react';
import { UserResponse } from 'stream-chat';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Loader2, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserAvatar } from '@/components/user-avatar';
import { useSession } from '@/hooks/use-session';

import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';

type Props = {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
};

export const NewChatDialog = ({ onChatCreated, onOpenChange }: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);
  const { client, setActiveChannel } = useChatContext();

  const { user: loggedInUser } = useSession();
  const searchInputDebounced = useDebounce(searchInput);
  const { data, isError, isFetching, isSuccess, isLoading } = useQuery({
    queryKey: ['stream-users', searchInputDebounced],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: 'admin' },
          ...(searchInputDebounced
            ? {
                $or: [
                  {
                    name: { $autocomplete: searchInputDebounced },
                  },
                  {
                    username: { $autocomplete: searchInputDebounced },
                  },
                ],
              }
            : {}),
        },
        {
          name: 1,
          username: 1,
        },
        { limit: 15 }
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel('messaging', {
        members: [loggedInUser.id, ...selectedUsers.map((u) => u.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ', ' +
              selectedUsers.map((u) => u.displayName).join(', ')
            : undefined,
      });

      await channel.create();
      return channel;
    },
    onSuccess(data) {
      setActiveChannel(data);
      onChatCreated();
    },
    onError(error) {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border bg-card">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>

        <div>
          <div className="group relative">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              placeholder="Search user"
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    );
                  }}
                  className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
                >
                  <UserAvatar avatarUrl={user.image} sizes="24" />
                  <p className="font-bold">{user.name}</p>
                  <X className="mx-auto size-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((item) => item.id === user.id)
                        ? prev.filter((item) => item.id !== user.id)
                        : [...prev, user]
                    );
                  }}
                  selected={selectedUsers.some((item) => item.id === user.id)}
                />
              ))}

            {isSuccess && data.users.length <= 0 && (
              <p className="my-3 text-center text-muted-foreground">
                No users found.
              </p>
            )}
            {isFetching && <Loader2 className="my-3 animate-spin mx-auto" />}
            {isError && (
              <p className="text-rose-500 text-center my-3">
                An error occured while load the users
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <Button
            disabled={selectedUsers.length <= 0 || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="rounded-full"
          >
            {mutation.isPending && <Loader2 className="animate-spin mr-2" />}
            Start chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserResult = ({
  user,
  onClick,
  selected,
}: {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-sky-500" />}
    </button>
  );
};
