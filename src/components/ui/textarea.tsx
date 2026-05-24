import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[5rem] w-full border border-line bg-surface px-3 py-2 text-sm placeholder:text-warm-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
