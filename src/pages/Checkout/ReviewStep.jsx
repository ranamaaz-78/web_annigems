import { formatPrice } from '../../utils/format';

export default function ReviewStep({ cart, onBack, onPlaceOrder, active }) {
  return (
    <div className={`co-panel${active ? ' active' : ''}`}>
      <h2 className="co-panel-title">Review Your Order</h2>
      <div className="ro-items">
        {cart.map((item) => (
          <div className="ro-item" key={item.key}>
            <img className="ro-img" src={item.image} alt={item.name} />
            <div className="ro-info">
              <p className="ro-name">{item.name}</p>
              <p className="ro-meta">
                {item.subtitle} · Qty: {item.qty}
                {item.meta.size && ` · Size: ${item.meta.size}`}
              </p>
            </div>
            <span className="ro-price">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="co-btns" style={{ marginTop: 24 }}>
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-gold" onClick={onPlaceOrder}>
          Place Order →
        </button>
      </div>
    </div>
  );
}
