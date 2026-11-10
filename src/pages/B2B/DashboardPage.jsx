import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatPrice } from '../../utils/format';

const DELIVERED = 4;

// Business home: membership, sales person, order counts and recent orders (all from the API).
export default function DashboardPage() {
  const { user, myOrders } = useAuth();
  const company = user.company ?? {};
  const live = myOrders.filter((o) => o.status !== 'cancelled');
  const awaiting = myOrders.filter((o) => o.status === 'awaiting_approval').length;
  const inProgress = myOrders.filter((o) => o.status === 'confirmed' && o.stage < DELIVERED).length;
  const delivered = myOrders.filter((o) => o.status === 'confirmed' && o.stage >= DELIVERED).length;
  const spend = live.reduce((s, o) => s + o.totals.total, 0);

  return (
    <>
      <div className="stat-row four" data-stagger=".stat-card">
        <div className="stat-card">
          <span className="stat-num">{awaiting}</span>
          <span>Awaiting approval</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{inProgress}</span>
          <span>In progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{delivered}</span>
          <span>Delivered</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{formatPrice(spend)}</span>
          <span>Total ordered</span>
        </div>
      </div>

      <div className="side-card" data-reveal="up">
        <div className="acct-head">
          <h3 className="cs-title">Your membership</h3>
          <Link to="/b2b/company" className="auth-link">
            Company profile →
          </Link>
        </div>
        <div className="cs-rows">
          <div className="cs-row">
            <span>Tier</span>
            <span>{company.tier || '-'}</span>
          </div>
          {company.salesPerson && (
            <div className="cs-row">
              <span>Your sales person</span>
              <span>
                {company.salesPerson.name} · <a href={`mailto:${company.salesPerson.email}`}>{company.salesPerson.email}</a>
              </span>
            </div>
          )}
          <div className="cs-row">
            <span>Payment</span>
            <span>Cash on delivery</span>
          </div>
        </div>
        <p className="muted">Your member prices are shown across the catalogue and in your bag. Each order is approved by our team before crafting starts.</p>
      </div>

      <div className="side-card" data-reveal="up">
        <div className="acct-head">
          <h3 className="cs-title">Recent orders</h3>
          <Link to="/b2b/orders" className="auth-link">
            All orders →
          </Link>
        </div>
        {myOrders.length === 0 ? (
          <p className="muted">No orders yet. Browse the catalogue to place your first order.</p>
        ) : (
          <ul className="b2b-todo">
            {myOrders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <div>
                  <Link to={`/b2b/orders/${o.id}`}>
                    <strong>#{o.id}</strong>
                  </Link>
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
