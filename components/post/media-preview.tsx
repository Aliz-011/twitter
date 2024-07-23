import { Attachment } from '@/hooks/use-media-upload';
import { Media } from '@prisma/client';
import Image from 'next/image';

type Props = {
  media: Media;
};

export const MediaPreview = ({ media }: Props) => {
  if (media.type === 'IMAGE') {
    return (
      <Image
        src={media.url}
        alt="attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-xl"
      />
    );
  }

  if (media.type === 'VIDEO') {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-xl"
        />
      </div>
    );
  }
  return <p>Unsupported media type</p>;
};
