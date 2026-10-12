import { Navigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import { PRODUCTS, getProductById } from '../../data/products';
import { capitalize } from '../../utils/format';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

const MAX_RELATED = 4;

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);
  if (!product) return <Navigate to="/shop" replace />;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, MAX_RELATED);

  // `key` resets gallery/size selection when navigating between products
  return (
    <div className="pd-wrap" key={product.id}>
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: capitalize(product.category), to: `/shop?cat=${product.category}` },
          { label: product.name },
        ]}
      />
      <div className="pd-layout">
        <div data-reveal="left"><ProductGallery images={product.gallery} name={product.name} /></div>
        <div data-reveal="right"><ProductInfo product={product} /></div>
      </div>
      <ProductReviews product={product} />
      {related.length > 0 && (
        <section className="pd-section" data-reveal="up">
          <h2 className="pd-section-title">You May Also Love</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
