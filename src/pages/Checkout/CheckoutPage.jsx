import { Elements, useElements, useStripe, CardNumberElement } from '@stripe/react-stripe-js';
import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, errorText } from '../../api/client';
import { getStripe } from '../../api/stripe';
import { useAuth } from '../../hooks/useAuth';
import { useShop } from '../../hooks/useShop';
import { toApiLine } from '../../utils/cart';
import B2BReviewStep from './B2BReviewStep';
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import ShippingStep from './ShippingStep';

const newKey = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// Retail checkout: POST /checkout creates the order (prices are computed by the API) and returns a
// Stripe PaymentIntent, which is confirmed here with the card fields. The order is then marked paid
// by the Stripe webhook; /order-success/:id follows its status.
// Business (B2B) checkout is unchanged: a local demo order sent for approval.
function Checkout() {
  const { cart, totals, couponCode, clearCart, removeCoupon, shippingMethod, setShippingMethod, shippingOptions, cartValid, quoting } = useShop();
  const { user, loading, placeB2BOrder, isB2B, cacheOrder } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [cardName, setCardName] = useState('');
  const [placed, setPlaced] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // One Idempotency-Key per distinct order attempt: a retry of the same cart replays the same order.
  const attempt = useRef({ sig: '', key: '' });

  const goToStep = (n) => {
    setStep(n);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (busy) return;
    if (!stripe || !elements) return setError('Card payments are not available right now. Please try again later.');
    if (!cartValid) return setError(quoting ? 'Updating your order total… please try again in a moment.' : 'Some items in your bag are unavailable. Please review your cart.');

    const body = {
      items: cart.map(toApiLine),
      shipping_method: shippingMethod,
      coupon_code: couponCode || null,
      address: {
        name: address.name,
        phone: address.phone || null,
        line1: address.line1,
        city: address.city,
        state: address.state || null,
        zip: address.zip,
        country_code: address.countryCode,
      },
    };
    const sig = JSON.stringify(body);
    if (attempt.current.sig !== sig) attempt.current = { sig, key: newKey() };

    setBusy(true);
    setError('');
    try {
      const res = await api('checkout', { method: 'POST', body, headers: { 'Idempotency-Key': attempt.current.key } });
      const order = cacheOrder(res.data.order);
      const payment = res.data.payment;
      if (payment?.client_secret) {
        const result = await stripe.confirmCardPayment(payment.client_secret, {
          payment_method: { card: elements.getElement(CardNumberElement), billing_details: { name: cardName.trim(), email: user?.email } },
        });
        if (result.error) {
          setBusy(false);
          return setError(result.error.message || 'Your card was declined. Please try another card.');
        }
      }
      setPlaced(true);
      clearCart();
      removeCoupon();
      return navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      setBusy(false);
      return setError(errorText(err, 'We could not place your order. Please try again.'));
    }
  };

  const handleSubmitB2B = ({ poNumber, notes }) => {
    const order = placeB2BOrder({ items: cart, totals, address, shippingMethod, poNumber, notes });
    setPlaced(true);
    clearCart();
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  if (placed) return null;
  if (loading) return null;
  if (!cart.length) return <Navigate to="/cart" replace />;
  if (!user) return <Navigate to="/login?next=/checkout" replace />;

  return (
    <div className="co-wrap">
      <CheckoutSteps current={step} steps={isB2B ? ['Shipping', 'Review & Submit'] : undefined} />
      <div className="co-layout" data-reveal="up">
        <div>
          {/* All steps stay mounted so entered values survive going back */}
          <ShippingStep
            active={step === 1}
            subtotal={totals.subtotal - totals.discount}
            shippingMethod={shippingMethod}
            shippingOptions={shippingOptions}
            onShippingMethod={setShippingMethod}
            nextLabel={isB2B ? 'Continue to Review →' : undefined}
            onNext={(addr) => {
              setAddress(addr);
              goToStep(2);
            }}
          />
          {isB2B ? (
            <B2BReviewStep active={step === 2} cart={cart} onBack={() => goToStep(1)} onSubmit={handleSubmitB2B} />
          ) : (
            <>
              <PaymentStep
                active={step === 2}
                cardName={cardName}
                onCardName={setCardName}
                stripeReady={Boolean(stripe)}
                onBack={() => goToStep(1)}
                onNext={() => goToStep(3)}
              />
              <ReviewStep active={step === 3} cart={cart} busy={busy} error={error} onBack={() => goToStep(2)} onPlaceOrder={handlePlaceOrder} />
            </>
          )}
        </div>
        <OrderSummary cart={cart} totals={totals} />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={getStripe()}>
      <Checkout />
    </Elements>
  );
}
