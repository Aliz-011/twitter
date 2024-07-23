import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { CommentData, PostData } from '@/types';
import { useDeleteCommentMutation } from '@/mutation/comment.mutation';

type Props = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};

export const DeleteCommentDialog = ({ onClose, open, comment }: Props) => {
  const mutation = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="bg-rose-500"
            onClick={() =>
              mutation.mutate(comment.id, {
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
