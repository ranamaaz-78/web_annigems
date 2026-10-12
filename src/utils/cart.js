// Builds the cart line for a catalogue product. Same product + size share one line.
export const productCartItem = (product, size = null) => ({
  key: product.id + (size ?? ''),
  id: product.id,
  name: product.name,
  subtitle: product.subtitle,
  price: product.price,
  image: product.image,
  meta: size ? { size } : {},
});
