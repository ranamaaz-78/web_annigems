import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';

// Simulated hosted payment page opened from the admin's payment link. No real payment happens.
export default function PayPage() {
  const { id } = useParams();
  const { myOrders, updateOrder } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const order = myOrders.find((o) => o.id === id);

  if (!order || order.payment?.status !== 'link_sent') return <Navigate to={order ? `/b2b/orders/${id}` : '/b2b/orders'} replace />;

  const handlePay = () => {
    updateOrder(id, (o) => ({ stage: 1, payment: { ...o.payment, status: 'paid', paidAt: Date.now() } }));
    showToast('Payment received. Crafting will begin shortly.');
    navigate(`/b2b/orders/${id}`, { replace: true });
  };

  return (
    <div className="page-wrap narrow">
      <PageHero crumbs={[{ label: 'Business', to: '/b2b' }, { label: 'Pay invoice' }]} eyebrow="Secure payment" title={`Pay order #${order.id}`} />
      <div className="side-card pay-gateway" data-reveal="up">
        <p className="muted">Demo payment page. In production this link opens your payment provider.</p>
        <div className="pay-amount">{formatPrice(order.totals.total)}</div>
        <div className="cs-rows">
          <div className="cs-row">
            <span>Business</span>
            <span>{order.company}</span>
          </div>
          <div className="cs-row">
            <span>Items</span>
            <span>{order.items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
        </div>
        <div className="co-btns">
          <Link to={`/b2b/orders/${id}`} className="btn-ghost">
            Cancel
          </Link>
          <button className="btn-gold" onClick={handlePay}>
            Pay {formatPrice(order.totals.total)}
          </button>
        </div>
      </div>
    </div>
  );
}
