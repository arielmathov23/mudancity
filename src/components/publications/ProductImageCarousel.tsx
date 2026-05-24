'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { ProductImageCarouselProps } from '@/types/marketplace';

export const ProductImageCarousel = ({
  images,
  alt,
  topLeft,
  topRight,
}: ProductImageCarouselProps) => {
  const slides = images.length > 0 ? images : [null];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = slides.length > 1;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  return (
    <div className="space-y-2">
      <div className="relative aspect-square w-full overflow-hidden border border-line bg-cream-100">
        {slides[activeIndex] ? (
          <Image
            src={slides[activeIndex]!}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 420px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-warm-muted">
            Sin foto
          </div>
        )}

        {topLeft && <div className="absolute left-2 top-2 z-10">{topLeft}</div>}
        {topRight && <div className="absolute right-2 top-2 z-10">{topRight}</div>}

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-cream/80 to-transparent text-lg text-foreground"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-0 top-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l from-cream/80 to-transparent text-lg text-foreground"
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir a foto ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-1.5 w-1.5 border border-line transition-colors',
                index === activeIndex ? 'bg-foreground' : 'bg-transparent',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
