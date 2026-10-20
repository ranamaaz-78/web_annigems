import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import PageHero from '../../components/common/PageHero';
import { COUNTRIES, FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS, TAX_RATE } from '../../data/site';
import { useShop } from '../../hooks/useShop';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { orderTotals, shippingCost } from '../../utils/pricing';

export default function CartPage() {
  const { cart, cartSubtotal, discount, couponCode, coupon, changeQty, removeFromCart, applyCoupon, removeCoupon } = useShop();
  const { showToast } = useUI();
  const { isB2B } = usePricing();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [method, setMethod] = useState('standard');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [pin, setPin] = useState('');
  const [estimate, setEstimate] = useState(null);

  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Cart' }];

  if (!cart.length) {
    return (
      <div className="page-wrap">
        <PageHero crumbs={crumbs} title="Your Cart" />
        <EmptyState icon="◈" title="Your cart is empty" text="Discover our collections and find your perfect piece." actionLabel="Browse Collection" actionTo="/shop" />
      </div>
    );
  }

  const totals = orderTotals(cartSubtotal, method, discount);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (cartSubtotal - discount));
  const progress = Math.min(100, ((cartSubtotal - discount) / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCoupon = (e) => {
    e.preventDefault();
    const res = applyCoupon(code);
    if (!res.ok) return setCouponError(res.error);
    setCouponError('');
    setCode('');
    return showToast('Coupon applied!');
  };

  const handleEstimate = (e) => {
    e.preventDefault();
    if (pin.trim().length < 4) return setEstimate({ error: 'Enter a valid PIN / ZIP code.' });
    const international = country !== 'India';
    return setEstimate({
      error: '',
      options: SHIPPING_METHODS.map((m) => ({ ...m, cost: shippingCost(m.id, cartSubtotal - discount) + (international ? 20 : 0) })),
      international,
    });
  };

  return (
    <div className="page-wrap">
      <PageHero crumbs={crumbs} eyebrow="Review your selection" title="Your Cart" />

      <div className="cart-ship-bar" data-reveal="up">
        <p>
          {remaining === 0 ? (
            <>
              You have unlocked <strong>free standard shipping</strong> ✦
            </>
          ) : (
            <>
              Add <strong>{formatPrice(remaining)}</strong> more for free standard shipping
            </>
          )}
        </p>
        <div className="cart-ship-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-lines" data-stagger=".cart-line">
          {cart.map((item) => (
            <article className="cart-line" key={item.key}>
              <Link to={`/product/${item.id}`} className="cl-img">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cl-info">
                <Link to={`/product/${item.id}`} className="cl-name">
                  {item.name}
                </Link>
                <p className="cl-sub">{item.subtitle}</p>
                <div>
                  {item.meta.size && <span className="ci-tag">Size {item.meta.size}</span>}
                  {item.meta.stone && <span className="ci-tag">{item.meta.stone}</span>}
                </div>
                <button className="cl-remove" onClick={() => removeFromCart(item.key)}>
                  Remove
                </button>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => changeQty(item.key, -1)} aria-label="Decrease quantity">
                  −
                </button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(item.key, 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <span className="cl-price">
                {isB2B && item.retailPrice > item.price && <s className="cl-was">{formatPrice(item.retailPrice * item.qty)}</s>}
                {formatPrice(item.price * item.qty)}
              </span>
            </article>
          ))}
          <Link to="/shop" className="auth-link">
            ← Continue shopping
          </Link>
        </div>

        <aside className="cart-side" data-reveal="right">
          <div className="side-card">
            <h3 className="cs-title">Order Summary</h3>

            {isB2B ? (
              <p className="b2b-note">✦ Business pricing applied. Your order is sent for approval before payment.</p>
            ) : (
              <>
            <form className="coupon-form" onSubmit={handleCoupon}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try AANI10)" aria-label="Coupon code" />
              <button type="submit" className="btn-outline btn-sm">
                Apply
              </button>
            </form>
            {couponError && <p className="field-error">{couponError}</p>}
            {coupon && (
              <p className="coupon-applied">
                ✓ <strong>{couponCode}</strong> — {coupon.label}{' '}
                <button onClick={removeCoupon} aria-label="Remove coupon">
                  ✕
                </button>
              </p>
            )}

              </>
            )}

            <div className="cs-rows">
              <div className="cs-row">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="cs-row">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="cs-row">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
              </div>
              <div className="cs-row">
                <span>Tax ({TAX_RATE * 100}%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
            </div>
            <div className="cs-total-row">
              <span>Total</span>
              <span className="cs-total-val">{formatPrice(totals.total)}</span>
            </div>
            <Link to="/checkout" className="btn-gold btn-full" data-magnetic>
              {isB2B ? 'Submit for Approval →' : 'Proceed to Checkout →'}
            </Link>
          </div>

          <div className="side-card">
            <h3 className="cs-title">Estimate Shipping</h3>
            <form className="co-form" onSubmit={handleEstimate}>
              <div className="form-field">
                <label htmlFor="est-country">Country</label>
                <select id="est-country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="est-pin">PIN / ZIP</label>
                <input id="est-pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="400050" />
              </div>
              <button type="submit" className="btn-outline">
                Calculate
              </button>
            </form>
            {estimate?.error && <p className="field-error">{estimate.error}</p>}
            {estimate?.options && (
              <ul className="est-list">
                {estimate.options.map((o) => (
                  <li key={o.id}>
                    <label>
                      <input type="radio" name="est" checked={method === o.id} onChange={() => setMethod(o.id)} />
                      <span>
                        {o.name} <small>{o.time}</small>
                      </span>
                      <b>{o.cost === 0 ? 'Free' : formatPrice(o.cost)}</b>
                    </label>
                  </li>
                ))}
                {estimate.international && <li className="est-note">Includes $20 international handling.</li>}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
