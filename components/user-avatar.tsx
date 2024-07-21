import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const UserAvatar = ({
  avatarUrl,
  sizes = '20',
  className,
}: {
  avatarUrl: string | null;
  className?: string;
  sizes?: string;
}) => {
  return (
    <Avatar
      className={cn(
        'aspect-square h-fit flex-none rounded-full bg-secondary',
        className
      )}
    >
      <AvatarImage
        src={avatarUrl ? avatarUrl : 'https://github.com/shadcn.png'}
        sizes={sizes}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
