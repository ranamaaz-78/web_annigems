import { useAuth } from '../../hooks/useAuth';
import { COUNTRIES, SHIPPING_METHODS } from '../../data/site';
import { shippingCost } from '../../utils/pricing';
import { formatPrice } from '../../utils/format';

const Field = ({ id, label, ...input }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} {...input} />
  </div>
);

export default function ShippingStep({ subtotal, shippingMethod, onShippingMethod, onNext, active }) {
  const { user } = useAuth();
  const addr = user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onNext({
      name: `${f.get('first')} ${f.get('last')}`.trim(),
      email: f.get('email'),
      phone: f.get('phone'),
      line1: f.get('line1'),
      city: f.get('city'),
      zip: f.get('zip'),
      state: f.get('state'),
      country: f.get('country'),
    });
  };

  return (
    <div className={`co-panel${active ? ' active' : ''}`}>
      <h2 className="co-panel-title">Shipping Information</h2>
      <form className="co-form" onSubmit={handleSubmit}>
        <div className="form-r2">
          <Field id="ship-first" name="first" label="First Name" type="text" placeholder="Priya" defaultValue={user?.firstName} required />
          <Field id="ship-last" name="last" label="Last Name" type="text" placeholder="Mehta" defaultValue={user?.lastName} required />
        </div>
        <Field id="ship-email" name="email" label="Email" type="email" placeholder="priya@example.com" defaultValue={user?.email} required />
        <Field id="ship-phone" name="phone" label="Phone" type="tel" placeholder="+91 98765 43210" defaultValue={user?.phone} />
        <Field id="ship-address" name="line1" label="Address" type="text" placeholder="123 Bandra West" defaultValue={addr?.line1} required />
        <div className="form-r2">
          <Field id="ship-city" name="city" label="City" type="text" placeholder="Mumbai" defaultValue={addr?.city} required />
          <Field id="ship-zip" name="zip" label="PIN / ZIP" type="text" placeholder="400050" defaultValue={addr?.zip} required />
        </div>
        <div className="form-r2">
          <Field id="ship-state" name="state" label="State" type="text" placeholder="Maharashtra" defaultValue={addr?.state} />
          <div className="form-field">
            <label htmlFor="ship-country">Country</label>
            <select id="ship-country" name="country" defaultValue={addr?.country}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ship-opts">
          <h4>Delivery Method</h4>
          {SHIPPING_METHODS.map((m) => {
            const cost = shippingCost(m.id, subtotal);
            return (
              <label className="ship-opt" key={m.id}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === m.id}
                  onChange={() => onShippingMethod(m.id)}
                />
                <div className="so-info">
                  <span className="so-name">{m.name}</span>
                  <span className="so-time">{m.time}</span>
                </div>
                <span className="so-price">{cost === 0 ? 'Free' : formatPrice(cost)}</span>
              </label>
            );
          })}
        </div>

        <button type="submit" className="btn-gold">
          Continue to Payment →
        </button>
      </form>
    </div>
  );
}
