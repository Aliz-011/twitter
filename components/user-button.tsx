'use client';

import Link from 'next/link';
import { Check, LogOut, MonitorCog, Moon, Sun, UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQueryClient } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';

import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/user.actions';

type Props = {
  className?: string;
};

export const UserButton = ({ className }: Props) => {
  const { user } = useSession();
  const { setTheme, theme } = useTheme();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn('flex-none rounded-full size-8', className)}>
          <UserAvatar avatarUrl={user.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem asChild>
          <Link href={`/${user.username}`} className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MonitorCog className="mr-2 h-4 w-4" />
            <span>Dark mode</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
                {theme === 'light' && (
                  <Check className="size-4 absolute right-2" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
                {theme === 'dark' && (
                  <Check className="size-4 absolute right-2" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <MonitorCog className="mr-2 h-4 w-4" />
                <span>System</span>
                {theme === 'system' && (
                  <Check className="size-4 absolute right-2" />
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOut className="mr-2 size-4" />
          Log out @{user.username}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
