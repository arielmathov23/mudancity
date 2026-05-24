/** Number of products loaded per gallery page. */
export const FEED_PAGE_SIZE = 5;

export const EXPLORE_PATH = '/explorar';

export const getExplorePath = (moveId?: string, itemId?: string) => {
  const params = new URLSearchParams();
  if (moveId) params.set('moveId', moveId);
  if (itemId) params.set('item', itemId);
  const query = params.toString();
  return query ? `${EXPLORE_PATH}?${query}` : EXPLORE_PATH;
};
