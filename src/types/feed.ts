import type { PublicationStatus } from '@/types/marketplace';

export type FeedItem = {
  id: string;
  moveId: string;
  publicationId: string;
  publicSlug: string;
  name: string;
  price: number;
  photoUrl: string | null;
  status: PublicationStatus;
};

export type FeedMoveGroup = {
  moveId: string;
  moveTitle: string;
  items: FeedItem[];
};

export type ActiveMoveItem = {
  itemId: string;
  name: string;
  price: number;
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

export type PublishCtaProps = {
  isAuthenticated: boolean;
  ownerMoves?: OwnerMoveHomeSummary[];
};
