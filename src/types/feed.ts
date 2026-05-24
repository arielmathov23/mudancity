import type { PublicationStatus } from '@/types/marketplace';

export type FeedItem = {
  id: string;
  moveId: string;
  publicationId: string;
  publicSlug: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  photoUrl: string | null;
  status: PublicationStatus;
};

export type FeedMoveGroup = {
  moveId: string;
  moveTitle: string;
  neighborhood: string | null;
  city: string | null;
  country: string | null;
  items: FeedItem[];
};

export type ActiveMoveItem = {
  itemId: string;
  name: string;
  price: number;
  currency: string;
  photoUrl: string | null;
  publicSlug: string;
};

export type ActiveMoveSummary = {
  moveId: string;
  moveTitle: string;
  totalOffers: number;
  items: ActiveMoveItem[];
};

export type OwnerMoveHomeSummary = {
  moveId: string;
  title: string;
  createdAt: string;
  publicationId: string | null;
  productCount: number;
  totalOffers: number;
};

export type MoveListCardProps = {
  move: OwnerMoveHomeSummary;
};

export type MoveSelectorCardProps = {
  move: OwnerMoveHomeSummary;
  isActive: boolean;
};

export type PublishCtaProps = {
  isAuthenticated: boolean;
  ownerMoves?: OwnerMoveHomeSummary[];
};

export type MoveFeedRowProps = {
  group: FeedMoveGroup;
  isAuthenticated: boolean;
  isOwnMove?: boolean;
};

export type PublicHomeFeedProps = {
  feedGroups: FeedMoveGroup[];
  isAuthenticated: boolean;
  ownerMoveIds?: string[];
};

export type PublicFeedProduct = FeedItem & {
  moveTitle: string;
  neighborhood: string | null;
  city: string | null;
  country: string | null;
  publicationDescription: string | null;
  ownerId: string;
};

export type ProductFeedSlideProps = {
  product: PublicFeedProduct;
  isPriority?: boolean;
  isOwner?: boolean;
};

export type ProductVerticalFeedProps = {
  products: PublicFeedProduct[];
  initialIndex: number;
  currentUserId?: string | null;
  urlMode?: 'product' | 'gallery';
  galleryMoveId?: string | null;
  backHref?: string;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
};

export type FeedProductsPage = {
  products: PublicFeedProduct[];
  total: number;
  hasMore: boolean;
};

export type ProductGalleryFeedProps = {
  initialPage: FeedProductsPage;
  initialIndex: number;
  moveId: string | null;
  currentUserId?: string | null;
};

export type FeedProductsQuery = {
  moveId?: string;
  offset: number;
  limit: number;
};
