import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BADGE_CLASS } from '../../data/catalog';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { useWishlistToggle } from '../../hooks/useWishlistToggle';
import { productCartItem } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import { EyeIcon } from '../common/Icons';
import Stars from '../common/Stars';

export default function ProductCard({ product, showCategory = false }) {
  const { addToCart, isWishlisted } = useShop();
  const { showToast, openQuickView } = useUI();
  const toggleWishlist = useWishlistToggle();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const outOfStock = !product.inStock;
  const productUrl = `/product/${product.id}`;

  const handleAddToCart = () => {
    if (outOfStock) return;
    // Rings need a size, which is picked on the product page
    if (product.category === 'rings') {
      navigate(productUrl);
      showToast('Please select a ring size first');
      return;
    }
    addToCart(productCartItem(product));
    showToast(`${product.name} added to cart!`);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className={`pc${outOfStock ? ' oos' : ''}`}>
      <div className="pc-img-wrap">
        <Link to={productUrl}>
          <img className="pc-img" src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && <span className={`pc-badge ${BADGE_CLASS[product.badge] ?? 'b-best'}`}>{product.badge}</span>}
        {outOfStock && <span className="pc-badge b-oos">Sold Out</span>}
        <div className="pc-actions">
          <button
            className={`pc-wl${isWishlisted(product.id) ? ' active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
          >
            ♥
          </button>
          <button className="pc-qv" onClick={() => openQuickView(product.id)} aria-label="Quick view">
            <EyeIcon />
          </button>
        </div>
        {product.customizable && <div className="pc-custom-lbl">✦ Customizable</div>}
      </div>
      <div className="pc-body">
        {showCategory && <p className="pc-cat">{product.category}</p>}
        <h3 className="pc-name">
          <Link to={productUrl}>{product.name}</Link>
        </h3>
        <p className="pc-sub">{product.subtitle}</p>
        <div className="pc-stars">
          <Stars rating={product.rating} />{' '}
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>({product.reviews})</span>
        </div>
        <div className="pc-price-row">
          <span className="pc-price">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="pc-orig">{formatPrice(product.originalPrice)}</span>}
        </div>
        <button className={`pc-atc${added ? ' added' : ''}`} onClick={handleAddToCart} disabled={outOfStock}>
          {outOfStock ? 'Sold Out' : added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
