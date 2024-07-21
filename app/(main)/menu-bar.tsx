import { Bell, Bookmark, Home, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const MenuBar = ({ className }: Props) => {
  return (
    <div className={cn(className)}>
      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        className="flex items-center justify-start gap-3"
        variant="ghost"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};
