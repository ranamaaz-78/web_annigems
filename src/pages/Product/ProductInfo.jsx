import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Stars from '../../components/common/Stars';
import BottomSheet from '../../components/overlays/BottomSheet';
import { CONFIG_RINGS } from '../../data/configurator';
import { CARE_INSTRUCTIONS, SHIPPING_POLICY, TRUST_POINTS } from '../../data/site';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useShop } from '../../hooks/useShop';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { useWishlistToggle } from '../../hooks/useWishlistToggle';
import { productCartItem } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import { SizeGuide } from '../Configurator/Options';
import Accordion from './Accordion';

// CMS trust points start with a symbol ("🔒 Secure Checkout"); the row draws its own icons.
const trustLabel = (t) => t.replace(/^[^\p{L}\p{N}]+/u, '');

export default function ProductInfo({ product }) {
  const { addToCart, isWishlisted } = useShop();
  const { showToast } = useUI();
  const toggleWishlist = useWishlistToggle();
  const { productPrice } = usePricing();
  const { price, retail, isB2B } = productPrice(product);
  const [size, setSize] = useState(null);
  const [guide, setGuide] = useState(false);
  const phone = useMediaQuery('(max-width: 768px)');
  const actions = useRef(null);
  const sizesRef = useRef(null);
  // Phones: a slim add-to-cart bar while the real button is out of view.
  const [barVisible, setBarVisible] = useState(false);
  useEffect(() => {
    if (!phone || !actions.current) return undefined;
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting), { threshold: 0 });
    io.observe(actions.current);
    return () => io.disconnect();
  }, [phone]);
  // Sized products (rings) need a size; the sizes come from the API.
  const isRing = Boolean(product.hasSizes);
  const sizes = product.sizes ?? [];

  const handleAddToCart = () => {
    if (!product.inStock) return;
    if (isRing && !size) {
      showToast('Please select a ring size');
      sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    addToCart(productCartItem(product, size));
    showToast(`${product.name} added to cart!`);
  };

  const accordionItems = [
    { title: 'Product Details', points: product.details },
    { title: 'Shipping & Returns', points: SHIPPING_POLICY },
    { title: 'Care Instructions', points: CARE_INSTRUCTIONS },
  ];

  return (
    <div className="pd-info">
      <p className="pd-cat">{product.category}</p>
      <h1 className="pd-name">{product.name}</h1>
      <p className="pd-sub">{product.subtitle}</p>

      {product.reviews > 0 && (
        <div className="pd-rating">
          <Stars rating={product.rating} className="pd-stars" />
          <span className="pd-rating-val">{product.rating}</span>
          <a href="#pd-reviews" className="pd-review-lk">
            {product.reviews} reviews
          </a>
        </div>
      )}

      <div className="pd-price-row">
        <span className="pd-price">{formatPrice(price)}</span>
        {isB2B && (
          <>
            <span className="pd-orig">{formatPrice(retail)}</span>
            <span className="pd-save">Business price · Save {formatPrice(retail - price)}</span>
          </>
        )}
        {!isB2B && product.originalPrice && (
          <>
            <span className="pd-orig">{formatPrice(product.originalPrice)}</span>
            <span className="pd-save">Save {formatPrice(product.originalPrice - product.price)}</span>
          </>
        )}
      </div>

      <p className="pd-desc">{product.description}</p>

      {isRing && (
        <div ref={sizesRef}>
          <div className="size-hdr">
            <span className="size-label">Ring Size{size ? ` · US ${size}` : ''}</span>
            <button type="button" className="size-guide-lk" onClick={() => setGuide(true)}>
              Size Guide
            </button>
          </div>
          <div className="size-grid">
            {sizes.map((s) => (
              <button key={s} className={`size-btn${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pd-specs">
        {/* Only the specs a product has (a loose stone has no metal) */}
        {[
          ['Metal', product.metal],
          ['Stone', product.stone],
          ['Weight', product.weight],
        ]
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div className="pd-spec" key={label}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
      </div>

      <div className="pd-actions" ref={actions}>
        <button className="btn-gold pd-atc" onClick={handleAddToCart} disabled={!product.inStock}>
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
        <button
          className={`pd-wl${isWishlisted(product.id) ? ' active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
        >
          ♥
        </button>
      </div>

      {TRUST_POINTS.length > 0 && (
        <ul className="pd-trust">
          {TRUST_POINTS.map((t, i) => (
            <li key={t}>
              <span className="pd-trust-ico" aria-hidden="true">
                {['✓', '✦', '↺'][i % 3]}
              </span>
              {trustLabel(t)}
            </li>
          ))}
        </ul>
      )}

      {product.customizable && (
        <div className="pd-custom-banner">
          <p>✦ Want to add a gemstone?</p>
          <Link className="btn-outline btn-sm" to={CONFIG_RINGS.some((r) => r.slug === product.slug) ? `/design-your-ring?ring=${product.slug}` : '/design-your-ring'}>
            Design Your Version →
          </Link>
        </div>
      )}

      <Accordion items={accordionItems} />

      {phone && (
        <div className={`pd-bar${barVisible ? ' show' : ''}`} aria-hidden={!barVisible}>
          <div className="pd-bar-info">
            <span className="pd-bar-name">{product.name}</span>
            <span className="pd-bar-price">{formatPrice(price)}</span>
          </div>
          <button className="btn-gold pd-bar-btn" onClick={handleAddToCart} disabled={!product.inStock} tabIndex={barVisible ? 0 : -1}>
            {!product.inStock ? 'Sold Out' : isRing && !size ? 'Choose size' : 'Add to Cart'}
          </button>
        </div>
      )}

      {isRing && (
        <BottomSheet open={guide} onClose={() => setGuide(false)} title="Find your size">
          <SizeGuide />
          <p className="pd-guide-note">Between two sizes? Choose the larger one. We resize free within 60 days.</p>
        </BottomSheet>
      )}
    </div>
  );
}
