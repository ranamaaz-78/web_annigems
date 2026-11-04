import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS, TAX_RATE } from '../data/site';

// Retail prices come from the API (GET /configurator, POST /configurator/price, POST /cart/quote).
// The local totals below are only used by the B2B preview module, which has no backend yet.

// Gold value of a configurator ring, priced by the API on the live gold rate.
export const goldValue = (ring) => ring.goldValue;

// Same sum the API uses: gold value + craft fee + stone, each already in the display currency.
export const configuratorTotal = (ring, stone) => Math.round((ring.goldValue + ring.craftFee + stone.gemPrice) * 100) / 100;

export const shippingCost = (methodId, subtotal) => {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (!method) return 0;
  if (method.freeOverThreshold && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.price;
};

export const orderTotals = (subtotal, methodId, discount = 0) => {
  const taxable = subtotal - discount;
  const shipping = shippingCost(methodId, taxable);
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
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
