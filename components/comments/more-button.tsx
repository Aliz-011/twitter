'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { CommentData } from '@/types';
import { DeleteCommentDialog } from './delete-comment-dialog';

export const MoreButton = ({
  comment,
  className,
}: {
  comment: CommentData;
  className?: string;
}) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <span className="flex items-center gap-3 text-rose-500">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        onClose={() => setShowDialog((prev) => !prev)}
        open={showDialog}
      />
    </>
  );
};
