'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-neutral-900/40', className)}
    {...props}
  />
);

export const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-line bg-cream-50 p-4 shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('space-y-1 pb-4', className)} {...props} />
);

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title className={cn('text-lg font-semibold text-foreground', className)} {...props} />
);

export const DialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description className={cn('text-sm text-warm-muted', className)} {...props} />
);
