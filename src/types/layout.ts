import type { ReactNode } from 'react';

export type AppHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  backHref?: string;
  backLabel?: string;
  showBrand?: boolean;
  className?: string;
};

export type AppShellProps = {
  children: ReactNode;
  showNav?: boolean;
  header?: AppHeaderProps;
  contentClassName?: string;
};
