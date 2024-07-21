import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { PostData } from '@/types';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { DeletePostDialog } from './delete-post-dialog';

export const MoreButton = ({
  post,
  className,
}: {
  post: PostData;
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
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        onClose={() => setShowDialog((prev) => !prev)}
        open={showDialog}
      />
    </>
  );
};
