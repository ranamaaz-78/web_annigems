/* ─────────────────────────────────────────────────────
   LuxeRings Store — store.js
   Global state: cart, wishlist, user, gold price
───────────────────────────────────────────────────── */

const Store = (() => {
  // ── INTERNAL STATE ──────────────────────────────────
  let _cart      = JSON.parse(localStorage.getItem('lr_cart')      || '[]');
  let _wishlist  = JSON.parse(localStorage.getItem('lr_wishlist')  || '[]');
  let _goldPerOz = null;
  let _goldPerG  = null;
  const _listeners = {};

  // ── HELPERS ─────────────────────────────────────────
  function save() {
    localStorage.setItem('lr_cart',     JSON.stringify(_cart));
    localStorage.setItem('lr_wishlist', JSON.stringify(_wishlist));
  }
  function emit(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
  }

  // ── GOLD PRICE ───────────────────────────────────────
  async function fetchGoldPrice() {
    const apis = [
      async () => {
        const r = await fetch('https://api.metals.live/v1/spot/gold', { signal: AbortSignal.timeout(5000) });
        if (!r.ok) throw 0;
        const d = await r.json();
        if (Array.isArray(d) && d[0]?.gold) return d[0].gold;
        throw 0;
      },
      async () => {
        const r = await fetch('https://data-asg.goldprice.org/dbXRates/USD', { signal: AbortSignal.timeout(5000) });
        if (!r.ok) throw 0;
        const d = await r.json();
        if (d?.items?.[0]?.xauPrice) return d.items[0].xauPrice;
        throw 0;
      },
    ];
    for (const fn of apis) {
      try { const p = await fn(); if (p > 0) return parseFloat(p); } catch(_) {}
    }
    return 2480; // realistic fallback
  }

  async function initGoldPrice() {
    const oz = await fetchGoldPrice();
    _goldPerOz = oz;
    _goldPerG  = oz * TROY_OZ_PER_GRAM;
    emit('goldPrice', { oz: _goldPerOz, perG: _goldPerG });
    setTimeout(initGoldPrice, 5 * 60 * 1000);
  }

  // ── CART ─────────────────────────────────────────────
  function cartCount() { return _cart.reduce((s, i) => s + i.qty, 0); }
  function cartTotal() { return _cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function addToCart(item) {
    // item: { id, name, subtitle, price, img, qty, meta:{size,metal,stone} }
    const key = item.id + (item.meta?.size || '') + (item.meta?.stone || '');
    const existing = _cart.find(c => c._key === key);
    if (existing) {
      existing.qty += (item.qty || 1);
    } else {
      _cart.push({ ...item, qty: item.qty || 1, _key: key });
    }
    save();
    emit('cart', { cart: _cart, count: cartCount(), total: cartTotal() });
  }

  function removeFromCart(key) {
    _cart = _cart.filter(c => c._key !== key);
    save();
    emit('cart', { cart: _cart, count: cartCount(), total: cartTotal() });
  }

  function updateQty(key, qty) {
    const item = _cart.find(c => c._key === key);
    if (item) {
      if (qty <= 0) { removeFromCart(key); return; }
      item.qty = qty;
      save();
      emit('cart', { cart: _cart, count: cartCount(), total: cartTotal() });
    }
  }

  function clearCart() {
    _cart = [];
    save();
    emit('cart', { cart: _cart, count: 0, total: 0 });
  }

  // ── WISHLIST ─────────────────────────────────────────
  function isWishlisted(id) { return _wishlist.includes(id); }
  function toggleWishlist(id) {
    if (isWishlisted(id)) {
      _wishlist = _wishlist.filter(w => w !== id);
    } else {
      _wishlist.push(id);
    }
    save();
    emit('wishlist', _wishlist);
    return isWishlisted(id);
  }

  // ── EVENTS ───────────────────────────────────────────
  function on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }
  function off(event, fn) {
    if (_listeners[event]) _listeners[event] = _listeners[event].filter(f => f !== fn);
  }

  return {
    initGoldPrice,
    get goldPerOz() { return _goldPerOz; },
    get goldPerG()  { return _goldPerG; },
    get cart()      { return [..._cart]; },
    cartCount, cartTotal,
    addToCart, removeFromCart, updateQty, clearCart,
    isWishlisted, toggleWishlist,
    on, off,
  };
})();
