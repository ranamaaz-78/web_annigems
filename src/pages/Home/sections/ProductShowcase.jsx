import { Link } from 'react-router-dom';
import SectionHeader from '../../../components/common/SectionHeader';
import ProductGrid from '../../../components/product/ProductGrid';

const PER_ROW = 4;

// A titled product grid with an optional "view all" CTA. Shows full rows only (no card left on its own).
export default function ProductShowcase({ eyebrow, title, products, ctaLabel, ctaTo, style }) {
  const shown = products.length > PER_ROW ? products.slice(0, products.length - (products.length % PER_ROW)) : products;
  return (
    <section className="section" style={style}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ProductGrid products={shown} showCategory />
      {ctaLabel && (
        <div className="sec-cta">
          <Link className="btn-outline" to={ctaTo}>
            {ctaLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
