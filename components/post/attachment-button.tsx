import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = {
  onFilesSelected: (file: File[]) => void;
  disabled: boolean;
};

export const AttachmentButton = ({ disabled, onFilesSelected }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="text-sky-500 hover:text-sky-500"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = '';
          }
        }}
      />
    </>
  );
};
