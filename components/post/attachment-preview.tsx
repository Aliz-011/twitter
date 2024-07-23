import Image from 'next/image';
import { X } from 'lucide-react';

import { Attachment } from '@/hooks/use-media-upload';
import { cn } from '@/lib/utils';

type Props = {
  attachment: Attachment;
  onRemoveClick: () => void;
};

export const AttachmentPreview = ({ attachment, onRemoveClick }: Props) => {
  const src = URL.createObjectURL(attachment.file);

  return (
    <div
      className={cn(
        'relative mx-auto size-fit',
        attachment.isUploading && 'opacity-50'
      )}
    >
      {attachment.file.type.startsWith('image') && (
        <Image
          src={src}
          alt="attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-xl"
        />
      )}

      {attachment.file.type.startsWith('video') && (
        <video controls className="size-fit max-h-[30rem] rounded-xl">
          <source src={src} type={attachment.file.type} />
        </video>
      )}

      {!attachment.isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
