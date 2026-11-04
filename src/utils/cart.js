// Builds the cart line for a catalogue product. Same product + size share one line.
// `productId` is the API id the server needs for pricing (cart/quote, checkout).
export const productCartItem = (product, size = null) => ({
  key: product.id + (size ?? ''),
  id: product.id,
  kind: 'product',
  productId: product.apiId,
  name: product.name,
  subtitle: product.subtitle,
  price: product.price,
  image: product.image,
  meta: size ? { size } : {},
});

/** Cart line → API line (POST /cart/quote, /checkout). Never sends prices. */
export const toApiLine = (item) =>
  item.kind === 'config'
    ? { type: 'custom_ring', ring_id: item.ringId, stone_id: item.stoneId, size: item.meta?.size ?? null, qty: item.qty }
    : { type: 'product', product_id: item.productId, qty: item.qty, ...(item.meta?.size ? { size: String(item.meta.size) } : {}) };
