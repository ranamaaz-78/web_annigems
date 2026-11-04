import { CURRENCY } from '../data/site';

// Prices from the API are in the store currency (EUR by default, or the X-Currency the client sent).
const formatter = (digits) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: CURRENCY || 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatPrice = (n) => formatter(2).format(Number(n) || 0);

export const formatPriceRounded = (n) => formatter(0).format(Number(n) || 0);

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export const formatDate = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
