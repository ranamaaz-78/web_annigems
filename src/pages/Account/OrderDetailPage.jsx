import { Link, useNavigate, useParams } from 'react-router-dom';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import Timeline from '../../components/common/Timeline';
import { SHIPPING_METHODS } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { formatDate, formatPrice } from '../../utils/format';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { myOrders } = useAuth();
  const { addToCart } = useShop();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const order = myOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="side-card">
        <h3 className="cs-title">Order not found</h3>
        <p className="muted">We could not find that order on your account.</p>
        <Link to="/account/orders" className="btn-gold" style={{ marginTop: 16 }}>
          Back to orders
        </Link>
      </div>
    );
  }

  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);

  const reorder = () => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.qty; i += 1) addToCart({ ...item, qty: undefined });
    });
    showToast('Items added to cart');
    navigate('/cart');
  };

  return (
    <div className="order-detail">
      <Link to="/account/orders" className="auth-link">
        ← All orders
      </Link>
      <div className="side-card" data-reveal="up">
        <div className="order-card-top">
          <div>
            <h3 className="cs-title" style={{ border: 0, margin: 0, padding: 0 }}>
              Order #{order.id}
            </h3>
            <p className="muted">Placed {formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge stage={order.stage} />
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="side-card" data-reveal="up">
          <h3 className="cs-title">Items</h3>
          <div className="ro-items">
            {order.items.map((item) => (
              <div className="ro-item" key={item.key}>
                <img className="ro-img" src={item.image} alt={item.name} />
                <div className="ro-info">
                  <p className="ro-name">{item.name}</p>
                  <p className="ro-meta">
                    Qty {item.qty}
                    {item.meta?.size && ` · Size ${item.meta.size}`}
                  </p>
                </div>
                <span className="ro-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="cs-rows" style={{ marginTop: 20 }}>
            <div className="cs-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div className="cs-row">
                <span>Discount</span>
                <span>−{formatPrice(order.totals.discount)}</span>
              </div>
            )}
            <div className="cs-row">
              <span>Shipping ({method?.name})</span>
              <span>{order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}</span>
            </div>
            <div className="cs-row">
              <span>Tax</span>
              <span>{formatPrice(order.totals.tax)}</span>
            </div>
          </div>
          <div className="cs-total-row">
            <span>Total</span>
            <span className="cs-total-val">{formatPrice(order.totals.total)}</span>
          </div>
          <button className="btn-outline" onClick={reorder}>
            Reorder
          </button>
        </div>

        <div>
          <div className="side-card" data-reveal="up">
            <h3 className="cs-title">Progress</h3>
            <Timeline stage={order.stage} createdAt={order.createdAt} />
          </div>
          {order.address && (
            <div className="side-card" data-reveal="up" style={{ marginTop: 20 }}>
              <h3 className="cs-title">Shipping to</h3>
              <p className="muted">
                {order.address.name}
                <br />
                {order.address.line1}
                <br />
                {order.address.city}, {order.address.state} {order.address.zip}
                <br />
                {order.address.country}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
