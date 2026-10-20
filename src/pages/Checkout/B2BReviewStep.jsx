import { useState } from 'react';
import { formatPrice } from '../../utils/format';

// Business checkout has no payment form: the order goes to the admin for approval first.
export default function B2BReviewStep({ cart, onBack, onSubmit, active }) {
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className={`co-panel${active ? ' active' : ''}`}>
      <h2 className="co-panel-title">Review &amp; Submit for Approval</h2>
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

      <div className="co-form" style={{ marginTop: 20 }}>
        <div className="form-field">
          <label htmlFor="b2b-po">PO / Reference Number (optional)</label>
          <input id="b2b-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="PO-1234" />
        </div>
        <div className="form-field">
          <label htmlFor="b2b-notes">Notes for our team (optional)</label>
          <textarea id="b2b-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery deadline, packaging, special requests..." />
        </div>
      </div>

      <div className="b2b-flow-note">
        <strong>What happens next</strong>
        <ol>
          <li>Our team reviews and approves your order.</li>
          <li>Once approved, choose to pay by payment link or use your credit line.</li>
          <li>Crafting starts as soon as payment or credit is confirmed.</li>
        </ol>
      </div>

      <div className="co-btns" style={{ marginTop: 24 }}>
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-gold" onClick={() => onSubmit({ poNumber, notes })}>
          Submit for Approval →
        </button>
      </div>
    </div>
  );
}
