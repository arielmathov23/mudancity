import { cn } from '@/lib/utils/cn';

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('text-sm font-medium text-neutral-700', className)} {...props} />
);
