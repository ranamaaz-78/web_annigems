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
        // routeId: the id in the URL (slug or legacy id); the product's own id may differ
        setDetail({ ...upsertProduct(res.data), routeId: id });
      })
      .catch((err) => !cancelled && err.status === 404 && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const current = detail?.routeId === id ? detail : null;
  const product = current ?? getProductById(id);
  if (missing) return <Navigate to="/shop" replace />;
  if (!product) {
    return (
      <div className="pd-wrap" aria-busy="true" aria-label="Loading product">
        <div className="pd-layout pd-skel">
          <div className="skel skel-img" />
          <div className="pd-skel-info">
            <div className="skel" style={{ width: '22%', height: 12 }} />
            <div className="skel" style={{ width: '75%', height: 40 }} />
            <div className="skel" style={{ width: '40%', height: 14 }} />
            <div className="skel" style={{ width: '35%', height: 44, marginTop: 12 }} />
            <div className="skel" style={{ width: '100%', height: 64 }} />
            <div className="skel" style={{ width: '100%', height: 96 }} />
            <div className="skel" style={{ width: '100%', height: 52, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    );
  }

  // Same category first (API order), then other pieces so the row is always full.
  const sameCategory = current?.related?.length ? current.related : PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const related = [...sameCategory, ...PRODUCTS.filter((p) => p.id !== product.id && !sameCategory.some((r) => r.id === p.id))].slice(0, MAX_RELATED);

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
      {product.reviews > 0 && <ProductReviews product={product} reviews={current?.productReviews ?? []} />}
      {related.length > 0 && (
        <section className="pd-section" data-reveal="up">
          <h2 className="pd-section-title">You May Also Love</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
