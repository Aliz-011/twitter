import { useInView } from 'react-intersection-observer';

import { cn } from '@/lib/utils';

interface Props extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

export const InfiniteScrollContainer = ({
  onBottomReached,
  children,
  className,
}: Props) => {
  const { ref } = useInView({
    rootMargin: '200px',
    onChange(inView, entry) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <div className={cn(className)}>
      {children}
      <div ref={ref} />
    </div>
  );
};
