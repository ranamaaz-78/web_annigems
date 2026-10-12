import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import PageHero from '../../components/common/PageHero';
import Timeline from '../../components/common/Timeline';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/format';
import { validateEmail, validateRequired } from '../../utils/validate';

export default function TrackOrderPage() {
  const { getOrder } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ id: params.get('id') || '', email: params.get('email') || '' });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(() => {
    const id = params.get('id');
    const email = params.get('email');
    const found = id && email ? getOrder(id) : null;
    return found && found.email === email.trim().toLowerCase() ? found : null;
  });
  const [notFound, setNotFound] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = { id: validateRequired(form.id, 'Order number'), email: validateEmail(form.email) };
    setErrors(errs);
    if (errs.id || errs.email) return;
    const order = getOrder(form.id);
    if (order && order.email === form.email.trim().toLowerCase()) {
      setResult(order);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="page-wrap narrow">
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Track Order' }]}
        eyebrow="Delivery status"
        title="Track Your Order"
        subtitle="Enter your order number and the email used at checkout to see where your piece is."
      />

      <form className="side-card track-form" onSubmit={handleSubmit} noValidate data-reveal="up">
        <div className="form-r2">
          <FormField id="tr-id" name="id" label="Order Number" placeholder="AG-48213" value={form.id} onChange={set('id')} error={errors.id} />
          <FormField id="tr-email" name="email" label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} />
        </div>
        <button type="submit" className="btn-gold" data-magnetic>
          Track Order
        </button>
        <p className="muted">
          Try the demo order <strong>AG-48213</strong> with <strong>demo@aanigems.com</strong>.
        </p>
      </form>

      {notFound && (
        <p className="form-alert" role="alert">
          We could not find an order matching those details. Please check and try again.
        </p>
      )}

      {result && (
        <div className="side-card track-result" data-reveal="up">
          <div className="order-card-top">
            <div>
              <h3 className="cs-title" style={{ border: 0, margin: 0, padding: 0 }}>
                Order #{result.id}
              </h3>
              <p className="muted">
                {result.items.length} item(s) · {formatPrice(result.totals.total)}
              </p>
            </div>
            <OrderStatusBadge stage={result.stage} />
          </div>
          <Timeline stage={result.stage} createdAt={result.createdAt} />
          <p className="muted">
            Questions about your order? <Link to="/contact">Contact us</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
