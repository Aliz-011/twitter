'use client';

import { Camera } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';

import { CropImageDialog } from '@/components/crop-image-dialog';

type Props = {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
};

export const AvatarUpload = ({ onImageCropped, src }: Props) => {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image?: File) => {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      'WEBP',
      100,
      0,
      (url) => setImageToCrop(url as File),
      'file'
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="hidden sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="avatar"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/30 text-white transition-colors duration-200 group-hover:bg-black/25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          cropAspectRatio={1}
          src={URL.createObjectURL(imageToCrop)}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
    </>
  );
};
