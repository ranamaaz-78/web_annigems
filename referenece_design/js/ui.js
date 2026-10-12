/* ─────────────────────────────────────────────────────
   LuxeRings Store — ui.js
   Shared UI: Nav, Cart Drawer, Toast, Modals, Utils
───────────────────────────────────────────────────── */

// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════
const fmt  = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtI = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const stars = r => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));

function el(tag, cls, html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

// ═══════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = el('div', `toast toast-${type}`);
  const icon = type === 'success' ? '✓' : type === 'wishlist' ? '♥' : 'ℹ';
  t.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

// ═══════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════
function initNav() {
  const nav = document.getElementById('main-nav');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Cart count badge
  function updateNavCart() {
    const count = Store.cartCount();
    const badge = document.getElementById('nav-cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
  Store.on('cart', updateNavCart);
  updateNavCart();

  // Wishlist count
  function updateNavWishlist() {
    const count = Store.cart.filter(c => Store.isWishlisted(c.id)).length;
    // just visual ping
  }

  // Gold price ticker
  Store.on('goldPrice', ({ oz }) => {
    const el = document.getElementById('nav-gold-price');
    if (el) el.textContent = fmt(oz);
  });

  // Search toggle
  document.getElementById('nav-search-btn')?.addEventListener('click', toggleSearch);

  // Cart drawer
  document.getElementById('nav-cart-btn')?.addEventListener('click', openCartDrawer);

  // Auth modal
  document.getElementById('nav-account-btn')?.addEventListener('click', openAuthModal);

  // Mobile menu
  document.getElementById('nav-hamburger')?.addEventListener('click', toggleMobileMenu);

  // Nav link routing
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const page = a.dataset.nav;
      Router.go(page);
      closeMobileMenu();
    });
  });
}

// ═══════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) {
    document.getElementById('search-input').focus();
  }
}

function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  document.getElementById('search-close')?.addEventListener('click', () => {
    document.getElementById('search-overlay').classList.remove('open');
  });

  document.getElementById('search-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('search-overlay')) toggleSearch();
  });

  input?.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.stone.toLowerCase().includes(q)
    ).slice(0, 6);

    results.innerHTML = matches.length
      ? matches.map(p => `
        <div class="search-result-item" data-id="${p.id}">
          <img src="${p.img}" alt="${p.name}" class="sr-img" />
          <div class="sr-info">
            <p class="sr-name">${p.name}</p>
            <p class="sr-cat">${p.category} · ${fmt(p.price)}</p>
          </div>
        </div>`).join('')
      : '<p class="search-no-results">No results found</p>';

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        Router.go('product', { id: item.dataset.id });
        document.getElementById('search-overlay').classList.remove('open');
        input.value = '';
        results.innerHTML = '';
      });
    });
  });
}

// ═══════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const cart   = Store.cart;
  const body   = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">◈</div>
        <p class="cart-empty-title">Your cart is empty</p>
        <p class="cart-empty-sub">Discover our collections and find your perfect piece.</p>
        <button class="btn-gold" onclick="Router.go('shop'); closeCartDrawer()">Browse Collection</button>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-key="${item._key}">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.subtitle || ''}</p>
        ${item.meta?.size  ? `<span class="cart-item-tag">Size ${item.meta.size}</span>` : ''}
        ${item.meta?.stone ? `<span class="cart-item-tag">${item.meta.stone}</span>` : ''}
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" data-key="${item._key}" data-action="dec">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-key="${item._key}" data-action="inc">+</button>
          </div>
          <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
        </div>
      </div>
      <button class="cart-item-remove" data-key="${item._key}" aria-label="Remove">✕</button>
    </div>`).join('');

  const subtotal = Store.cartTotal();
  footer.innerHTML = `
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span class="cart-subtotal-val">${fmt(subtotal)}</span>
    </div>
    <p class="cart-shipping-note">Free shipping on orders over $500</p>
    <button class="btn-gold btn-full" id="cart-checkout-btn">Proceed to Checkout →</button>
    <button class="btn-outline-sm btn-full" onclick="closeCartDrawer(); Router.go('shop')">Continue Shopping</button>
  `;

  // Bind controls
  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key  = btn.dataset.key;
      const item = Store.cart.find(c => c._key === key);
      if (!item) return;
      const newQty = btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1;
      Store.updateQty(key, newQty);
      renderCartDrawer();
    });
  });
  body.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      Store.removeFromCart(btn.dataset.key);
      renderCartDrawer();
    });
  });
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    closeCartDrawer();
    Router.go('checkout');
  });
}

function initCartDrawer() {
  document.getElementById('cart-drawer-close')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', closeCartDrawer);
  Store.on('cart', () => {
    if (document.getElementById('cart-drawer').classList.contains('open')) {
      renderCartDrawer();
    }
  });
}

// ═══════════════════════════════════════════════════
// AUTH MODAL (Login / Register)
// ═══════════════════════════════════════════════════
function openAuthModal() {
  document.getElementById('auth-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initAuthModal() {
  document.getElementById('auth-modal-close')?.addEventListener('click', closeAuthModal);
  document.getElementById('auth-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('auth-modal')) closeAuthModal();
  });

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`form-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Form submit (demo)
  document.getElementById('form-login')?.addEventListener('submit', e => {
    e.preventDefault();
    closeAuthModal();
    showToast('Welcome back! Signed in successfully.');
  });
  document.getElementById('form-register')?.addEventListener('submit', e => {
    e.preventDefault();
    closeAuthModal();
    showToast('Account created! Welcome to LuxeRings.');
  });
}

