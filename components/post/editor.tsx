'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useDropzone } from '@uploadthing/react';
import { ClipboardEvent } from 'react';

import './styles.css';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { AttachmentButton } from './attachment-button';
import { AttachmentPreviews } from './attachment-previews';
import { Progress } from '@/components/ui/progress';

import { useSession } from '@/hooks/use-session';
import { useCreatePostMutation } from '@/mutation/post.mutation';
import { useMediaUpload } from '@/hooks/use-media-upload';
import { cn } from '@/lib/utils';

const Editor = () => {
  const { user } = useSession();

  const mutation = useCreatePostMutation();

  const {
    attachments,
    isUploading,
    removeattachments,
    reset: resetMediaUpload,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

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
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      }
    );
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border dark:bg-neutral-900 p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            onPaste={onPaste}
            className={cn(
              'w-full max-h-[20rem] overflow-y-auto bg-background rounded-lg px-5 py-3',
              isDragActive && 'outline-dashed'
            )}
          />
          <input {...getInputProps()} />
        </div>
      </div>

      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeattachments}
        />
      )}

      <div className="flex justify-end gap-3 items-center">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>

            <Progress value={uploadProgress} />
          </>
        )}
        <AttachmentButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 4}
        />
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || mutation.isPending || isUploading}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default Editor;
