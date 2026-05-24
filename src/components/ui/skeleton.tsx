import { cn } from '@/lib/utils/cn';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse bg-neutral-200', className)} {...props} />
);
