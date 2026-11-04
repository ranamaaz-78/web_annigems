// Testimonials (home page). Live store: filled from GET /home at start-up.
// Product reviews come with GET /products/{id}.

import { mapTestimonial } from '../api/mappers';

export const TESTIMONIALS = [];

export function hydrateTestimonials(list) {
  TESTIMONIALS.splice(0, TESTIMONIALS.length, ...(list ?? []).map(mapTestimonial));
}
