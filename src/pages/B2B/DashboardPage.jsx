import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { creditSummary } from '../../utils/credit';
import { formatDate, formatPrice } from '../../utils/format';
import { isFulfilling } from '../../utils/orderStatus';

// What needs the business user's attention, by order.
const attention = (o) => {
  if (o.approval === 'approved' && o.payment.status === 'unpaid') return 'Approved - choose how to pay';
  if (o.payment.status === 'link_sent') return 'Payment link is ready';
  return null;
};

export default function DashboardPage() {
  const { user, myOrders, orders } = useAuth();
  const credit = creditSummary(user, orders);
  const pending = myOrders.filter((o) => o.approval === 'pending').length;
  const inProduction = myOrders.filter((o) => isFulfilling(o) && o.stage < 4).length;
  const todo = myOrders.filter(attention);
  const usedPct = credit.limit ? Math.min(100, (credit.used / credit.limit) * 100) : 0;

  return (
    <>
      <div className="stat-row four" data-stagger=".stat-card">
        <div className="stat-card">
          <span className="stat-num">{formatPrice(credit.available)}</span>
          <span>Available credit</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{pending}</span>
          <span>Awaiting approval</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{todo.length}</span>
          <span>Need your action</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{inProduction}</span>
          <span>In production</span>
        </div>
      </div>

      <div className="side-card" data-reveal="up">
        <div className="acct-head">
          <h3 className="cs-title">Credit line</h3>
          <Link to="/b2b/credit" className="auth-link">
            Manage credit →
          </Link>
        </div>
        <div className="credit-bar">
          <span style={{ width: `${usedPct}%` }} />
        </div>
        <p className="muted">
          {formatPrice(credit.used)} used of {formatPrice(credit.limit)} · {user.creditTermsDays}-day terms
        </p>
      </div>

      {todo.length > 0 && (
        <div className="side-card" data-reveal="up">
          <h3 className="cs-title">Needs your attention</h3>
          <ul className="b2b-todo">
            {todo.map((o) => (
              <li key={o.id}>
                <div>
                  <strong>#{o.id}</strong>
                  <small>{attention(o)}</small>
                </div>
                <Link to={`/b2b/orders/${o.id}`} className="btn-outline btn-sm">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="side-card" data-reveal="up">
        <div className="acct-head">
          <h3 className="cs-title">Recent orders</h3>
          <Link to="/b2b/orders" className="auth-link">
            All orders →
          </Link>
        </div>
        {myOrders.length === 0 ? (
          <p className="muted">No orders yet. Browse the catalogue to place your first trade order.</p>
        ) : (
          <ul className="b2b-todo">
            {myOrders.slice(0, 4).map((o) => (
              <li key={o.id}>
                <div>
                  <strong>#{o.id}</strong>
                  <small>
                    {formatDate(o.createdAt)} · {formatPrice(o.totals.total)}
                  </small>
                </div>
                <OrderStatusBadge order={o} />
              </li>
            ))}
          </ul>
        )}
        <div className="co-btns" style={{ marginTop: 18 }}>
          <Link to="/shop" className="btn-gold">
            Browse catalogue
          </Link>
          <Link to="/design-your-ring" className="btn-outline">
            Design a ring
          </Link>
        </div>
      </div>
    </>
  );
}
