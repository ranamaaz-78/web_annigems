import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, errorText } from '../api/client';
import { major, mapProduct } from '../api/mappers';
import { CONFIG_RINGS, CONFIG_STONES } from '../data/configurator';
import { getProductById } from '../data/products';
import { useAuth } from '../hooks/useAuth';
import { toApiLine } from '../utils/cart';
import { readStorage, writeStorage } from '../utils/storage';
import { ShopContext } from './contexts';

// Cart, wishlist and coupon.
// - The cart lives on the client (localStorage); every price and total comes from POST /cart/quote.
// - Coupons are validated by the quote endpoint.
// - Signed-in accounts' wishlist is stored on their account (GET/POST/DELETE /wishlist, /wishlist/sync);
//   guests keep a local wishlist that is merged after sign-in.
// - Business (B2B) accounts: the quote returns their tier prices (+ retail_unit_price); no coupons.

const QUOTE_DELAY_MS = 250;

// Brings carts saved before the API integration (or by an older version) up to the current shape.
function normalizeLine(item) {
  if (item.kind === 'config' || String(item.key).startsWith('conf-')) {
    if (item.ringId && item.stoneId) return { ...item, kind: 'config' };
    const [, ringPart, stonePart] = String(item.key).split('-');
    const ring = CONFIG_RINGS.find((r) => String(r.id) === ringPart || r.slug === ringPart);
    const stone = CONFIG_STONES.find((s) => String(s.id) === stonePart || s.slug === stonePart);
    return ring && stone ? { ...item, kind: 'config', ringId: ring.id, stoneId: stone.id } : null;
  }
  if (item.productId) return { ...item, kind: 'product' };
  const product = getProductById(item.id);
  return product ? { ...item, kind: 'product', id: product.id, productId: product.apiId } : null;
}

const idsOf = (res) => res.data.map((p) => mapProduct(p).id);

const loadCart = () => readStorage('aani-cart', []).map(normalizeLine).filter(Boolean);

