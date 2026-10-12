import { TAX_RATE, TRUST_POINTS } from '../../data/site';
import { formatPrice } from '../../utils/format';

export default function OrderSummary({ cart, totals }) {
  return (
    <div className="co-summary">
      <h3 className="cs-title">Order Summary</h3>
      <div className="cs-items">
        {cart.map((item) => (
          <div className="cs-item" key={item.key}>
            <img src={item.image} alt={item.name} />
            <div className="cs-item-info">
              <p className="cs-item-name">{item.name}</p>
              <p className="cs-item-qty">Qty: {item.qty}</p>
            </div>
            <span className="cs-item-price">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="cs-rows">
        <div className="cs-row">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="cs-row">
            <span>Discount</span>
            <span>−{formatPrice(totals.discount)}</span>
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
      <div className="cs-trust">
        {TRUST_POINTS.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
