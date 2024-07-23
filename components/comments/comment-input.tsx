import { useState } from 'react';
import { Loader2, SendHorizonal } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useCreateCommentMutation } from '@/mutation/comment.mutation';
import { PostData } from '@/types';

type Props = {
  post: PostData;
};

export const CommentInput = ({ post }: Props) => {
  const [input, setInput] = useState('');

  const mutation = useCreateCommentMutation(post.id);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input) {
      return;
    }

    mutation.mutate(
      { post, content: input },
      {
        onSuccess() {
          setInput('');
        },
      }
    );
  };

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        className="cursor-pointer"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <SendHorizonal className="size-4" />
        )}
      </Button>
    </form>
  );
};
