import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { creditSummary } from '../../utils/credit';
import { formatDate, formatPrice } from '../../utils/format';

// Payment step of a business order. Everything here is a *request*; the admin completes it.
export default function PaymentPanel({ order }) {
  const { user, orders, updateOrder } = useAuth();
  const { showToast } = useUI();
  const credit = creditSummary(user, orders);
  const { payment } = order;
  const canUseCredit = credit.available >= order.totals.total;

  const setPayment = (patch, message) => {
    updateOrder(order.id, (o) => ({ payment: { ...o.payment, ...patch } }));
    if (message) showToast(message);
  };

  if (order.approval === 'pending') {
    return (
      <div className="side-card pay-panel">
        <h3 className="cs-title">Payment</h3>
        <p className="muted">Payment opens once our team approves this order. We will update the status here.</p>
      </div>
    );
  }

  if (order.approval === 'rejected') {
    return (
      <div className="side-card pay-panel">
        <h3 className="cs-title">Order not approved</h3>
        <p className="form-alert">{order.approvalNote || 'This order could not be approved. Please contact us for details.'}</p>
        <Link to="/contact" className="btn-outline btn-sm">
          Contact us
        </Link>
      </div>
    );
  }

  return (
    <div className="side-card pay-panel">
      <h3 className="cs-title">Payment</h3>

      {payment.status === 'unpaid' && (
        <>
          <p className="muted">Your order is approved. Choose how you would like to pay {formatPrice(order.totals.total)}.</p>
          <div className="pay-choices">
            <div className="pay-choice">
              <strong>Pay by payment link</strong>
              <small>Request a secure payment link. It will appear here once our team shares it.</small>
              <button
                className="btn-gold btn-sm"
                onClick={() => setPayment({ method: 'online', status: 'link_requested', requestedAt: Date.now() }, 'Payment link requested')}
              >
                Request payment link
              </button>
            </div>
            <div className="pay-choice">
              <strong>Pay on credit</strong>
              <small>
                Available credit: {formatPrice(credit.available)} · {user.creditTermsDays}-day terms
              </small>
              {canUseCredit ? (
                <button
                  className="btn-outline btn-sm"
                  onClick={() => setPayment({ method: 'credit', status: 'credit_requested', requestedAt: Date.now() }, 'Credit payment requested')}
                >
                  Request credit payment
                </button>
              ) : (
                <>
                  <small className="pay-warn">Not enough available credit for this order.</small>
                  <Link to="/b2b/credit" className="btn-outline btn-sm">
                    Request more credit
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {payment.status === 'link_requested' && (
        <>
          <p className="pay-state">Payment link requested</p>
          <p className="muted">Our team will share your payment link shortly. It will show up on this page.</p>
          <button className="btn-ghost" onClick={() => setPayment({ method: null, status: 'unpaid' }, 'Request cancelled')}>
            Cancel request
          </button>
        </>
      )}

      {payment.status === 'link_sent' && (
        <>
          <p className="pay-state ok">Your payment link is ready</p>
          <p className="muted">Amount due: {formatPrice(order.totals.total)}</p>
          <Link to={payment.link || `/b2b/pay/${order.id}`} className="btn-gold">
            Pay {formatPrice(order.totals.total)} →
          </Link>
        </>
      )}

      {payment.status === 'credit_requested' && (
        <>
          <p className="pay-state">Credit payment under review</p>
          <p className="muted">Our team is reviewing your credit request for this order.</p>
          <button className="btn-ghost" onClick={() => setPayment({ method: null, status: 'unpaid' }, 'Request cancelled')}>
            Cancel request
          </button>
        </>
      )}

      {payment.status === 'paid' && (
        <p className="pay-state ok">Paid{payment.paidAt ? ` on ${formatDate(payment.paidAt)}` : ''}. Thank you!</p>
      )}
      {payment.status === 'credit_approved' && (
        <p className="pay-state ok">
          On credit · {formatPrice(order.totals.total)}
          {payment.dueAt ? ` due ${formatDate(payment.dueAt)}` : ''}
        </p>
      )}
      {payment.status === 'credit_settled' && <p className="pay-state ok">Credit invoice settled. Thank you!</p>}
    </div>
  );
}
