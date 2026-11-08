import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { CARD_PAYMENTS_ENABLED, PAYMENT_TABS } from '../../data/site';
import { useTheme } from '../../hooks/useTheme';

// Card fields are Stripe Elements (card data never touches our servers).
// The payment itself is confirmed when the order is placed on the review step.
const cssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const elementOptions = (placeholder) => ({
  placeholder,
  style: {
    base: {
      color: cssVar('--t1', '#f5f0e8'),
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: cssVar('--t3', '#7a7468') },
    },
    invalid: { color: '#e74c3c' },
  },
});

export default function PaymentStep({ onBack, onNext, active, cardName, onCardName, stripeReady = true }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState(PAYMENT_TABS[0].id);
  // Fields remount on a theme change (so their colours follow it); completeness is tracked per theme.
  const [complete, setComplete] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const track = (field) => (e) => {
    setComplete((c) => ({ ...(c.theme === theme ? c : {}), theme, [field]: e.complete }));
    setErrors((prev) => ({ ...prev, [field]: e.error?.message ?? '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cash on delivery: nothing to fill in here.
    if (!CARD_PAYMENTS_ENABLED) return onNext();
    if (!stripeReady) return setFormError('Card payments are not available right now. Please try again later.');
    if (complete.theme !== theme || !complete.number || !complete.expiry || !complete.cvc) return setFormError('Please enter your complete card details.');
    if (!cardName.trim()) return setFormError('Please enter the name on the card.');
    setFormError('');
    return onNext();
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
      <form className="co-form" onSubmit={handleSubmit} noValidate>
        {!CARD_PAYMENTS_ENABLED && (
          <div className={`pay-form${tab === 'cod' ? ' active' : ''}`}>
            <p className="secure-note">You pay in cash when your order is delivered. No card details are needed.</p>
          </div>
        )}
        {CARD_PAYMENTS_ENABLED && (
        <div className={`pay-form${tab === 'card' ? ' active' : ''}`}>
          <div className={`form-field${errors.number ? ' has-error' : ''}`}>
            <label htmlFor="card-number">Card Number</label>
            <CardNumberElement key={`n-${theme}`} id="card-number" className="stripe-field" options={elementOptions('4242 4242 4242 4242')} onChange={track('number')} />
            {errors.number && <span className="field-error">{errors.number}</span>}
          </div>
          <div className="form-r2">
            <div className={`form-field${errors.expiry ? ' has-error' : ''}`}>
              <label htmlFor="card-expiry">Expiry</label>
              <CardExpiryElement key={`e-${theme}`} id="card-expiry" className="stripe-field" options={elementOptions('MM / YY')} onChange={track('expiry')} />
              {errors.expiry && <span className="field-error">{errors.expiry}</span>}
            </div>
            <div className={`form-field${errors.cvc ? ' has-error' : ''}`}>
              <label htmlFor="card-cvv">CVV</label>
              <CardCvcElement key={`c-${theme}`} id="card-cvv" className="stripe-field" options={elementOptions('123')} onChange={track('cvc')} />
              {errors.cvc && <span className="field-error">{errors.cvc}</span>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="card-name">Name on Card</label>
            <input id="card-name" type="text" placeholder="PRIYA MEHTA" value={cardName} onChange={(e) => onCardName(e.target.value)} autoComplete="cc-name" />
          </div>
        </div>
        )}
        {formError && <p className="field-error">{formError}</p>}
        {CARD_PAYMENTS_ENABLED && <p className="secure-note">🔒 Your payment is secured by 256-bit SSL encryption</p>}
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
