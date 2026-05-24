import type { ReactNode } from 'react';

export type UserRole = 'owner' | 'buyer';

export type PublicationStatus = 'open' | 'closed';
export type PublicationType = 'bundle' | 'subset';
export type OfferResponse = 'accepted' | 'rejected';
export type CoordinationStatus = 'pending' | 'coordinated' | 'closed' | 'cancelled';

export type Profile = {
  id: string;
  role: UserRole;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  createdAt: string;
};

export type Move = {
  id: string;
  ownerId: string;
  title: string;
  createdAt: string;
};

export type Publication = {
  id: string;
  moveId: string;
  ownerId: string;
  title: string;
  description: string | null;
  status: PublicationStatus;
  type: PublicationType;
  publicSlug: string;
  createdAt: string;
  updatedAt: string;
};

export type Item = {
  id: string;
  publicationId: string;
  name: string;
  price: number;
  photoPath: string | null;
  photoUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type PublicationWithItems = Publication & {
  items: Item[];
  includedItemIds: string[];
};

export type Offer = {
  id: string;
  publicationId: string;
  moveId: string;
  buyerId: string;
  offeredPrice: number;
  createdAt: string;
  itemIds: string[];
};

export type OfferWithDetails = Offer & {
  items: Item[];
  response: OfferResponse | null;
  responseAt: string | null;
  coordinationStatus: CoordinationStatus | null;
  buyerContact: { email: string | null; phone: string | null } | null;
};

export type BuyerOffer = Offer & {
  publicationTitle: string;
  publicationSlug: string;
  response: OfferResponse | null;
  coordinationStatus: CoordinationStatus | null;
  coordinatedAt: string | null;
};

export type MoveKpis = {
  moveId: string;
  moveTitle: string;
  windowStart: string;
  windowEnd: string;
  totalPublications: number;
  publicationsWithOffers: number;
  offerRate: number;
  totalOffers: number;
  responsesUnder24h: number;
  responseRateUnder24h: number;
  acceptedOffers: number;
  coordinatedOffers: number;
  coordinationRate: number;
};

export type MoveWithProducts = {
  move: Move;
  publication: PublicationWithItems;
};

export type MoveProductsEditorProps = {
  moveTitle: string;
  publication: PublicationWithItems;
};

export type PublicProductDetail = {
  item: Item;
  publication: Publication;
  moveTitle: string;
};

export type ProductImageCarouselProps = {
  images: string[];
  alt: string;
  topLeft?: ReactNode;
  topRight?: ReactNode;
};

export type ShareProductButtonProps = {
  slug: string;
  itemId: string;
  title: string;
  compact?: boolean;
};

export type ProductDetailActionsBarProps = {
  slug: string;
  itemId: string;
  isOpen: boolean;
};

export type PublicationStatusBadgeProps = {
  status: PublicationStatus;
  compact?: boolean;
};

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };
