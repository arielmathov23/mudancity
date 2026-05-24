import { cn } from '@/lib/utils/cn';

interface IconProps {
  className?: string;
}

export const HomeIcon = ({ className }: IconProps) => (
  <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" />
  </svg>
);

export const OffersIcon = ({ className }: IconProps) => (
  <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

export const AccountIcon = ({ className }: IconProps) => (
  <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const MovesIcon = ({ className }: IconProps) => (
  <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="7" width="18" height="13" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

export const AnalyticsIcon = ({ className }: IconProps) => (
  <svg className={cn('h-5 w-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19V5M4 19h16M8 17V11M12 17V7M16 17v-4" />
  </svg>
);

export const CopyIcon = ({ className }: IconProps) => (
  <svg className={cn('h-4 w-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

export const GridRulerIcon = ({ className }: IconProps) => (
  <svg className={cn('h-3 w-3', className)} viewBox="0 0 120 8" fill="currentColor">
    {Array.from({ length: 25 }).map((_, i) => (
      <rect key={i} x={i * 5} y={i % 5 === 0 ? 0 : 3} width="1" height={i % 5 === 0 ? 8 : 5} opacity="0.3" />
    ))}
  </svg>
);
