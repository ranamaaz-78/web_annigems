import { FREE_SHIPPING_THRESHOLD, GOLD_RATE, SHIPPING_METHODS, TAX_RATE } from '../data/site';

// Value of the 18K gold in a configurator ring at the static display rate
export const goldValue = (ring) => ring.goldWeightG * GOLD_RATE.purity18k * GOLD_RATE.perGram;

export const configuratorTotal = (ring, stone) =>
  Math.round((goldValue(ring) + ring.craftFee + stone.gemPrice) * 100) / 100;

export const shippingCost = (methodId, subtotal) => {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (method.freeOverThreshold && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.price;
};

export const orderTotals = (subtotal, methodId, discount = 0) => {
  const taxable = subtotal - discount;
  const shipping = shippingCost(methodId, taxable);
  const tax = taxable * TAX_RATE;
  return { subtotal, discount, shipping, tax, total: taxable + shipping + tax };
};

const round2 = (n) => Math.round(n * 100) / 100;

// B2B rule for a catalogue product: percent = % off retail, fixed = exact B2B price.
export const applyProductRule = (retail, rule) => {
  if (!rule) return retail;
  if (rule.mode === 'fixed') return round2(Math.max(0, Number(rule.value) || 0));
  return round2(retail * (1 - (Number(rule.value) || 0) / 100));
};

// B2B rule for a custom ring total: percent = % off the total, fixed = flat amount off.
export const applyConfigRule = (total, rule) => {
  if (!rule) return total;
  if (rule.mode === 'fixed') return round2(Math.max(0, total - (Number(rule.value) || 0)));
  return round2(total * (1 - (Number(rule.value) || 0) / 100));
};

export const productRule = (pricing, productId) => pricing.products?.[productId] ?? pricing.default;

// Price a shopper pays for a product. Retail shoppers always pay product.price.
export const resolveProductPrice = (product, isB2B, pricing) =>
  isB2B ? applyProductRule(product.price, productRule(pricing, product.id)) : product.price;

export const ruleLabel = (rule, flat = false) =>
  rule.mode === 'fixed' ? (flat ? `$${rule.value} off` : `$${rule.value} fixed`) : `${rule.value}% off`;