export function ShopProvider({ children }) {
  const { isB2B, user } = useAuth();
  const isCustomer = Boolean(user);

  const [rawCart, setCart] = useState(loadCart);
  const [guestWishlist, setGuestWishlist] = useState(() => readStorage('aani-wishlist', []));
  const [accountWishlist, setAccountWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState(() => readStorage('aani-coupon', null));
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const quoteSeq = useRef(0);

  useEffect(() => writeStorage('aani-cart', rawCart), [rawCart]);
  useEffect(() => writeStorage('aani-wishlist', guestWishlist), [guestWishlist]);
  useEffect(() => writeStorage('aani-coupon', couponCode), [couponCode]);

  // ---- server quote ------------------------------------------------------------

  const requestQuote = useCallback(
    (lines, code, method) =>
      api('cart/quote', {
        method: 'POST',
        body: { items: lines.map(toApiLine), coupon_code: code || null, shipping_method: method },
      }).then((r) => r.data),
    [],
  );

  useEffect(() => {
    if (!rawCart.length) {
      setQuote(null);
      setQuoteError('');
      return undefined;
    }
    const seq = ++quoteSeq.current;
    setQuoting(true);
    const t = setTimeout(() => {
      requestQuote(rawCart, couponCode, shippingMethod)
        .then((q) => {
          if (seq !== quoteSeq.current) return;
          // A coupon that stopped being valid (expired, limit reached…) is dropped.
          if (couponCode && q.coupon && !q.coupon.valid) setCouponCode(null);
          setQuote(q);
          setQuoteError('');
        })
        .catch((err) => seq === quoteSeq.current && setQuoteError(errorText(err)))
        .finally(() => seq === quoteSeq.current && setQuoting(false));
    }, QUOTE_DELAY_MS);
    return () => clearTimeout(t);
  }, [rawCart, couponCode, shippingMethod, isCustomer, requestQuote]);

  // ---- cart ---------------------------------------------------------------------

  // item: { key, id, kind, productId | ringId+stoneId, name, subtitle, price, image, meta }
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === item.key);
      if (existing) return prev.map((c) => (c.key === item.key ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((key, delta) => {
    setCart((prev) => prev.map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0));
  }, []);

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((c) => c.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Returns { ok, error? } — validated by POST /cart/quote.
  const applyCoupon = useCallback(
    async (code) => {
      if (isB2B) return { ok: false, error: 'Coupons are not available on business accounts.' };
      const key = code.trim().toUpperCase();
      if (!key) return { ok: false, error: 'Enter a coupon code.' };
      try {
        const q = await requestQuote(rawCart, key, shippingMethod);
        if (!q.coupon?.valid) return { ok: false, error: q.coupon?.message || 'Invalid coupon code.' };
        quoteSeq.current += 1;
        setQuote(q);
        setCouponCode(key);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: errorText(err) };
      }
    },
    [isB2B, rawCart, shippingMethod, requestQuote],
  );
  const removeCoupon = useCallback(() => setCouponCode(null), []);

  // ---- wishlist ------------------------------------------------------------------

  const wishlist = isCustomer ? accountWishlist : guestWishlist;

  // After sign-in: merge the guest wishlist into the account, then use the account list.
  useEffect(() => {
    if (!isCustomer) {
      setAccountWishlist([]);
      return;
    }
    let cancelled = false;
    const guest = readStorage('aani-wishlist', []);
    const request = guest.length ? api('wishlist/sync', { method: 'POST', body: { product_ids: guest } }) : api('wishlist');
    request
      .then((res) => {
        if (cancelled) return;
        setAccountWishlist(idsOf(res));
        if (guest.length) setGuestWishlist([]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isCustomer, user?.id]);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  // Returns the new state (true = now wishlisted)
  const toggleWishlist = useCallback(
    (id) => {
      const willAdd = !wishlist.includes(id);
      const update = (prev) => (willAdd ? [...prev, id] : prev.filter((w) => w !== id));
      if (isCustomer) {
        setAccountWishlist(update);
        api(`wishlist/${encodeURIComponent(id)}`, { method: willAdd ? 'POST' : 'DELETE' })
          .then((res) => setAccountWishlist(idsOf(res)))
          .catch(() => setAccountWishlist((prev) => (willAdd ? prev.filter((w) => w !== id) : [...prev, id])));
      } else {
        setGuestWishlist(update);
      }
      return willAdd;
    },
    [wishlist, isCustomer],
  );

  // ---- derived values -----------------------------------------------------------------

  const value = useMemo(() => {
    let coupon = null;
    const lines = quote && quote.lines.length === rawCart.length ? quote.lines : null;
    const cart = rawCart.map((item, i) => {
      const line = lines?.[i];
      if (!line) return { ...item, available: true, errors: [] };
      return {
        ...item,
        name: line.name ?? item.name,
        subtitle: line.subtitle ?? item.subtitle,
        image: line.image ?? item.image,
        price: major(line.unit_price),
        // Business accounts: retail unit price and tier % (shown struck through in the cart)
        retailPrice: line.retail_unit_price ? major(line.retail_unit_price) : null,
        b2bPercent: line.b2b_percent ?? null,
        available: line.available,
        errors: line.errors ?? [],
      };
    });
    const sumLocal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const totals = quote
      ? {
          subtotal: major(quote.totals.subtotal),
          discount: major(quote.totals.discount),
          shipping: major(quote.totals.shipping),
          tax: major(quote.totals.tax),
          total: major(quote.totals.total),
          taxRate: quote.totals.tax_rate,
        }
      : { subtotal: sumLocal, discount: 0, shipping: 0, tax: 0, total: sumLocal };
    if (quote?.coupon?.valid) coupon = { label: quote.coupon.message, percent: quote.coupon.percent };
    const shippingOptions = (quote?.shipping_options ?? []).map((o) => ({
      id: o.code,
      name: o.name,
      time: o.delivery_time,
      cost: major(o.price),
      isFree: o.is_free,
    }));
    const freeShippingRemaining = quote ? major(quote.amount_to_free_shipping) : null;

    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    return {
      cart,
      cartCount,
      cartSubtotal: totals.subtotal,
      couponCode: coupon ? couponCode : null,
      coupon,
      discount: totals.discount,
      totals,
      quote,
      quoting,
      quoteError,
      cartValid: Boolean(quote?.valid),
      shippingMethod,
      setShippingMethod,
      shippingOptions,
      freeShippingRemaining,
      applyCoupon,
      removeCoupon,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
    };
  }, [rawCart, quote, quoting, quoteError, couponCode, shippingMethod, wishlist, applyCoupon, removeCoupon, addToCart, changeQty, removeFromCart, clearCart, isWishlisted, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
