import { cn } from '@/lib/utils/cn';

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'flex h-10 w-full border border-line bg-surface px-3 py-2 text-sm placeholder:text-warm-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
