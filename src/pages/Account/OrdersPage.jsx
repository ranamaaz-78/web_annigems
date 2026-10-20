import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatPrice } from '../../utils/format';

export default function OrdersPage() {
  const { myOrders } = useAuth();

  if (!myOrders.length) {
    return <EmptyState icon="◈" title="No orders yet" text="When you place an order it will appear here." actionLabel="Start Shopping" actionTo="/shop" />;
  }

  return (
    <div className="orders-list" data-stagger=".order-card">
      {myOrders.map((o) => (
        <article className="order-card" key={o.id}>
          <div className="order-card-top">
            <div>
              <p className="order-id">#{o.id}</p>
              <p className="muted">Placed {formatDate(o.createdAt)}</p>
            </div>
            <OrderStatusBadge order={o} />
          </div>
          <div className="order-thumbs">
            {o.items.map((i) => (
              <img key={i.key} src={i.image} alt={i.name} title={i.name} />
            ))}
            <span className="muted">
              {o.items.reduce((s, i) => s + i.qty, 0)} item(s)
            </span>
          </div>
          <div className="order-card-bot">
            <strong className="order-total">{formatPrice(o.totals.total)}</strong>
            <div>
              <Link to={`/track-order?id=${o.id}&email=${encodeURIComponent(o.email)}`} className="btn-ghost">
                Track
              </Link>{' '}
              <Link to={`/account/orders/${o.id}`} className="btn-outline btn-sm">
                View details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
