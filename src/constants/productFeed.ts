/** Height of the fixed bottom nav bar (matches MobileNavBar + safe area offset in layout). */
export const PRODUCT_FEED_NAV_OFFSET = 'calc(3.25rem + env(safe-area-inset-bottom))';

/** Scroll container height: full viewport minus bottom nav. */
export const PRODUCT_FEED_SCROLL_HEIGHT = `calc(100dvh - ${PRODUCT_FEED_NAV_OFFSET})`;

/** CSS class for the snap scroll container. */
export const PRODUCT_FEED_SCROLL_CLASS = 'product-feed-scroll';

/** CSS class for each full-height snap slide. */
export const PRODUCT_FEED_SLIDE_CLASS = 'product-feed-slide';

/** Minimum space reserved for title, price, location and CTA below the photo. */
export const PRODUCT_FEED_DETAILS_RESERVE = '14rem';

/** IntersectionObserver threshold for activating a slide (legacy fallback). */
export const PRODUCT_FEED_ACTIVE_THRESHOLD = 0.55;
