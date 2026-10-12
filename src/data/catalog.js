// Categories, badges, filters and other static catalogue metadata.

export const CATEGORIES = [
  { id: 'rings', label: 'Rings', image: '/images/ring1_plain.jpg', count: 6 },
  { id: 'necklaces', label: 'Necklaces', image: '/images/cat_necklaces.jpg', count: 8 },
  { id: 'earrings', label: 'Earrings', image: '/images/cat_earrings.jpg', count: 10 },
  { id: 'bracelets', label: 'Bracelets', image: '/images/cat_bracelets.jpg', count: 5 },
];

export const BADGE_CLASS = {
  Bestseller: 'b-best',
  Sale: 'b-sale',
  New: 'b-new',
  Limited: 'b-lim',
  Iconic: 'b-icon',
};

export const STONE_FILTERS = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'No Stone'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export const MAX_PRICE = 5000;
