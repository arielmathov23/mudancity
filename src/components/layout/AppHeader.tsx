import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { AppHeaderProps } from '@/types/layout';

export const AppHeader = ({
  title,
  description,
  actions,
  toolbar,
  backHref,
  backLabel = 'Volver',
  showBrand = true,
  className,
}: AppHeaderProps) => (
  <header className={cn('mb-4 border-b border-line pb-3', className)}>
    {showBrand && (
      <p className="text-xs font-mono uppercase tracking-widest text-teal-700">Mudancity</p>
    )}
    {backHref && (
      <Link
        href={backHref}
        className={cn('inline-block text-xs text-teal-700', showBrand ? 'mt-1' : 'mt-0')}
      >
        ← {backLabel}
      </Link>
    )}
    <div className={cn('flex items-start justify-between gap-3', backHref || showBrand ? 'pt-1.5' : 'pt-0')}>
      <div className="min-w-0 space-y-0.5">
        <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="truncate text-xs text-warm-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
    {toolbar && (
      <div className="mt-2 flex items-center justify-between gap-2">{toolbar}</div>
    )}
  </header>
);
