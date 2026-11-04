// Product catalogue. Live store: filled from GET /products and GET /home at start-up.
// Detail data (gallery, description, reviews…) is fetched per product with GET /products/{id}.

import { mapProduct, mapReview } from '../api/mappers';

const fill = (target, items) => target.splice(0, target.length, ...(items ?? []));

export const PRODUCTS = [];
export const FEATURED_IDS = [];
export const NEW_ARRIVAL_IDS = [];

// Rating distribution shown in the reviews summary (admin-managed content).
export const RATING_DISTRIBUTION = [];

export function hydrateProducts(list, home) {
  fill(PRODUCTS, list.map(mapProduct));
  fill(FEATURED_IDS, (home?.featured_products ?? []).map((p) => mapProduct(p).id));
  fill(NEW_ARRIVAL_IDS, (home?.new_arrivals ?? []).map((p) => mapProduct(p).id));
}

/** Merge a full product (GET /products/{id}) into the store and return it. */
export function upsertProduct(apiProduct) {
  const mapped = mapProduct(apiProduct);
  const i = PRODUCTS.findIndex((p) => p.id === mapped.id);
  if (i >= 0) PRODUCTS[i] = { ...PRODUCTS[i], ...mapped };
  else PRODUCTS.push(mapped);
  if (apiProduct.rating_distribution) fill(RATING_DISTRIBUTION, apiProduct.rating_distribution);
  return {
    ...mapped,
    related: (apiProduct.related ?? []).map(mapProduct),
    productReviews: (apiProduct.reviews ?? []).map(mapReview),
  };
}

/** Merges a product list page (GET /products, /search) into the store; keeps detail-only fields already loaded. */
export function mergeProducts(apiList) {
  return apiList.map((apiProduct) => {
    const mapped = mapProduct(apiProduct);
    const i = PRODUCTS.findIndex((p) => p.id === mapped.id);
    if (i < 0) {
      PRODUCTS.push(mapped);
      return mapped;
    }
    const prev = PRODUCTS[i];
    PRODUCTS[i] = prev.detailed
      ? { ...mapped, description: prev.description, details: prev.details, gallery: prev.gallery, sizes: prev.sizes, detailed: true }
      : mapped;
    return PRODUCTS[i];
  });
}

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id || p.slug === id || String(p.apiId) === String(id));
export const getProductsByIds = (ids) => ids.map(getProductById).filter(Boolean);
