import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorText } from '../../api/client';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import Timeline from '../../components/common/Timeline';
import { CONFIG_RINGS, CONFIG_STONES } from '../../data/configurator';
import { getProductById } from '../../data/products';
import { SHIPPING_METHODS } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { productCartItem } from '../../utils/cart';
import { formatDate, formatPrice } from '../../utils/format';

// A reorder line from the API -> a cart line (same shape the product page and configurator add).
function toCartLine(line, order) {
  if (line.type === 'product') {
    const product = getProductById(line.legacy_id) ?? getProductById(line.product_id);
    if (!product) return null;
    return { ...productCartItem(product, line.size ?? null), qty: line.qty };
  }
  const ring = CONFIG_RINGS.find((r) => r.id === line.ring_id);
  const stone = CONFIG_STONES.find((st) => st.id === line.stone_id);
  if (!ring || !stone) return null;
  const past = order.items.find((i) => i.ringId === line.ring_id && i.stoneId === line.stone_id);
  return {
    key: `conf-${ring.id}-${stone.id}-${line.size}`,
    id: `conf-${ring.id}-${stone.id}-${line.size}`,
    kind: 'config',
    ringId: ring.id,
    stoneId: stone.id,
    name: past?.name ?? `${ring.name} with ${stone.name}`,
    subtitle: past?.subtitle ?? '',
    price: past?.price ?? 0,
    image: stone.images?.[ring.id] ?? ring.image,
    meta: { size: line.size, stone: stone.name, ring: ring.name },
    qty: line.qty,
  };
}

// Order detail for customers (/account/orders/:id) and business accounts (/b2b/orders/:id).
export default function OrderDetailPage() {
  const { id } = useParams();
  const { myOrders, isB2B, fetchOrder } = useAuth();
  const backTo = isB2B ? '/b2b/orders' : '/account/orders';
  const { addToCart } = useShop();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const order = myOrders.find((o) => o.id === id);
  const [lookedUp, setLookedUp] = useState(false);
  const [busy, setBusy] = useState(false);

  // Refresh the order from the API (status, tracking, timeline).
  useEffect(() => {
    fetchOrder(id)
      .catch(() => {})
      .finally(() => setLookedUp(true));
  }, [id, fetchOrder]);

  if (!order && !lookedUp) return null;

  if (!order) {
    return (
      <div className="side-card">
        <h3 className="cs-title">Order not found</h3>
        <p className="muted">We could not find that order on your account.</p>
        <Link to={backTo} className="btn-gold" style={{ marginTop: 16 }}>
          Back to orders
        </Link>
      </div>
    );
  }

  const method = order.shippingMethodName ? { name: order.shippingMethodName } : SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);

  const addLines = (lines) => lines.forEach((line) => {
    for (let i = 0; i < line.qty; i += 1) addToCart({ ...line, qty: undefined });
  });

  // POST /orders/{number}/reorder returns the still-available lines (prices are quoted again in the cart).
  const reorder = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await api(`orders/${encodeURIComponent(order.number)}/reorder`, { method: 'POST' });
      const lines = res.data.items.map((line) => toCartLine(line, order)).filter(Boolean);
      addLines(lines);
      const skipped = res.data.unavailable ?? [];
      if (!lines.length) {
        showToast('These items are no longer available');
        setBusy(false);
        return;
      }
      showToast(skipped.length ? `Items added to cart (${skipped.length} no longer available)` : 'Items added to cart');
      navigate('/cart');
    } catch (err) {
      setBusy(false);
      showToast(errorText(err));
    }
  };

  return (
    <div className="order-detail">
      <Link to={backTo} className="auth-link">
        ← All orders
      </Link>
      <div className="side-card" data-reveal="up">
        <div className="order-card-top">
          <div>
            <h3 className="cs-title" style={{ border: 0, margin: 0, padding: 0 }}>
              Order #{order.id}
            </h3>
            <p className="muted">
              Placed {formatDate(order.createdAt)}
              {order.paymentMethod === 'cod' && ' · Cash on delivery'}
            </p>
          </div>
          <OrderStatusBadge order={order} />
        </div>
        {order.status === 'awaiting_approval' && <p className="muted">Our team is reviewing this order. We will email you once it is approved and crafting starts.</p>}
        {order.status === 'cancelled' && order.cancelReason && <p className="muted">Reason: {order.cancelReason}</p>}
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
                    {item.b2bPercent > 0 && ` · ${item.b2bPercent}% member discount`}
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
          <button className="btn-outline" onClick={reorder} disabled={busy}>
            {busy ? 'Adding…' : 'Reorder'}
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
