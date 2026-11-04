import { formatPrice } from '../../utils/format';

export default function ReviewStep({ cart, onBack, onPlaceOrder, active, busy = false, error = '' }) {
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
              {item.errors?.length > 0 && <p className="field-error">{item.errors[0]}</p>}
            </div>
            <span className="ro-price">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      {error && (
        <p className="form-alert" role="alert" style={{ marginTop: 20 }}>
          {error}
        </p>
      )}
      <div className="co-btns" style={{ marginTop: 24 }}>
        <button className="btn-ghost" onClick={onBack} disabled={busy}>
          ← Back
        </button>
        <button className="btn-gold" onClick={onPlaceOrder} disabled={busy}>
          {busy ? 'Processing payment…' : 'Place Order →'}
        </button>
      </div>
    </div>
  );
}
