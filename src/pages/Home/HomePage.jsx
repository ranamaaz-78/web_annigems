import { FEATURED_IDS, NEW_ARRIVAL_IDS, getProductsByIds } from '../../data/products';
import CategoryGrid from './sections/CategoryGrid';
import DesignRingBanner from './sections/DesignRingBanner';
import Hero from './sections/Hero';
import Newsletter from './sections/Newsletter';
import ProductShowcase from './sections/ProductShowcase';
import Testimonials from './sections/Testimonials';
import UspBar from './sections/UspBar';

const featured = getProductsByIds(FEATURED_IDS);
const newArrivals = getProductsByIds(NEW_ARRIVAL_IDS);

export default function HomePage() {
  return (
    <>
      <Hero />
      <UspBar />
      <CategoryGrid />
      <ProductShowcase
        eyebrow="Handpicked for You"
        title="Featured Pieces"
        products={featured}
        ctaLabel="View All Pieces →"
        ctaTo="/shop"
        style={{ paddingTop: 0 }}
      />
      <DesignRingBanner />
      <ProductShowcase eyebrow="Just Arrived" title="New Collection" products={newArrivals} />
      <Testimonials />
      <Newsletter />
    </>
  );
}
