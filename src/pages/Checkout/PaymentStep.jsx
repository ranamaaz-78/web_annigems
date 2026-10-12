import { useState } from 'react';
import { BANKS, PAYMENT_TABS } from '../../data/site';

// Display-only payment form: nothing is validated or charged.
export default function PaymentStep({ onBack, onNext, active }) {
  const [tab, setTab] = useState('card');
  const [cardNumber, setCardNumber] = useState('');

  const handleCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className={`co-panel${active ? ' active' : ''}`}>
      <h2 className="co-panel-title">Payment Details</h2>
      <div className="pay-tabs" role="tablist">
        {PAYMENT_TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`pay-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <form className="co-form" onSubmit={handleSubmit}>
        <div className={`pay-form${tab === 'card' ? ' active' : ''}`}>
          <div className="form-field">
            <label htmlFor="card-number">Card Number</label>
            <input id="card-number" type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" maxLength={19} value={cardNumber} onChange={handleCardNumber} />
          </div>
          <div className="form-r2">
            <div className="form-field">
              <label htmlFor="card-expiry">Expiry</label>
              <input id="card-expiry" type="text" placeholder="MM / YY" maxLength={7} />
            </div>
            <div className="form-field">
              <label htmlFor="card-cvv">CVV</label>
              <input id="card-cvv" type="text" inputMode="numeric" placeholder="123" maxLength={4} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="card-name">Name on Card</label>
            <input id="card-name" type="text" placeholder="PRIYA MEHTA" />
          </div>
        </div>
        <div className={`pay-form${tab === 'upi' ? ' active' : ''}`}>
          <div className="form-field">
            <label htmlFor="upi-id">UPI ID</label>
            <input id="upi-id" type="text" placeholder="priya@paytm" />
          </div>
        </div>
        <div className={`pay-form${tab === 'bank' ? ' active' : ''}`}>
          <div className="form-field">
            <label htmlFor="bank">Select Bank</label>
            <select id="bank">
              {BANKS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="secure-note">🔒 Your payment is secured by 256-bit SSL encryption</p>
        <div className="co-btns">
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Back
          </button>
          <button type="submit" className="btn-gold">
            Review Order →
          </button>
        </div>
      </form>
    </div>
  );
}
