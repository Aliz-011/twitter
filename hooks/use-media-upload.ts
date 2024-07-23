import { useState } from 'react';
import { toast } from 'sonner';

import { useUploadThing } from '@/lib/uploadthing';

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export const useMediaUpload = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing('attachment', {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split('.').pop();

        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          }
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((rf) => ({ file: rf, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) {
            return a;
          }

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        })
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((p) => !p.isUploading));
      toast.error(e.message);
    },
  });

  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast.error('Please wait the current upload to finish');
      return;
    }

    if (attachments.length + files.length > 4) {
      toast.error('You can only upload 4 files per post!');
      return;
    }

    startUpload(files);
  };

  const removeattachments = (fileName: string) => {
    setAttachments((prev) => prev.filter((p) => p.file.name !== fileName));
  };

  const reset = () => {
    setAttachments([]);
    setUploadProgress(undefined);
  };

  return {
    startUpload: handleStartUpload,
    attachments,
    uploadProgress,
    isUploading,
    removeattachments,
    reset,
  };
};
