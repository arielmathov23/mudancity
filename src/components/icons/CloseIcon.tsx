import { cn } from '@/lib/utils/cn';

type CloseIconProps = {
  className?: string;
};

export const CloseIcon = ({ className }: CloseIconProps) => (
  <svg
    className={cn('h-5 w-5', className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
