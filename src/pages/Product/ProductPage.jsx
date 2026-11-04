import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import { PRODUCTS, getProductById, upsertProduct } from '../../data/products';
import { hydrateProductPagePoints } from '../../data/site';
import { capitalize } from '../../utils/format';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

const MAX_RELATED = 4;

export default function ProductPage() {
  const { id } = useParams();
  // Full product from GET /products/{id} (description, details, sizes, reviews, related).
  // The catalogue entry loaded at start-up is shown until it arrives.
  const [detail, setDetail] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setMissing(false);
    api(`products/${encodeURIComponent(id)}`)
      .then((res) => {
        if (cancelled) return;
        hydrateProductPagePoints(res.data);
        setDetail({ id, ...upsertProduct(res.data) });
      })
      .catch((err) => !cancelled && err.status === 404 && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const current = detail?.id === id ? detail : null;
  const product = current ?? getProductById(id);
  if (missing) return <Navigate to="/shop" replace />;
  if (!product) return null;

  const related = current?.related?.length
    ? current.related.slice(0, MAX_RELATED)
    : PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, MAX_RELATED);

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
      <ProductReviews product={product} reviews={current?.productReviews ?? []} />
      {related.length > 0 && (
        <section className="pd-section" data-reveal="up">
          <h2 className="pd-section-title">You May Also Love</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
