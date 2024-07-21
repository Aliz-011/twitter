import { useDeletePostMutation } from '@/mutation/post.mutation';
import { PostData } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

export const DeletePostDialog = ({ onClose, open, post }: Props) => {
  const mutation = useDeletePostMutation(post);

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: () => {
                  onClose();
                },
              })
            }
            disabled={mutation.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
