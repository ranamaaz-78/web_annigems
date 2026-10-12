import { Link } from 'react-router-dom';
import SectionHeader from '../../../components/common/SectionHeader';
import ProductGrid from '../../../components/product/ProductGrid';

// A titled product grid with an optional "view all" CTA.
export default function ProductShowcase({ eyebrow, title, products, ctaLabel, ctaTo, style }) {
  return (
    <section className="section" style={style}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ProductGrid products={products} showCategory />
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
