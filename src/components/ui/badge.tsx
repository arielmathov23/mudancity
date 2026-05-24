import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'open' | 'closed' | 'pending' | 'coordinated';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center border px-2 py-0.5 text-xs font-medium',
      variant === 'default' && 'border-line-soft bg-cream-100 text-foreground',
      variant === 'open' && 'border-teal-700 bg-teal-50 text-teal-800',
      variant === 'closed' && 'border-line-soft bg-cream-100 text-warm-muted',
      variant === 'pending' && 'border-amber-700 bg-amber-50 text-amber-800',
      variant === 'coordinated' && 'border-line bg-teal-600 text-white',
      className,
    )}
    {...props}
  />
);
