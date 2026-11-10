import { useState } from 'react';
import { B2B_ORDER_FLOW } from '../../data/b2b';
import { formatPrice } from '../../utils/format';

// Business checkout has no payment form: cash on delivery, and our team approves the order first.
export default function B2BReviewStep({ cart, onBack, onSubmit, active, busy = false, error = '' }) {
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');

  const submit = () => onSubmit({ notes: [poNumber.trim() && `PO / reference: ${poNumber.trim()}`, notes.trim()].filter(Boolean).join('\n') });

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
                {item.meta?.size && ` · Size: ${item.meta.size}`}
                {item.retailPrice > item.price && ` · ${item.b2bPercent}% member discount`}
              </p>
              {item.errors?.length > 0 && <p className="field-error">{item.errors[0]}</p>}
            </div>
            <span className="ro-price">
              {item.retailPrice > item.price && <s className="cl-was">{formatPrice(item.retailPrice * item.qty)}</s>} {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="co-form" style={{ marginTop: 20 }}>
        <div className="form-field">
          <label htmlFor="b2b-po">PO / Reference Number (optional)</label>
          <input id="b2b-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="PO-1234" maxLength={80} />
        </div>
        <div className="form-field">
          <label htmlFor="b2b-notes">Notes for our team (optional)</label>
          <textarea id="b2b-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery deadline, packaging, special requests..." maxLength={800} />
        </div>
      </div>

      <div className="b2b-flow-note">
        <strong>Payment: cash on delivery. What happens next</strong>
        <ol>
          {B2B_ORDER_FLOW.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
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
        <button className="btn-gold" onClick={submit} disabled={busy}>
          {busy ? 'Submitting…' : 'Submit for Approval →'}
        </button>
      </div>
    </div>
  );
}
