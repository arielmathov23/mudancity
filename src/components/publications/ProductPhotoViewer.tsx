'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils/cn';
import type { ProductPhotoViewerProps } from '@/types/feed';

export const ProductPhotoViewer = ({
  src,
  alt,
  priority = false,
  className,
  style,
}: ProductPhotoViewerProps) => {
  const [open, setOpen] = useState(false);

  const openFullscreen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      openFullscreen();
    },
    [openFullscreen],
  );

  return (
    <>
      <button
        type="button"
        aria-label={`Ver ${alt} en pantalla completa`}
        onDoubleClick={handleDoubleClick}
        className={cn(
          'relative block h-full w-full cursor-zoom-in select-none border-0 bg-transparent p-0',
          className,
        )}
        style={style}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="pointer-events-none object-cover"
          sizes="(max-width: 480px) 100vw, 420px"
          priority={priority}
          draggable={false}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="fixed inset-0 flex h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 items-center justify-center border-0 bg-neutral-950 p-0 shadow-none"
          onDoubleClick={() => setOpen(false)}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogClose
            aria-label="Cerrar pantalla completa"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-neutral-900/60 text-white transition-colors hover:bg-neutral-900/80"
          >
            <CloseIcon />
          </DialogClose>
          <div className="relative h-full w-full">
            <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" priority />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
