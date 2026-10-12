import { useCallback, useEffect, useMemo, useState } from 'react';
import { COUPONS } from '../data/site';
import { readStorage, writeStorage } from '../utils/storage';
import { ShopContext } from './contexts';

// Cart, wishlist and coupon, persisted in localStorage (no backend).

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('aani-cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('aani-wishlist', []));
  const [couponCode, setCouponCode] = useState(() => readStorage('aani-coupon', null));

  useEffect(() => writeStorage('aani-cart', cart), [cart]);
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
    const key = code.trim().toUpperCase();
    if (!COUPONS[key]) return { ok: false, error: 'Invalid coupon code.' };
    setCouponCode(key);
    return { ok: true };
  }, []);
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
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const coupon = couponCode ? COUPONS[couponCode] : null;
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
  }, [cart, wishlist, couponCode, applyCoupon, removeCoupon, addToCart, changeQty, removeFromCart, clearCart, isWishlisted, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