// ═══════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.body.style.overflow =
    document.getElementById('mobile-menu').classList.contains('open') ? 'hidden' : '';
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════════
// PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════════
function ProductCard(product, opts = {}) {
  const { showCategory = false } = opts;
  const wishlisted = Store.isWishlisted(product.id);
  const oos = !product.inStock;

  return `
    <article class="product-card ${oos ? 'out-of-stock' : ''}" data-pid="${product.id}">
      <div class="pc-img-wrap">
        <img src="${product.img}" alt="${product.name}" class="pc-img" loading="lazy" />
        ${product.badge ? `<span class="pc-badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        ${oos ? `<span class="pc-badge badge-oos">Sold Out</span>` : ''}
        <div class="pc-actions">
          <button class="pc-wishlist ${wishlisted ? 'active' : ''}" data-wid="${product.id}" aria-label="Wishlist" title="Add to Wishlist">♥</button>
          <button class="pc-quickview" data-pid="${product.id}" aria-label="Quick view" title="Quick View">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        ${product.customizable ? `<div class="pc-custom-badge">✦ Customizable</div>` : ''}
      </div>
      <div class="pc-body">
        ${showCategory ? `<p class="pc-cat">${product.category}</p>` : ''}
        <h3 class="pc-name">${product.name}</h3>
        <p class="pc-sub">${product.subtitle}</p>
        <div class="pc-rating">
          <span class="pc-stars">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5-Math.round(product.rating))}</span>
          <span class="pc-review-count">(${product.reviews})</span>
        </div>
        <div class="pc-price-row">
          <span class="pc-price">${fmt(product.price)}</span>
          ${product.originalPrice ? `<span class="pc-orig-price">${fmt(product.originalPrice)}</span>` : ''}
        </div>
        <button class="pc-atc ${oos ? 'btn-disabled' : ''}" data-pid="${product.id}" ${oos ? 'disabled' : ''}>
          ${oos ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </article>`;
}

function bindProductCards(container) {
  container?.querySelectorAll('.pc-wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.wid;
      const added = Store.toggleWishlist(id);
      btn.classList.toggle('active', added);
      showToast(added ? 'Added to wishlist ♥' : 'Removed from wishlist', 'wishlist');
    });
  });

  container?.querySelectorAll('.pc-atc').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pid = btn.dataset.pid;
      const product = PRODUCTS.find(p => p.id === pid);
      if (!product || !product.inStock) return;
      Store.addToCart({
        id: product.id, name: product.name, subtitle: product.subtitle,
        price: product.price, img: product.img, qty: 1, meta: {},
      });
      showToast(`${product.name} added to cart!`);
      // Animate button
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 2000);
    });
  });

  container?.querySelectorAll('.pc-quickview').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openQuickView(btn.dataset.pid);
    });
  });

  container?.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.pc-wishlist, .pc-quickview, .pc-atc')) return;
      Router.go('product', { id: card.dataset.pid });
    });
  });
}

// ═══════════════════════════════════════════════════
// QUICK VIEW MODAL
// ═══════════════════════════════════════════════════
function openQuickView(pid) {
  const product = PRODUCTS.find(p => p.id === pid);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const body  = document.getElementById('quickview-body');

  body.innerHTML = `
    <div class="qv-layout">
      <div class="qv-img-col">
        <img src="${product.img}" alt="${product.name}" class="qv-img" />
      </div>
      <div class="qv-info-col">
        <p class="qv-cat">${product.category}</p>
        <h2 class="qv-name">${product.name}</h2>
        <p class="qv-sub">${product.subtitle}</p>
        <div class="qv-rating">
          <span class="pc-stars">${'★'.repeat(Math.round(product.rating))}</span>
          <span style="color:var(--text-3);font-size:12px">(${product.reviews} reviews)</span>
        </div>
        <div class="qv-price-row">
          <span class="qv-price">${fmt(product.price)}</span>
          ${product.originalPrice ? `<span class="qv-orig">${fmt(product.originalPrice)}</span>` : ''}
        </div>
        <p class="qv-desc">${product.description}</p>
        <div class="qv-actions">
          <button class="btn-gold qv-atc" data-pid="${product.id}" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
          <button class="btn-outline-icon qv-view" data-pid="${product.id}">View Details</button>
        </div>
        ${product.customizable ? `<p class="qv-custom-note">✦ This ring is available in our <a href="#" onclick="Router.go('configurator'); closeQuickView();">Design Your Ring</a> studio</p>` : ''}
      </div>
    </div>`;

  body.querySelector('.qv-atc')?.addEventListener('click', () => {
    Store.addToCart({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img, qty: 1, meta: {} });
    showToast(`${product.name} added to cart!`);
    closeQuickView();
  });
  body.querySelector('.qv-view')?.addEventListener('click', () => {
    closeQuickView();
    Router.go('product', { id: pid });
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickview-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initQuickView() {
  document.getElementById('quickview-close')?.addEventListener('click', closeQuickView);
  document.getElementById('quickview-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('quickview-modal')) closeQuickView();
  });
}
