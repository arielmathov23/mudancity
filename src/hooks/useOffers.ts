'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { CreateOfferInput } from '@/lib/validation/schemas';
import type { OfferWithDetails, MoveKpis } from '@/types/marketplace';

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOfferInput) =>
      authenticatedFetch<{ offerId: string }>('/offers', { method: 'POST', data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const usePublicationOffers = (publicationId: string) =>
  useQuery({
    queryKey: ['offers', publicationId],
    queryFn: () =>
      authenticatedFetch<OfferWithDetails[]>(`/offers?publicationId=${publicationId}`),
    enabled: !!publicationId,
  });

export const useOwnerOffers = () =>
  useQuery({
    queryKey: ['offers', 'owner'],
    queryFn: () => authenticatedFetch<OfferWithDetails[]>('/offers'),
  });

export const useRespondOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, response }: { offerId: string; response: 'accepted' | 'rejected' }) =>
      authenticatedFetch(`/offers/${offerId}/respond`, {
        method: 'POST',
        data: { response },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useMarkCoordinated = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) =>
      authenticatedFetch(`/coordinations/${offerId}`, {
        method: 'PATCH',
        data: { status: 'coordinated' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics'],
    queryFn: () => authenticatedFetch<MoveKpis[]>('/analytics'),
  });
