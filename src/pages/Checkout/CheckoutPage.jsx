import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useShop } from '../../hooks/useShop';
import { orderTotals } from '../../utils/pricing';
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import ShippingStep from './ShippingStep';

// Front-end only checkout: placing an order saves it to localStorage, clears the cart
// and moves on to /order-success/:id.
export default function CheckoutPage() {
  const { cart, cartSubtotal, discount, clearCart, removeCoupon } = useShop();
  const { placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [address, setAddress] = useState(null);
  const [placed, setPlaced] = useState(false);

  const goToStep = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totals = orderTotals(cartSubtotal, shippingMethod, discount);

  const handlePlaceOrder = () => {
    const order = placeOrder({ items: cart, totals, address, shippingMethod, email: address?.email });
    setPlaced(true);
    clearCart();
    removeCoupon();
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  if (placed) return null;
  if (!cart.length) return <Navigate to="/cart" replace />;

  return (
    <div className="co-wrap">
      <CheckoutSteps current={step} />
      <div className="co-layout" data-reveal="up">
        <div>
          {/* All steps stay mounted so entered values survive going back */}
          <ShippingStep
            active={step === 1}
            subtotal={cartSubtotal - discount}
            shippingMethod={shippingMethod}
            onShippingMethod={setShippingMethod}
            onNext={(addr) => {
              setAddress(addr);
              goToStep(2);
            }}
          />
          <PaymentStep active={step === 2} onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
          <ReviewStep active={step === 3} cart={cart} onBack={() => goToStep(2)} onPlaceOrder={handlePlaceOrder} />
        </div>
        <OrderSummary cart={cart} totals={totals} />
      </div>
    </div>
  );
}
