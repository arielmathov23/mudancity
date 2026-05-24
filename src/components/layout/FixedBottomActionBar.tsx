import { FIXED_BOTTOM_ACTION_BAR_CLASS } from '@/constants/layout';
import { cn } from '@/lib/utils/cn';
import type { FixedBottomActionBarProps } from '@/types/layout';

export const FixedBottomActionBar = ({ children, className }: FixedBottomActionBarProps) => (
  <div className={cn(FIXED_BOTTOM_ACTION_BAR_CLASS, className)}>{children}</div>
);
