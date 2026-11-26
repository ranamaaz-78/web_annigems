import { FEATURED_IDS, PRODUCTS, getProductsByIds } from '../../data/products';
import SectionHeader from '../common/SectionHeader';
import ProductGrid from './ProductGrid';

// Four pieces to keep shopping (empty cart, wishlist, 404…): bestsellers first, then featured, then anything in stock.
export function pickBestsellers(count = 4, exclude = []) {
  const ok = (p) => p.inStock && !exclude.includes(p.id);
  const picked = [
    ...PRODUCTS.filter((p) => p.badge === 'Bestseller' && ok(p)),
    ...getProductsByIds(FEATURED_IDS).filter(ok),
    ...PRODUCTS.filter(ok),
  ];
  return [...new Map(picked.map((p) => [p.id, p])).values()].slice(0, count);
}

export default function Bestsellers({ title = 'Our Bestsellers', eyebrow = 'Loved by our clients' }) {
  const products = pickBestsellers();
  if (!products.length) return null;
  return (
    <section className="bestsellers">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ProductGrid products={products} showCategory />
    </section>
  );
}
