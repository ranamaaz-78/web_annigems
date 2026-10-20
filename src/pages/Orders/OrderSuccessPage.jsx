import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/format';

const SPARKS = 28;

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { getOrder } = useAuth();
  const order = getOrder(id);
  const root = useRef(null);
  const isB2B = order?.type === 'b2b';

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ delay: 1.1 });
      tl.from('.os-icon', { scale: 0, rotation: -90, duration: 0.9, ease: 'back.out(2)' })
        .from('.os-title, .os-sub, .os-num, .os-acts, .os-card', { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .fromTo(
          '.spark',
          { x: 0, y: 0, scale: 0, opacity: 1 },
          {
            x: () => gsap.utils.random(-260, 260),
            y: () => gsap.utils.random(-220, 120),
            scale: () => gsap.utils.random(0.5, 1.4),
            rotation: () => gsap.utils.random(-180, 180),
            opacity: 0,
            duration: 1.8,
            ease: 'power3.out',
            stagger: 0.015,
          },
          0.15,
        );
    },
    { scope: root },
  );

  return (
    <div className="order-success" ref={root}>
      <div className="sparks" aria-hidden="true">
        {Array.from({ length: SPARKS }, (_, i) => (
          <span key={i} className="spark" />
        ))}
      </div>
      <span className="os-icon">✦</span>
      <h1 className="os-title">{isB2B ? 'Order Submitted!' : 'Order Placed!'}</h1>
      <p className="os-sub">
        {isB2B ? (
          <>
            Your order is waiting for admin approval. Once approved you can pay by payment link or on credit
            <br />
            from your business dashboard. Crafting starts after payment is confirmed.
          </>
        ) : (
          <>
            Thank you for your purchase. A confirmation has been sent to your email.
            <br />
            Your order will be crafted and shipped within 4-6 weeks.
          </>
        )}
      </p>
      <p className="os-num">Order #{id}</p>

      {order && (
        <div className="os-card">
          {order.items.map((i) => (
            <div key={i.key} className="os-line">
              <img src={i.image} alt={i.name} />
              <span>
                {i.name} <small>× {i.qty}</small>
              </span>
              <b>{formatPrice(i.price * i.qty)}</b>
            </div>
          ))}
          <div className="os-line os-total">
            <span>{isB2B ? 'Order total' : 'Total paid'}</span>
            <b>{formatPrice(order.totals.total)}</b>
          </div>
        </div>
      )}

      <div className="os-acts">
        {isB2B ? (
          <Link className="btn-gold" to={`/b2b/orders/${id}`}>
            View Order
          </Link>
        ) : (
          <Link className="btn-gold" to={`/track-order?id=${id}&email=${encodeURIComponent(order?.email ?? '')}`}>
            Track Order
          </Link>
        )}
        <Link className="btn-outline" to="/shop">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
