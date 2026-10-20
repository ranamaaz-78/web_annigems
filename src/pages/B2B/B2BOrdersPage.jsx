import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatPrice } from '../../utils/format';
import { isFulfilling } from '../../utils/orderStatus';

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'approval', label: 'Awaiting approval', test: (o) => o.approval === 'pending' },
  { id: 'payment', label: 'Payment due', test: (o) => o.approval === 'approved' && !isFulfilling(o) },
  { id: 'progress', label: 'In progress', test: (o) => isFulfilling(o) && o.stage < 4 },
  { id: 'done', label: 'Delivered', test: (o) => isFulfilling(o) && o.stage >= 4 },
];

export default function B2BOrdersPage() {
  const { myOrders } = useAuth();
  const [filter, setFilter] = useState('all');
  const active = FILTERS.find((f) => f.id === filter);
  const list = myOrders.filter(active.test);

  return (
    <>
      <div className="chips b2b-filters">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip${filter === f.id ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label} ({myOrders.filter(f.test).length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="◈" title="No orders here" text="Orders matching this filter will appear here." actionLabel="Browse catalogue" actionTo="/shop" />
      ) : (
        <div className="orders-list" data-stagger=".order-card">
          {list.map((o) => (
            <article className="order-card" key={o.id}>
              <div className="order-card-top">
                <div>
                  <p className="order-id">#{o.id}</p>
                  <p className="muted">
                    Placed {formatDate(o.createdAt)}
                    {o.poNumber && ` · ${o.poNumber}`}
                  </p>
                </div>
                <OrderStatusBadge order={o} />
              </div>
              <div className="order-thumbs">
                {o.items.map((i) => (
                  <img key={i.key} src={i.image} alt={i.name} title={i.name} />
                ))}
                <span className="muted">{o.items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
              </div>
              <div className="order-card-bot">
                <strong className="order-total">{formatPrice(o.totals.total)}</strong>
                <Link to={`/b2b/orders/${o.id}`} className="btn-outline btn-sm">
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
