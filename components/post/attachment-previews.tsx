import { AttachmentPreview } from './attachment-preview';

import { Attachment } from '@/hooks/use-media-upload';
import { cn } from '@/lib/utils';

type Props = {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
};

export const AttachmentPreviews = ({
  attachments,
  removeAttachment,
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        attachments.length > 1 && 'sm:grid sm:grid-cols-2'
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
};
