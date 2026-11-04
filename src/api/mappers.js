// Map API resources to the shapes the storefront components were built around.
// Money comes as { amount (minor units), currency, formatted }; components work in major units.

export const major = (money) => (money && typeof money.amount === 'number' ? money.amount / 100 : 0);
export const majorOrNull = (money) => (money ? money.amount / 100 : null);

/** Storefront product id: the legacy id (r1, n1…) when present, else the slug. */
export const productKey = (p) => p.legacy_id || p.slug;

export function mapProduct(p) {
  return {
    id: productKey(p),
    apiId: p.id,
    slug: p.slug,
    category: p.category?.slug ?? '',
    categoryName: p.category?.name ?? '',
    name: p.name,
    subtitle: p.subtitle ?? '',
    price: major(p.price),
    originalPrice: majorOrNull(p.compare_at_price),
    rating: Number(p.rating) || 0,
    reviews: p.reviews_count ?? 0,
    badge: p.badge ?? null,
    image: p.image,
    gallery: p.gallery?.length ? p.gallery : p.image ? [p.image] : [],
    metal: p.metal ?? '',
    stone: p.stone ?? '',
    weight: p.weight ?? '',
    description: p.description ?? '',
    details: p.details ?? [],
    tags: p.tags ?? [],
    inStock: Boolean(p.in_stock),
    customizable: Boolean(p.is_customizable),
    hasSizes: Boolean(p.has_sizes),
    sizes: p.sizes ?? [],
    detailed: Array.isArray(p.gallery),
  };
}

export const mapReview = (r) => ({ name: r.name, location: r.location, initials: r.initials, rating: r.rating, text: r.text });

export const mapTestimonial = (t) => ({
  name: t.name,
  location: t.location,
  rating: t.rating,
  initials: t.initials,
  product: t.product,
  text: t.text,
});

export const mapCategory = (c) => ({ id: c.slug, apiId: c.id, label: c.name, image: c.image, count: c.count });

export const mapShippingMethod = (m) => ({
  id: m.code,
  name: m.name,
  time: m.delivery_time,
  price: major(m.price),
  freeOverThreshold: Boolean(m.free_over_threshold),
});

export const mapStage = (s) => ({ id: s.code, label: s.label, desc: s.description });

export function mapRing(r) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type ?? '',
    setting: r.setting ?? '',
    karat: r.karat,
    metal: r.metal,
    goldWeightG: r.gold_weight_g,
    goldValue: major(r.gold_value),
    craftFee: major(r.craft_fee),
    sizes: r.sizes ?? [],
    image: r.image,
    description: r.description ?? '',
    deliveryText: r.delivery_text || '4-6 weeks',
  };
}

export function mapStone(s, combos) {
  const images = {};
  combos.filter((c) => c.stone_id === s.id).forEach((c) => {
    images[c.ring_id] = c.image;
  });
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    origin: s.origin ?? '',
    gemPrice: major(s.price),
    rarity: s.rarity ?? '',
    color: s.color || '#90caf9',
    glow: s.glow || 'rgba(255,255,255,0.2)',
    gem: s.uses_diamond_animation ? null : s.gem_style,
    isDiamond: Boolean(s.uses_diamond_animation),
    images,
    description: s.description ?? '',
  };
}

const ORDER_STAGE_CODES = ['placed', 'crafting', 'quality_check', 'shipped', 'delivered'];

export const mapAddress = (a, countries = []) => ({
  id: a.id,
  label: a.label || 'Home',
  name: a.name,
  line1: a.line1,
  city: a.city,
  state: a.state ?? '',
  zip: a.zip,
  country: a.country || countries.find((c) => c.code === a.country_code)?.name || a.country_code,
  countryCode: a.country_code,
  phone: a.phone ?? '',
  isDefault: Boolean(a.is_default),
});

export function mapOrder(o) {
  const totals = o.totals ?? {};
  return {
    id: o.number,
    number: o.number,
    email: o.email ?? '',
    createdAt: Date.parse(o.created_at),
    status: o.status,
    stage: o.stage ? ORDER_STAGE_CODES.indexOf(o.stage) : -1,
    canPay: Boolean(o.can_pay),
    canCancel: Boolean(o.can_cancel),
    currency: o.currency,
    shippingMethod: o.shipping_method?.code ?? null,
    shippingMethodName: o.shipping_method?.name ?? '',
    address: o.shipping_address
      ? {
          name: o.shipping_address.name,
          line1: o.shipping_address.line1,
          city: o.shipping_address.city,
          state: o.shipping_address.state ?? '',
          zip: o.shipping_address.zip,
          country: o.shipping_address.country,
        }
      : null,
    items: (o.items ?? []).map((i) => ({
      key: String(i.id),
      id: i.kind === 'product' ? i.legacy_id || i.product_slug || '' : `conf-${i.ring_id}-${i.stone_id}-${i.size}`,
      kind: i.kind === 'custom_ring' ? 'config' : 'product',
      productId: i.product_id,
      ringId: i.ring_id,
      stoneId: i.stone_id,
      name: i.name,
      subtitle: i.subtitle ?? '',
      price: major(i.unit_price),
      qty: i.qty,
      image: i.image,
      meta: { ...(i.size ? { size: i.size } : {}), ...(i.custom_ring ? { stone: i.custom_ring.stone_name, ring: i.custom_ring.ring_name } : {}) },
    })),
    itemsCount: o.items_count,
    totals: {
      subtotal: major(totals.subtotal),
      discount: major(totals.discount),
      shipping: major(totals.shipping),
      tax: major(totals.tax),
      total: major(totals.total ?? o.total),
      refunded: major(totals.refunded),
    },
    tracking: o.tracking ?? null,
    timeline: o.timeline ?? [],
  };
}

export const mapUser = (u, addresses = []) => ({
  id: u.id,
  accountType: 'customer',
  firstName: u.first_name,
  lastName: u.last_name ?? '',
  email: u.email,
  phone: u.phone ?? '',
  avatar: u.avatar_url,
  provider: u.has_password ? 'password' : 'google',
  hasPassword: Boolean(u.has_password),
  googleLinked: Boolean(u.google_linked),
  preferredCurrency: u.preferred_currency,
  addresses,
});
