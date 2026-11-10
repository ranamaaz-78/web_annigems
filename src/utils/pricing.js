import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from '../data/site';

// Every price and total comes from the API (GET /configurator, POST /configurator/price, POST /cart/quote,
// business tier prices included). These helpers only show values before the API answers.

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
