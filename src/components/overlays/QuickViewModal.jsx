import { useNavigate } from 'react-router-dom';
import { getProductById } from '../../data/products';
import { useShop } from '../../hooks/useShop';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { productCartItem } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import Stars from '../common/Stars';
import Modal from './Modal';

export default function QuickViewModal() {
  const { overlay, quickViewId, close, showToast } = useUI();
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const { productPrice } = usePricing();
  const product = quickViewId ? getProductById(quickViewId) : null;

  const goTo = (path) => {
    close();
    navigate(path);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    // Rings need a size, chosen on the product page
    if (product.category === 'rings') {
      goTo(`/product/${product.id}`);
      showToast('Please select a ring size first');
      return;
    }
    addToCart(productCartItem(product));
    showToast(`${product.name} added to cart!`);
    close();
  };

  return (
    <Modal open={overlay === 'quickview'} boxClassName="qv-box" label="Quick view">
      {product && (
        <div className="qv-inner">
          <div className="qv-img-col">
            <img className="qv-img" src={product.image} alt={product.name} />
          </div>
          <div className="qv-info">
            <p className="qv-cat">{product.category}</p>
            <h2 className="qv-name">{product.name}</h2>
            <p className="qv-sub">{product.subtitle}</p>
            <Stars rating={product.rating} className="qv-stars" />
            <div className="qv-price-row">
              <span className="qv-price">{formatPrice(productPrice(product).price)}</span>
              {productPrice(product).isB2B ? (
                <>
                  <span className="qv-orig">{formatPrice(product.price)}</span>
                  <span className="b2b-tag">B2B</span>
                </>
              ) : (
                product.originalPrice && <span className="qv-orig">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="qv-desc">{product.description}</p>
            <div className="qv-btns">
              <button className="btn-gold" onClick={handleAddToCart} disabled={!product.inStock}>
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button className="btn-ghost" onClick={() => goTo(`/product/${product.id}`)}>
                View Details
              </button>
            </div>
            {product.customizable && (
              <p className="qv-custom">
                ✦ Customizable — <a onClick={() => goTo('/design-your-ring')}>Design Your Version →</a>
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
