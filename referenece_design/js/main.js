/* ─────────────────────────────────────────────────────
   LuxeRings Store — main.js
   Router + App boot
───────────────────────────────────────────────────── */

// ═══════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════
const Router = (() => {
  const routes = {
    home:         () => renderHome(),
    shop:         (p) => renderShop(p),
    product:      (p) => renderProduct(p),
    configurator: () => renderConfigurator(),
    wishlist:     () => renderWishlist(),
    checkout:     () => renderCheckout(),
  };

  let currentPage  = null;
  let currentParams = {};

  function go(page, params = {}) {
    currentPage   = page;
    currentParams = params;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav link
    document.querySelectorAll('[data-nav]').forEach(a => {
      a.classList.toggle('nav-active', a.dataset.nav === page);
    });

    // Render page
    if (routes[page]) {
      routes[page](params);
    } else {
      routes.home();
    }

    // Update hash for back button support
    const hash = params && Object.keys(params).length
      ? `#${page}?${new URLSearchParams(params).toString()}`
      : `#${page}`;
    history.pushState({ page, params }, '', hash);
  }

  function fromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) { go('home'); return; }
    const [page, qs] = hash.split('?');
    const params = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
    go(page, params);
  }

  window.addEventListener('popstate', e => {
    if (e.state?.page) go(e.state.page, e.state.params || {});
    else fromHash();
  });

  return { go, fromHash };
})();

// ═══════════════════════════════════════════════════
// APP INIT
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Init shared UI
  initNav();
  initSearch();
  initCartDrawer();
  initAuthModal();
  initQuickView();

  // Start gold price feed (non-blocking)
  Store.initGoldPrice();

  // Route to initial page
  Router.fromHash();

  // Update nav cart on load
  const cartCountEl = document.getElementById('nav-cart-count');
  const count = Store.cartCount();
  if (cartCountEl) {
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
  }
});
