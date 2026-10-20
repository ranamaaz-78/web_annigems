import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useB2B } from '../../hooks/useB2B';
import { useUI } from '../../hooks/useUI';
import { creditSummary } from '../../utils/credit';
import { formatDate, formatPrice } from '../../utils/format';

const REQUEST_STATUS = { pending: 'Pending', approved: 'Approved', rejected: 'Declined' };

export default function CreditPage() {
  const { user, orders, myOrders } = useAuth();
  const { creditRequests, requestCredit } = useB2B();
  const { showToast } = useUI();
  const [form, setForm] = useState({ amount: '', note: '' });
  const [error, setError] = useState('');

  const credit = creditSummary(user, orders);
  const usedPct = credit.limit ? Math.min(100, (credit.used / credit.limit) * 100) : 0;
  const creditOrders = myOrders.filter((o) => o.payment?.method === 'credit' && o.payment.status !== 'unpaid');
  const requests = creditRequests.filter((r) => r.email === user.email);
  const hasPending = requests.some((r) => r.status === 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= credit.limit) return setError(`Enter an amount higher than your current limit (${formatPrice(credit.limit)}).`);
    setError('');
    requestCredit({ email: user.email, company: user.company?.name ?? '', amount, note: form.note.trim() });
    setForm({ amount: '', note: '' });
    return showToast('Credit request sent to our team');
  };

  return (
    <>
      <div className="stat-row" data-stagger=".stat-card">
        <div className="stat-card">
          <span className="stat-num">{formatPrice(credit.limit)}</span>
          <span>Credit limit</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{formatPrice(credit.used)}</span>
          <span>Used</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{formatPrice(credit.available)}</span>
          <span>Available</span>
        </div>
      </div>

      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Your credit line</h3>
        <div className="credit-bar">
          <span style={{ width: `${usedPct}%` }} />
        </div>
        <p className="muted">
          {Math.round(usedPct)}% used · Payment terms: {user.creditTermsDays} days from approval. Pick &ldquo;Pay on credit&rdquo; on an approved order to use it.
        </p>
      </div>

      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Orders on credit</h3>
        {creditOrders.length === 0 ? (
          <p className="muted">No credit orders yet.</p>
        ) : (
          <ul className="b2b-todo">
            {creditOrders.map((o) => (
              <li key={o.id}>
                <div>
                  <strong>
                    <Link to={`/b2b/orders/${o.id}`}>#{o.id}</Link> · {formatPrice(o.totals.total)}
                  </strong>
                  <small>
                    {o.payment.status === 'credit_requested' && 'Credit under review'}
                    {o.payment.status === 'credit_approved' && `Due ${o.payment.dueAt ? formatDate(o.payment.dueAt) : 'per terms'}`}
                    {o.payment.status === 'credit_settled' && 'Settled'}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="side-card" data-reveal="up">
        <h3 className="cs-title">Request a higher credit limit</h3>
        {hasPending ? (
          <p className="muted">You already have a request under review. We will update this page once it is decided.</p>
        ) : (
          <form className="co-form" onSubmit={handleSubmit} noValidate>
            <FormField id="cr-amount" label="Requested limit (USD)" type="number" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} error={error} placeholder="40000" />
            <FormField id="cr-note" as="textarea" label="Reason (optional)" rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Seasonal stock-up, new showroom..." />
            <button type="submit" className="btn-gold">
              Send request
            </button>
          </form>
        )}
        {requests.length > 0 && (
          <ul className="b2b-todo" style={{ marginTop: 18 }}>
            {requests.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{formatPrice(r.amount)}</strong>
                  <small>Requested {formatDate(r.createdAt)}</small>
                </div>
                <span className={`status-badge ${r.status === 'approved' ? 'done' : r.status === 'rejected' ? 'bad' : 'warn'}`}>{REQUEST_STATUS[r.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
