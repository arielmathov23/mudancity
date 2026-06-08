'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type UseProductFeedSnapParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  slideCount: number;
  initialIndex: number;
  onActiveIndexChange: (index: number) => void;
};

export const useProductFeedSnap = ({
  containerRef,
  slideCount,
  initialIndex,
  onActiveIndexChange,
}: UseProductFeedSnapParams) => {
  const activeIndexRef = useRef(initialIndex);
  const slideCountRef = useRef(slideCount);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  const [slideHeight, setSlideHeight] = useState(0);

  slideCountRef.current = slideCount;
  onActiveIndexChangeRef.current = onActiveIndexChange;

  const getSlideHeight = useCallback(() => {
    const measured = containerRef.current?.clientHeight ?? 0;
    return measured > 0 ? measured : slideHeight;
  }, [containerRef, slideHeight]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      const count = slideCountRef.current;
      const height = getSlideHeight();
      if (!container || count === 0 || height <= 0) return;

      const clamped = Math.max(0, Math.min(index, count - 1));
      container.scrollTo({ top: clamped * height, behavior: 'auto' });
      activeIndexRef.current = clamped;
      onActiveIndexChangeRef.current(clamped);
    },
    [containerRef, getSlideHeight],
  );

  const scrollToIndexRef = useRef(scrollToIndex);
  scrollToIndexRef.current = scrollToIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncSlideHeight = () => {
      const nextHeight = container.clientHeight;
      if (nextHeight > 0) {
        setSlideHeight(nextHeight);
      }
    };

    syncSlideHeight();
    const resizeObserver = new ResizeObserver(syncSlideHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef, slideCount]);

  const pendingInitialScrollRef = useRef(true);

  useEffect(() => {
    activeIndexRef.current = initialIndex;
    onActiveIndexChangeRef.current(initialIndex);
    pendingInitialScrollRef.current = true;
  }, [initialIndex]);

  useEffect(() => {
    if (slideHeight <= 0) return;

    if (pendingInitialScrollRef.current) {
      pendingInitialScrollRef.current = false;
      const frame = requestAnimationFrame(() => scrollToIndexRef.current(initialIndex));
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => scrollToIndexRef.current(activeIndexRef.current));
    return () => cancelAnimationFrame(frame);
  }, [slideHeight, initialIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncActiveIndex = () => {
      const height = container.clientHeight;
      if (height <= 0) return;

      const index = Math.round(container.scrollTop / height);
      const clamped = Math.max(0, Math.min(index, slideCountRef.current - 1));

      if (clamped !== activeIndexRef.current) {
        activeIndexRef.current = clamped;
        onActiveIndexChangeRef.current(clamped);
      }
    };

    container.addEventListener('scrollend', syncActiveIndex);

    let idleTimer: ReturnType<typeof setTimeout>;
    const handleScrollFallback = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(syncActiveIndex, 120);
    };

    const supportsScrollEnd = 'onscrollend' in window;
    if (!supportsScrollEnd) {
      container.addEventListener('scroll', handleScrollFallback, { passive: true });
    }

    return () => {
      container.removeEventListener('scrollend', syncActiveIndex);
      if (!supportsScrollEnd) {
        container.removeEventListener('scroll', handleScrollFallback);
        clearTimeout(idleTimer);
      }
    };
  }, [containerRef, slideCount]);

  return { slideHeight, scrollToIndex };
};
