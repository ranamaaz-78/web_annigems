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
