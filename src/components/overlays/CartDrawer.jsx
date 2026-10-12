import { useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';

export default function CartDrawer() {
  const { overlay, close } = useUI();
  const { cart, cartSubtotal, changeQty, removeFromCart } = useShop();
  const navigate = useNavigate();
  const open = overlay === 'cart';

  const goTo = (path) => {
    close();
    navigate(path);
  };

  return (
    <>
      <div className={`drawer-bg${open ? ' open' : ''}`} onClick={close} />
      <aside className={`cart-drawer${open ? ' open' : ''}`} aria-hidden={!open} aria-label="Shopping cart">
        <div className="cd-head">
          <h3>Your Cart</h3>
          <button className="cd-close" onClick={close} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cd-body" data-lenis-prevent>
          {cart.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon">◈</div>
              <h4>Your cart is empty</h4>
              <p>Discover our collections and find your perfect piece.</p>
              <button className="btn-gold" onClick={() => goTo('/shop')}>
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.key}>
                <img className="ci-img" src={item.image} alt={item.name} />
                <div className="ci-info">
                  <p className="ci-name">{item.name}</p>
                  <p className="ci-sub">{item.subtitle}</p>
                  {item.meta.size && <span className="ci-tag">Size {item.meta.size}</span>}
                  {item.meta.stone && <span className="ci-tag">{item.meta.stone}</span>}
                  <div className="ci-controls">
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.key, -1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.key, 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <span className="ci-price">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>
                <button className="ci-remove" onClick={() => removeFromCart(item.key)} aria-label={`Remove ${item.name}`}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cd-footer">
            <div className="cd-sub">
              <span>Subtotal</span>
              <span className="cd-sub-val">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="cd-ship-note">Free shipping on orders over $500</p>
            <button className="btn-gold btn-full" onClick={() => goTo('/checkout')}>
              Proceed to Checkout →
            </button>
            <button className="btn-outline btn-full" onClick={() => goTo('/cart')}>
              View Full Cart
            </button>
            <button className="btn-ghost btn-full" onClick={() => goTo('/shop')}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
