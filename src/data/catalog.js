// Categories, badges, filters and sort options.
// Live store: filled from GET /bootstrap and GET /home at start-up.

import { major, mapCategory } from '../api/mappers';

const fill = (target, items) => target.splice(0, target.length, ...(items ?? []));

export const CATEGORIES = [];

export const BADGE_CLASS = {
  Bestseller: 'b-best',
  Sale: 'b-sale',
  New: 'b-new',
  Limited: 'b-lim',
  Iconic: 'b-icon',
};

export const STONE_FILTERS = [];
export const SORT_OPTIONS = [];
export let MAX_PRICE = 5000;

export function hydrateCatalog(bootstrap, categories) {
  fill(STONE_FILTERS, bootstrap.catalog?.stone_filters);
  fill(SORT_OPTIONS, bootstrap.catalog?.sort_options);
  MAX_PRICE = major(bootstrap.catalog?.max_price) || MAX_PRICE;
  fill(CATEGORIES, (categories ?? []).map(mapCategory));
}
