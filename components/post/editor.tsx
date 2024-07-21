'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import './styles.css';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';

import { useSession } from '@/hooks/use-session';
import { useCreatePostMutation } from '@/mutation/post.mutation';

const Editor = () => {
  const { user } = useSession();

  const mutation = useCreatePostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "What's in your mind?" }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: `\n`,
    }) || '';

  const onSubmit = () => {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border dark:bg-neutral-900 p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} />
        <EditorContent
          editor={editor}
          className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-lg px-5 py-3"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || mutation.isPending}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default Editor;
