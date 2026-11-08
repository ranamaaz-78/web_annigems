// Brand, navigation, footer, contact and store settings.
// Live store: filled from GET /bootstrap and GET /home at start-up (see src/api/hydrate.js).
// Export names are unchanged so components keep importing them as before.

import { major, mapShippingMethod } from '../api/mappers';

const fill = (target, items) => target.splice(0, target.length, ...(items ?? []));

export const BRAND = { name: 'AANI GEMAS', logo: '', tagline: ['', ''], since: '' };

// Live gold rate (EUR per troy oz, converted to the display currency by the API).
export const GOLD_RATE = { perOz: 0, source: 'manual', updatedAt: null };

export const USP_ITEMS = [];
export const MEGA_MENU = { columns: [], featured: null };
export const MOBILE_NAV = [];
export const FOOTER_COLUMNS = [];
export const FOOTER_LEGAL_LINKS = [];
export const CONTACT = { address: '', phone: '', email: '', hours: '', whatsapp: '', mapSrc: '' };
export const CONTACT_TOPICS = [];
export const PAYMENT_BADGES = [];
export const SHIPPING_POLICY = [];
export const CARE_INSTRUCTIONS = [];
export const TRUST_POINTS = [];
export const SHIPPING_METHODS = [];

// Country names for the selects; COUNTRY_LIST keeps the ISO codes the API expects.
export const COUNTRIES = [];
export const COUNTRY_LIST = [];
export const countryCode = (name) => COUNTRY_LIST.find((c) => c.name === name || c.code === name)?.code ?? name;

export let FREE_SHIPPING_THRESHOLD = 0;
export let TAX_RATE = 0;
export let CURRENCY = 'EUR';
export let STRIPE_KEY = null;
export let GOOGLE_CLIENT_ID = null;

// TEMPORARY: cash on delivery only, while Stripe is not set up (the API needs COD_ENABLED=true).
// To bring card payments (Stripe) back, set this to true; the card tab and Stripe code return as they were.
export const CARD_PAYMENTS_ENABLED = false;

// UPI / net banking are not offered by the payment provider.
export const PAYMENT_TABS = CARD_PAYMENTS_ENABLED
  ? [{ id: 'card', label: '💳 Credit Card' }]
  : [{ id: 'cod', label: '💵 Cash on Delivery' }];

// Home page copy blocks
export const HOME = { hero: {}, categorySection: {}, designRingBanner: {}, testimonialsSection: {} };
export const SERVICES = [];

export function hydrateSite(b) {
  Object.assign(BRAND, b.brand ?? {});
  GOLD_RATE.perOz = major(b.gold_rate?.per_oz);
  GOLD_RATE.source = b.gold_rate?.source;
  GOLD_RATE.updatedAt = b.gold_rate?.updated_at;
  Object.assign(MEGA_MENU, b.navigation?.mega_menu ?? {});
  fill(MOBILE_NAV, b.navigation?.mobile);
  fill(FOOTER_COLUMNS, b.footer?.columns);
  fill(FOOTER_LEGAL_LINKS, b.footer?.legal_links);
  const c = b.contact ?? {};
  Object.assign(CONTACT, { address: c.address, phone: c.phone, email: c.email, hours: c.hours, whatsapp: c.whatsapp, mapSrc: c.map_embed_url });
  fill(CONTACT_TOPICS, b.contact_topics);
  fill(PAYMENT_BADGES, b.payment_badges);
  fill(TRUST_POINTS, b.trust_points);
  fill(SHIPPING_METHODS, (b.shipping_methods ?? []).map(mapShippingMethod));
  fill(COUNTRY_LIST, b.countries);
  fill(COUNTRIES, (b.countries ?? []).map((x) => x.name));
  FREE_SHIPPING_THRESHOLD = major(b.free_shipping_threshold);
  TAX_RATE = Number(b.tax_rate) || 0;
  CURRENCY = b.free_shipping_threshold?.currency || 'EUR';
  STRIPE_KEY = b.stripe_publishable_key || null;
  GOOGLE_CLIENT_ID = typeof b.google_client_id === 'string' ? b.google_client_id : b.google_client_id?.web ?? null;
}

export function hydrateHome(h) {
  fill(USP_ITEMS, h.usp_items);
  HOME.hero = h.hero ?? {};
  HOME.categorySection = h.category_section ?? {};
  HOME.designRingBanner = h.design_ring_banner ?? {};
  HOME.testimonialsSection = h.testimonials_section ?? {};
}

export function hydrateProductPagePoints({ shipping_points: shipping, care_instructions: care }) {
  if (shipping) fill(SHIPPING_POLICY, shipping);
  if (care) fill(CARE_INSTRUCTIONS, care);
}

export const hydrateServices = (list) => fill(SERVICES, list);
