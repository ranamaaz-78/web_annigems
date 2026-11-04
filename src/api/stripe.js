// The /pure entry only loads Stripe.js when checkout asks for it (not on every page).
import { loadStripe } from '@stripe/stripe-js/pure';
import { STRIPE_KEY } from '../data/site';

let stripePromise = null;
let loadedKey = null;

// Stripe.js is loaded once, with the publishable key from GET /bootstrap.
export function getStripe(key = STRIPE_KEY) {
  if (!key) return null;
  if (!stripePromise || loadedKey !== key) {
    loadedKey = key;
    // A failed load resolves to null: the payment step then shows that card payments are unavailable.
    stripePromise = loadStripe(key).catch(() => null);
  }
  return stripePromise;
}
