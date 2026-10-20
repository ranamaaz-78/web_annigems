import { useState } from 'react';
import { Link } from 'react-router-dom';
import Stars from '../../components/common/Stars';
import { RING_SIZES } from '../../data/products';
import { CARE_INSTRUCTIONS, SHIPPING_POLICY } from '../../data/site';
import { useShop } from '../../hooks/useShop';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { useWishlistToggle } from '../../hooks/useWishlistToggle';
import { productCartItem } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import Accordion from './Accordion';

export default function ProductInfo({ product }) {
  const { addToCart, isWishlisted } = useShop();
  const { showToast } = useUI();
  const toggleWishlist = useWishlistToggle();
  const { productPrice } = usePricing();
  const { price, retail, isB2B } = productPrice(product);
  const [size, setSize] = useState(null);
  const isRing = product.category === 'rings';

  const handleAddToCart = () => {
    if (!product.inStock) return;
    if (isRing && !size) {
      showToast('Please select a ring size');
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

      <div className="pd-rating">
        <Stars rating={product.rating} className="pd-stars" />
        <span className="pd-rating-val">{product.rating}</span>
        <a href="#pd-reviews" className="pd-review-lk">
          {product.reviews} reviews
        </a>
      </div>

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
        <div>
          <div className="size-hdr">
            <span className="size-label">Ring Size</span>
            <Link className="size-guide-lk" to="/design-your-ring">
              Size Guide
            </Link>
          </div>
          <div className="size-grid">
            {RING_SIZES.map((s) => (
              <button key={s} className={`size-btn${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pd-specs">
        <div className="pd-spec">
          <span>Metal</span>
          <span>{product.metal}</span>
        </div>
        <div className="pd-spec">
          <span>Stone</span>
          <span>{product.stone}</span>
        </div>
        <div className="pd-spec">
          <span>Weight</span>
          <span>{product.weight}</span>
        </div>
      </div>

      <div className="pd-actions">
        <button className="btn-gold pd-atc" onClick={handleAddToCart} disabled={!product.inStock}>
          {product.inStock ? '🛒 Add to Cart' : 'Sold Out'}
        </button>
        <button
          className={`pd-wl${isWishlisted(product.id) ? ' active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
        >
          ♥
        </button>
      </div>

      {product.customizable && (
        <div className="pd-custom-banner">
          <p>✦ Want to add a gemstone?</p>
          <Link className="btn-outline btn-sm" to="/design-your-ring">
            Design Your Version →
          </Link>
        </div>
      )}

      <Accordion items={accordionItems} />
    </div>
  );
}
