export type MoveLocationFields = {
  neighborhood: string | null;
  city: string | null;
  country: string | null;
};

export const formatMoveLocation = (location: MoveLocationFields): string | null => {
  const parts = [location.neighborhood, location.city, location.country].filter(
    (part): part is string => Boolean(part?.trim()),
  );

  return parts.length > 0 ? parts.join(', ') : null;
};

export const hasCompleteMoveLocation = (location: MoveLocationFields): boolean =>
  Boolean(location.neighborhood?.trim() && location.city?.trim() && location.country?.trim());
