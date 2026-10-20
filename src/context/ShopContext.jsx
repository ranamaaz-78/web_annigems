import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products';
import { COUPONS } from '../data/site';
import { useAuth } from '../hooks/useAuth';
import { useB2B } from '../hooks/useB2B';
import { applyConfigRule, resolveProductPrice } from '../utils/pricing';
import { readStorage, writeStorage } from '../utils/storage';
import { ShopContext } from './contexts';

// Cart, wishlist and coupon, persisted in localStorage (no backend).

export function ShopProvider({ children }) {
  const { isB2B } = useAuth();
  const { pricing } = useB2B();
  // Stored lines keep the retail price; business prices are applied on the way out.
  const [rawCart, setCart] = useState(() => readStorage('aani-cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('aani-wishlist', []));
  const [couponCode, setCouponCode] = useState(() => readStorage('aani-coupon', null));

  useEffect(() => writeStorage('aani-cart', rawCart), [rawCart]);
  useEffect(() => writeStorage('aani-wishlist', wishlist), [wishlist]);
  useEffect(() => writeStorage('aani-coupon', couponCode), [couponCode]);

  // item: { key, id, name, subtitle, price, image, meta }
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === item.key);
      if (existing) return prev.map((c) => (c.key === item.key ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((key, delta) => {
    setCart((prev) =>
      prev.map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((c) => c.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Returns { ok, error? }
  const applyCoupon = useCallback((code) => {
    if (isB2B) return { ok: false, error: 'Coupons are not available on business accounts.' };
    const key = code.trim().toUpperCase();
    if (!COUPONS[key]) return { ok: false, error: 'Invalid coupon code.' };
    setCouponCode(key);
    return { ok: true };
  }, [isB2B]);
  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  // Returns the new state (true = now wishlisted)
  const toggleWishlist = useCallback(
    (id) => {
      const willAdd = !wishlist.includes(id);
      setWishlist((prev) => (willAdd ? [...prev, id] : prev.filter((w) => w !== id)));
      return willAdd;
    },
    [wishlist],
  );

  const value = useMemo(() => {
    const cart = rawCart.map((item) => {
      if (!isB2B) return item;
      const isConfig = item.kind === 'config' || String(item.key).startsWith('conf-');
      const product = isConfig ? null : getProductById(item.id);
      const price = isConfig ? applyConfigRule(item.price, pricing.config) : product ? resolveProductPrice(product, true, pricing) : item.price;
      return { ...item, retailPrice: item.price, price };
    });
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const coupon = couponCode && !isB2B ? COUPONS[couponCode] : null;
    const discount = coupon ? Math.round(cartSubtotal * coupon.percent) / 100 : 0;
    return {
      cart,
      cartCount,
      cartSubtotal,
      couponCode,
      coupon,
      discount,
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
  }, [rawCart, isB2B, pricing, wishlist, couponCode, applyCoupon, removeCoupon, addToCart, changeQty, removeFromCart, clearCart, isWishlisted, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

