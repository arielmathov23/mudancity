import { cn } from '@/lib/utils/cn';

export const Separator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('h-px w-full shrink-0 bg-line', className)} {...props} />
);
