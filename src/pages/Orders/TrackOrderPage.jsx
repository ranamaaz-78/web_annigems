import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import PageHero from '../../components/common/PageHero';
import Timeline from '../../components/common/Timeline';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/format';
import { orderTimeline } from '../../utils/orderStatus';
import { validateEmail, validateRequired } from '../../utils/validate';

export default function TrackOrderPage() {
  const { fetchOrder, getOrder, user, isB2B, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ id: params.get('id') || '', email: params.get('email') || '' });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const signedIn = Boolean(user) && !isB2B;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Orders are looked up on the signed-in account (GET /orders/{number}); the email must match too.
  const lookup = async (id, email) => {
    setBusy(true);
    let order = null;
    try {
      order = await fetchOrder(id);
    } catch {
      order = null;
    }
    setBusy(false);
    const match = order && order.email.toLowerCase() === email.trim().toLowerCase();
    setResult(match ? order : null);
    setNotFound(!match);
  };

  useEffect(() => {
    const id = params.get('id');
    const email = params.get('email');
    if (loading || !signedIn || !id || !email) return;
    const cached = getOrder(id);
    if (cached && cached.email.toLowerCase() === email.trim().toLowerCase()) setResult(cached);
    lookup(id, email);
    // Only for the order in the link, once the session is known.
  }, [loading, signedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = { id: validateRequired(form.id, 'Order number'), email: validateEmail(form.email) };
    setErrors(errs);
    if (errs.id || errs.email || busy) return;
    if (!signedIn) {
      const next = `/track-order?id=${encodeURIComponent(form.id.trim())}&email=${encodeURIComponent(form.email.trim())}`;
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    lookup(form.id, form.email);
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
        <button type="submit" className="btn-gold" data-magnetic disabled={busy}>
          {busy ? 'Looking up…' : 'Track Order'}
        </button>
        {!signedIn && (
          <p className="muted">
            Please <Link to="/login?next=/track-order">sign in</Link> with the account used at checkout to track your order.
          </p>
        )}
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
            <OrderStatusBadge order={result} />
          </div>
          <Timeline {...orderTimeline(result)} createdAt={result.createdAt} />
          <p className="muted">
            Questions about your order? <Link to="/contact">Contact us</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
