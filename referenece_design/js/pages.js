/* ─────────────────────────────────────────────────────
   LuxeRings Store — pages.js
   All page renderers: Home, Shop, Product, Checkout, Wishlist
───────────────────────────────────────────────────── */

// ═══════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-img-wrap">
        <img src="images/hero_banner.jpg" alt="LuxeRings Fine Jewelry" class="hero-img" />
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <p class="hero-eyebrow">Handcrafted Fine Jewelry · Since 1987</p>
        <h1 class="hero-headline">Where Gold<br/><em>Meets Artistry</em></h1>
        <p class="hero-desc">Bespoke rings, necklaces, earrings and bracelets crafted in 18K gold.<br/>Every piece tells a story. Every stone speaks in colour.</p>
        <div class="hero-ctas">
          <button class="btn-gold hero-btn" onclick="Router.go('shop')">Shop Collection</button>
          <button class="btn-outline hero-btn" onclick="Router.go('configurator')">Design Your Ring</button>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span>Scroll</span><div class="scroll-bar"></div>
      </div>
    </section>

    <!-- USP BAR -->
    <div class="usp-bar">
      <div class="usp-item"><span class="usp-icon">🚚</span><span>Free Shipping over $500</span></div>
      <div class="usp-item"><span class="usp-icon">✦</span><span>GIA Certified Gemstones</span></div>
      <div class="usp-item"><span class="usp-icon">↩</span><span>30-Day Free Returns</span></div>
      <div class="usp-item"><span class="usp-icon">🔒</span><span>Secure & Insured Delivery</span></div>
      <div class="usp-item"><span class="usp-icon">♦</span><span>Lifetime Craftsmanship Warranty</span></div>
    </div>

    <!-- CATEGORIES -->
    <section class="section categories-section">
      <div class="section-header">
        <h2 class="section-title">Shop by Category</h2>
        <p class="section-sub">From everyday elegance to once-in-a-lifetime pieces</p>
      </div>
      <div class="categories-grid">
        ${CATEGORIES.map(c => `
          <div class="cat-card" data-cat="${c.id}" onclick="Router.go('shop', {cat:'${c.id}'})">
            <div class="cat-card-img-wrap">
              <img src="${c.img}" alt="${c.label}" class="cat-card-img" loading="lazy" />
              <div class="cat-card-overlay"></div>
            </div>
            <div class="cat-card-body">
              <h3 class="cat-card-name">${c.label}</h3>
              <p class="cat-card-count">${c.count} pieces</p>
              <span class="cat-card-link">Explore →</span>
            </div>
          </div>`).join('')}
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section featured-section">
      <div class="section-header">
        <p class="section-eyebrow">Handpicked for You</p>
        <h2 class="section-title">Featured Pieces</h2>
      </div>
      <div class="product-grid featured-grid" id="featured-grid">
        ${PRODUCTS.filter(p => ['r1','r5','e1','b1','n1'].includes(p.id)).map(p => ProductCard(p, {showCategory:true})).join('')}
      </div>
      <div class="section-cta">
        <button class="btn-outline" onclick="Router.go('shop')">View All Pieces →</button>
      </div>
    </section>

    <!-- DESIGN YOUR RING BANNER -->
    <section class="design-ring-banner" onclick="Router.go('configurator')">
      <div class="drb-img-wrap">
        <img src="images/banner_design_ring.jpg" alt="Design Your Ring" class="drb-img" />
        <div class="drb-overlay"></div>
      </div>
      <div class="drb-content">
        <p class="drb-tag">Bespoke Service</p>
        <h2 class="drb-title">Design<br/><em>Your Perfect Ring</em></h2>
        <p class="drb-desc">Choose your setting, your size, your stone.<br/>Priced live on today's gold market.</p>
        <button class="btn-gold drb-btn">Begin Your Creation →</button>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    <section class="section">
      <div class="section-header">
        <p class="section-eyebrow">Just Arrived</p>
        <h2 class="section-title">New Collection</h2>
      </div>
      <div class="product-grid" id="new-grid">
        ${PRODUCTS.filter(p => ['r3','r6','e2','b2','n2'].includes(p.id)).map(p => ProductCard(p, {showCategory:true})).join('')}
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section testimonials-section">
      <div class="section-header">
        <p class="section-eyebrow">Client Stories</p>
        <h2 class="section-title">What Our Clients Say</h2>
      </div>
      <div class="testimonials-grid">
        ${TESTIMONIALS.map(t => `
          <div class="testimonial-card">
            <div class="t-stars">${'★'.repeat(t.rating)}</div>
            <p class="t-text">"${t.text}"</p>
            <div class="t-author">
              <div class="t-avatar">${t.avatar}</div>
              <div>
                <p class="t-name">${t.name}</p>
                <p class="t-loc">${t.location}</p>
                <p class="t-product">Purchased: ${t.product}</p>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section">
      <div class="newsletter-inner">
        <div class="newsletter-text">
          <p class="newsletter-eyebrow">✦ Private Circle</p>
          <h3 class="newsletter-title">Join the LuxeRings Atelier</h3>
          <p class="newsletter-sub">Be the first to access new collections, exclusive offers,<br/>and invitations to private trunk shows.</p>
        </div>
        <form class="newsletter-form" id="newsletter-form">
          <input type="email" placeholder="Your email address" class="newsletter-input" required id="newsletter-email" />
          <button type="submit" class="btn-gold newsletter-btn">Subscribe</button>
        </form>
      </div>
    </section>`;

  // Bind product card events
  bindProductCards(document.getElementById('featured-grid'));
  bindProductCards(document.getElementById('new-grid'));

  // Newsletter
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Welcome to the LuxeRings Private Circle! ✦');
    document.getElementById('newsletter-email').value = '';
  });
}

// ═══════════════════════════════════════════════════
// SHOP PAGE
// ═══════════════════════════════════════════════════
function renderShop(params = {}) {
  let filteredProducts = [...PRODUCTS];
  let activeCat  = params.cat  || 'all';
  let sortBy     = 'featured';
  let priceRange = [0, 5000];
  let searchQ    = '';

  function applyFilters() {
    let res = [...PRODUCTS];
    if (activeCat !== 'all') res = res.filter(p => p.category === activeCat);
    if (searchQ) res = res.filter(p => p.name.toLowerCase().includes(searchQ) || p.tags.some(t => t.includes(searchQ)));
    res = res.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc':  res.sort((a,b) => a.price - b.price); break;
      case 'price-desc': res.sort((a,b) => b.price - a.price); break;
      case 'rating':     res.sort((a,b) => b.rating - a.rating); break;
      case 'newest':     res.sort((a,b) => (b.badge==='New'?1:0) - (a.badge==='New'?1:0)); break;
    }
    return res;
  }

  function renderGrid() {
    const products = applyFilters();
    const grid = document.getElementById('shop-grid');
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = `${products.length} pieces`;
    if (!grid) return;
    if (!products.length) {
      grid.innerHTML = `<div class="shop-empty"><p>No pieces found</p><button class="btn-outline" onclick="Router.go('shop')">Clear Filters</button></div>`;
      return;
    }
    grid.innerHTML = products.map(p => ProductCard(p)).join('');
    bindProductCards(grid);
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="shop-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <span onclick="Router.go('home')" class="bc-link">Home</span>
        <span class="bc-sep">›</span>
        <span class="bc-active">Shop${activeCat !== 'all' ? ' / ' + activeCat.charAt(0).toUpperCase()+activeCat.slice(1) : ''}</span>
      </div>

      <div class="shop-layout">
        <!-- SIDEBAR -->
        <aside class="shop-sidebar" id="shop-sidebar">
          <div class="sidebar-section">
            <h4 class="sidebar-title">Category</h4>
            <div class="sidebar-cats">
              ${[{id:'all',label:'All Jewelry'},…CATEGORIES.map(c=>({id:c.id,label:c.label}))].map(c => `
                <button class="cat-filter-btn ${activeCat===c.id?'active':''}" data-cat="${c.id}">${c.label}</button>
              `).join('')}
            </div>
          </div>

          <div class="sidebar-section">
            <h4 class="sidebar-title">Price Range</h4>
            <div class="price-range-wrap">
              <input type="range" id="price-max" min="0" max="5000" step="50" value="5000" class="price-slider" />
              <div class="price-range-labels">
                <span>$0</span>
                <span id="price-max-label">$5,000+</span>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h4 class="sidebar-title">Metal</h4>
            <div class="check-filters">
              <label class="check-label"><input type="checkbox" value="18K Gold" checked class="metal-filter" /> 18K Gold</label>
            </div>
          </div>

          <div class="sidebar-section">
            <h4 class="sidebar-title">Stone</h4>
            <div class="check-filters">
              ${['Diamond','Ruby','Sapphire','Emerald','No Stone'].map(s =>
                `<label class="check-label"><input type="checkbox" value="${s}" class="stone-filter" /> ${s}</label>`
              ).join('')}
            </div>
          </div>

          <button class="btn-outline sidebar-clear" onclick="Router.go('shop')">Clear All Filters</button>
        </aside>

        <!-- MAIN -->
        <div class="shop-main">
          <div class="shop-toolbar">
            <p class="shop-count" id="shop-count">0 pieces</p>
            <div class="shop-sort">
              <label class="sort-label">Sort by</label>
              <select class="sort-select" id="sort-select">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
          <div class="product-grid" id="shop-grid"></div>
        </div>
      </div>
    </div>`;

  // Render initial
  renderGrid();

  // Category filter
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    });
  });

  // Price slider
  const priceSlider = document.getElementById('price-max');
  priceSlider?.addEventListener('input', () => {
    priceRange[1] = parseInt(priceSlider.value);
    const label = document.getElementById('price-max-label');
    label.textContent = priceRange[1] >= 5000 ? '$5,000+' : fmt(priceRange[1]);
    renderGrid();
  });

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', e => {
    sortBy = e.target.value;
    renderGrid();
  });
}

// ═══════════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ═══════════════════════════════════════════════════
function renderProduct(params = {}) {
  const product = PRODUCTS.find(p => p.id === params.id);
  if (!product) { Router.go('shop'); return; }

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  let selectedImg = 0;
  let selectedSize = null;
  const sizes = ['4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','12'];

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="product-page-wrap">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <span onclick="Router.go('home')" class="bc-link">Home</span>
        <span class="bc-sep">›</span>
        <span onclick="Router.go('shop',{cat:'${product.category}'})" class="bc-link">${product.category.charAt(0).toUpperCase()+product.category.slice(1)}</span>
        <span class="bc-sep">›</span>
        <span class="bc-active">${product.name}</span>
      </div>

      <div class="product-detail-layout">
        <!-- IMAGE GALLERY -->
        <div class="pd-gallery">
          <div class="pd-main-img-wrap">
            <img id="pd-main-img" src="${product.gallery[0]}" alt="${product.name}" class="pd-main-img" />
            ${!product.inStock ? `<div class="pd-oos-overlay">Sold Out</div>` : ''}
          </div>
          ${product.gallery.length > 1 ? `
          <div class="pd-thumbs">
            ${product.gallery.map((img, i) => `
              <div class="pd-thumb ${i===0?'active':''}" data-idx="${i}">
                <img src="${img}" alt="" loading="lazy" />
              </div>`).join('')}
          </div>` : ''}
        </div>

        <!-- PRODUCT INFO -->
        <div class="pd-info">
          <p class="pd-category">${product.category}</p>
          <h1 class="pd-name">${product.name}</h1>
          <p class="pd-subtitle">${product.subtitle}</p>

          <div class="pd-rating">
            <span class="pd-stars">${'★'.repeat(Math.round(product.rating))}</span>
            <span class="pd-rating-val">${product.rating}</span>
            <a href="#pd-reviews" class="pd-review-count">${product.reviews} reviews</a>
          </div>

          <div class="pd-price-row">
            <span class="pd-price">${fmt(product.price)}</span>
            ${product.originalPrice ? `<span class="pd-orig-price">${fmt(product.originalPrice)}</span><span class="pd-savings">Save ${fmt(product.originalPrice - product.price)}</span>` : ''}
          </div>

          <p class="pd-desc">${product.description}</p>

          ${product.category === 'rings' ? `
          <div class="pd-size-section">
            <div class="pd-size-header">
              <span class="pd-section-label">Ring Size</span>
              <a href="#" class="pd-size-guide-link">Size Guide</a>
            </div>
            <div class="pd-size-grid" id="pd-size-grid">
              ${sizes.map(s => `<button class="pd-size-btn" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>` : ''}

          <div class="pd-specs">
            <div class="pd-spec"><span class="ps-label">Metal</span><span class="ps-val">${product.metal}</span></div>
            <div class="pd-spec"><span class="ps-label">Stone</span><span class="ps-val">${product.stone}</span></div>
            <div class="pd-spec"><span class="ps-label">Weight</span><span class="ps-val">${product.weight}</span></div>
          </div>

          <div class="pd-actions">
            <button class="btn-gold pd-atc ${!product.inStock?'btn-disabled':''}" id="pd-atc-btn" ${!product.inStock?'disabled':''}>
              ${product.inStock ? '🛒 Add to Cart' : 'Sold Out'}
            </button>
            <button class="pd-wl-btn ${Store.isWishlisted(product.id)?'active':''}" id="pd-wl-btn" aria-label="Wishlist">
              <span>♥</span>
            </button>
          </div>

          ${product.customizable ? `
          <div class="pd-custom-cta">
            <p>✦ Want to add a gemstone?</p>
            <button class="btn-outline pd-custom-btn" onclick="Router.go('configurator')">Design Your Version →</button>
          </div>` : ''}

          <!-- Details accordion -->
          <div class="pd-accordion">
            <div class="pd-acc-item">
              <button class="pd-acc-header">
                <span>Product Details</span>
                <span class="acc-arrow">+</span>
              </button>
              <div class="pd-acc-body">
                <ul>${product.details.map(d => `<li>${d}</li>`).join('')}</ul>
              </div>
            </div>
            <div class="pd-acc-item">
              <button class="pd-acc-header">
                <span>Shipping & Returns</span>
                <span class="acc-arrow">+</span>
              </button>
              <div class="pd-acc-body">
                <ul>
                  <li>Free shipping on all orders over $500</li>
                  <li>Orders dispatched within 1-2 business days</li>
                  <li>Insured and tracked worldwide delivery</li>
                  <li>30-day hassle-free returns</li>
                  <li>Custom pieces: non-returnable unless defective</li>
                </ul>
              </div>
            </div>
            <div class="pd-acc-item">
              <button class="pd-acc-header">
                <span>Care Instructions</span>
                <span class="acc-arrow">+</span>
              </button>
              <div class="pd-acc-body">
                <ul>
                  <li>Store in the provided jewelry pouch or box</li>
                  <li>Avoid exposure to harsh chemicals</li>
                  <li>Clean gently with a soft cloth</li>
                  <li>Remove before swimming or exercise</li>
                  <li>Annual professional cleaning recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- REVIEWS SECTION -->
      <section class="section" id="pd-reviews">
        <h2 class="section-title" style="font-size:32px;margin-bottom:32px">Client Reviews</h2>
        <div class="reviews-layout">
          <div class="reviews-summary">
            <div class="rs-score">${product.rating}</div>
            <div class="rs-stars">${'★'.repeat(Math.round(product.rating))}</div>
            <p class="rs-count">${product.reviews} reviews</p>
            <div class="rs-bars">
              ${[5,4,3,2,1].map(s => `
                <div class="rs-bar-row">
                  <span>${s}★</span>
                  <div class="rs-bar-track"><div class="rs-bar-fill" style="width:${s===5?78:s===4?15:s===3?5:2}%"></div></div>
                  <span>${s===5?78:s===4?15:s===3?5:2}%</span>
                </div>`).join('')}
            </div>
          </div>
          <div class="reviews-list">
            ${TESTIMONIALS.slice(0,3).map(t => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${t.avatar}</div>
                  <div>
                    <p class="review-name">${t.name}</p>
                    <p class="review-loc">${t.location}</p>
                  </div>
                  <div class="review-stars">${'★'.repeat(t.rating)}</div>
                </div>
                <p class="review-text">"${t.text}"</p>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- RELATED PRODUCTS -->
      ${related.length ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title" style="font-size:32px">You May Also Love</h2>
        </div>
        <div class="product-grid" id="related-grid">
          ${related.map(p => ProductCard(p)).join('')}
        </div>
      </section>` : ''}
    </div>`;

  // Thumbnail gallery
  document.querySelectorAll('.pd-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      selectedImg = parseInt(thumb.dataset.idx);
      document.getElementById('pd-main-img').src = product.gallery[selectedImg];
      document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Size selection
  document.querySelectorAll('.pd-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  // Add to cart
  document.getElementById('pd-atc-btn')?.addEventListener('click', () => {
    if (!product.inStock) return;
    if (product.category === 'rings' && !selectedSize) {
      showToast('Please select a ring size', 'info');
      document.querySelector('.pd-size-grid')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    Store.addToCart({
      id: product.id, name: product.name, subtitle: product.subtitle,
      price: product.price, img: product.img, qty: 1,
      meta: { size: selectedSize },
    });
    showToast(`${product.name} added to cart!`);
  });

  // Wishlist
  document.getElementById('pd-wl-btn')?.addEventListener('click', () => {
    const added = Store.toggleWishlist(product.id);
    document.getElementById('pd-wl-btn').classList.toggle('active', added);
    showToast(added ? 'Added to wishlist ♥' : 'Removed from wishlist', 'wishlist');
  });

  // Accordion
  document.querySelectorAll('.pd-acc-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.pd-acc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.pd-acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-arrow').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        header.querySelector('.acc-arrow').textContent = '−';
      }
    });
  });

  // Related products
  bindProductCards(document.getElementById('related-grid'));
}

// ═══════════════════════════════════════════════════
// WISHLIST PAGE
// ═══════════════════════════════════════════════════
function renderWishlist() {
  const app = document.getElementById('app');
  // For simplicity, store wishlist as product IDs
  const wishlistIds = PRODUCTS.filter(p => Store.isWishlisted(p.id));

  app.innerHTML = `
    <div class="page-wrap">
      <div class="breadcrumb-bar">
        <span onclick="Router.go('home')" class="bc-link">Home</span>
        <span class="bc-sep">›</span>
        <span class="bc-active">Wishlist</span>
      </div>
      <div class="section-header">
        <h1 class="section-title">Your Wishlist</h1>
        <p class="section-sub">${wishlistIds.length} saved pieces</p>
      </div>
      ${wishlistIds.length
        ? `<div class="product-grid" id="wishlist-grid">${wishlistIds.map(p => ProductCard(p)).join('')}</div>`
        : `<div class="empty-state">
            <div class="es-icon">♥</div>
            <h3>Your wishlist is empty</h3>
            <p>Save pieces you love and come back to them anytime.</p>
            <button class="btn-gold" onclick="Router.go('shop')">Browse Collection</button>
           </div>`}
    </div>`;
  bindProductCards(document.getElementById('wishlist-grid'));
}

// ═══════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════
function renderCheckout() {
  const cart = Store.cart;
  if (!cart.length) { Router.go('shop'); return; }

  const subtotal = Store.cartTotal();
  const shipping = subtotal >= 500 ? 0 : 25;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  let currentCheckoutStep = 1;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="checkout-wrap">
      <!-- Steps -->
      <div class="checkout-steps">
        <div class="co-step active" id="co-step-1"><span>1</span> Shipping</div>
        <div class="co-step-line"></div>
        <div class="co-step" id="co-step-2"><span>2</span> Payment</div>
        <div class="co-step-line"></div>
        <div class="co-step" id="co-step-3"><span>3</span> Review</div>
      </div>

      <div class="checkout-layout">
        <!-- FORMS -->
        <div class="checkout-forms">

          <!-- Step 1: Shipping -->
          <div class="co-panel active" id="co-panel-1">
            <h2 class="co-panel-title">Shipping Information</h2>
            <form id="shipping-form" class="co-form">
              <div class="form-row-2">
                <div class="form-field">
                  <label>First Name</label>
                  <input type="text" placeholder="Priya" required />
                </div>
                <div class="form-field">
                  <label>Last Name</label>
                  <input type="text" placeholder="Mehta" required />
                </div>
              </div>
              <div class="form-field">
                <label>Email</label>
                <input type="email" placeholder="priya@example.com" required />
              </div>
              <div class="form-field">
                <label>Phone</label>
                <input type="tel" placeholder="+91 98765 43210" />
              </div>
              <div class="form-field">
                <label>Address</label>
                <input type="text" placeholder="123 Bandra West" required />
              </div>
              <div class="form-row-2">
                <div class="form-field">
                  <label>City</label>
                  <input type="text" placeholder="Mumbai" required />
                </div>
                <div class="form-field">
                  <label>PIN / ZIP Code</label>
                  <input type="text" placeholder="400050" required />
                </div>
              </div>
              <div class="form-row-2">
                <div class="form-field">
                  <label>State / Province</label>
                  <input type="text" placeholder="Maharashtra" />
                </div>
                <div class="form-field">
                  <label>Country</label>
                  <select>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>UAE</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div class="co-shipping-opts">
                <h4>Delivery Method</h4>
                <label class="shipping-opt">
                  <input type="radio" name="shipping" value="standard" checked />
                  <div class="so-info">
                    <span class="so-name">Standard Delivery</span>
                    <span class="so-time">5–7 business days</span>
                  </div>
                  <span class="so-price">${subtotal >= 500 ? 'Free' : '$25.00'}</span>
                </label>
                <label class="shipping-opt">
                  <input type="radio" name="shipping" value="express" />
                  <div class="so-info">
                    <span class="so-name">Express Delivery</span>
                    <span class="so-time">2–3 business days</span>
                  </div>
                  <span class="so-price">$45.00</span>
                </label>
                <label class="shipping-opt">
                  <input type="radio" name="shipping" value="overnight" />
                  <div class="so-info">
                    <span class="so-name">Overnight Delivery</span>
                    <span class="so-time">Next business day</span>
                  </div>
                  <span class="so-price">$95.00</span>
                </label>
              </div>
              <button type="submit" class="btn-gold btn-full">Continue to Payment →</button>
            </form>
          </div>

          <!-- Step 2: Payment -->
          <div class="co-panel" id="co-panel-2">
            <h2 class="co-panel-title">Payment Details</h2>
            <form id="payment-form" class="co-form">
              <div class="payment-tabs">
                <button type="button" class="pay-tab active" data-pay="card">💳 Credit Card</button>
                <button type="button" class="pay-tab" data-pay="upi">📱 UPI / PayTM</button>
                <button type="button" class="pay-tab" data-pay="bank">🏦 Net Banking</button>
              </div>
              <div class="pay-form active" id="pay-card">
                <div class="form-field">
                  <label>Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" maxlength="19" id="card-number" />
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Expiry</label>
                    <input type="text" placeholder="MM / YY" maxlength="7" />
                  </div>
                  <div class="form-field">
                    <label>CVV</label>
                    <input type="text" placeholder="123" maxlength="4" />
                  </div>
                </div>
                <div class="form-field">
                  <label>Name on Card</label>
                  <input type="text" placeholder="PRIYA MEHTA" />
                </div>
              </div>
              <div class="pay-form" id="pay-upi">
                <div class="form-field">
                  <label>UPI ID</label>
                  <input type="text" placeholder="priya@paytm" />
                </div>
                <p style="color:var(--text-3);font-size:12px">You will receive a payment request on your UPI app.</p>
              </div>
              <div class="pay-form" id="pay-bank">
                <div class="form-field">
                  <label>Select Bank</label>
                  <select><option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option><option>Kotak Bank</option></select>
                </div>
              </div>
              <div class="secure-note">🔒 Your payment is secured by 256-bit SSL encryption</div>
              <div class="co-btns">
                <button type="button" class="btn-outline" id="back-to-shipping">← Back</button>
                <button type="submit" class="btn-gold">Review Order →</button>
              </div>
            </form>
          </div>

          <!-- Step 3: Review -->
          <div class="co-panel" id="co-panel-3">
            <h2 class="co-panel-title">Review Your Order</h2>
            <div class="review-order-items">
              ${cart.map(item => `
                <div class="ro-item">
                  <img src="${item.img}" alt="${item.name}" class="ro-img" />
                  <div class="ro-info">
                    <p class="ro-name">${item.name}</p>
                    <p class="ro-meta">${item.subtitle || ''} · Qty: ${item.qty}</p>
                    ${item.meta?.size ? `<p class="ro-meta">Size: ${item.meta.size}</p>` : ''}
                  </div>
                  <span class="ro-price">${fmt(item.price * item.qty)}</span>
                </div>`).join('')}
            </div>
            <div class="co-btns" style="margin-top:24px">
              <button type="button" class="btn-outline" id="back-to-payment">← Back</button>
              <button class="btn-gold" id="place-order-btn">Place Order →</button>
            </div>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="checkout-summary">
          <h3 class="cs-title">Order Summary</h3>
          <div class="cs-items">
            ${cart.map(item => `
              <div class="cs-item">
                <img src="${item.img}" alt="${item.name}" class="cs-item-img" />
                <div class="cs-item-info">
                  <p class="cs-item-name">${item.name}</p>
                  <p class="cs-item-qty">Qty: ${item.qty}</p>
                </div>
                <span class="cs-item-price">${fmt(item.price * item.qty)}</span>
              </div>`).join('')}
          </div>
          <div class="cs-totals">
            <div class="cs-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
            <div class="cs-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : fmt(shipping)}</span></div>
            <div class="cs-row"><span>Tax (8%)</span><span>${fmt(tax)}</span></div>
            <div class="cs-total-row"><span>Total</span><span class="cs-total-val">${fmt(total)}</span></div>
          </div>
          <div class="cs-trust">
            <p>🔒 Secure Checkout</p>
            <p>✦ GIA Certified Jewelry</p>
            <p>↩ 30-Day Returns</p>
          </div>
        </div>
      </div>
    </div>`;

  // Step navigation logic
  function goCheckoutStep(step) {
    document.querySelectorAll('.co-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.co-step').forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < step) s.classList.add('done');
      else if (i + 1 === step) s.classList.add('active');
    });
    document.getElementById(`co-panel-${step}`)?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('shipping-form')?.addEventListener('submit', e => { e.preventDefault(); goCheckoutStep(2); });
  document.getElementById('back-to-shipping')?.addEventListener('click', () => goCheckoutStep(1));
  document.getElementById('payment-form')?.addEventListener('submit', e => { e.preventDefault(); goCheckoutStep(3); });
  document.getElementById('back-to-payment')?.addEventListener('click', () => goCheckoutStep(2));

  // Payment tabs
  document.querySelectorAll('.pay-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pay-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`pay-${tab.dataset.pay}`)?.classList.add('active');
    });
  });

  // Place order
  document.getElementById('place-order-btn')?.addEventListener('click', () => {
    Store.clearCart();
    app.innerHTML = `
      <div class="order-success">
        <div class="os-icon">✦</div>
        <h2 class="os-title">Order Placed!</h2>
        <p class="os-sub">Thank you for your purchase. Your confirmation has been sent by email.<br/>Your order will be crafted and shipped within 4–6 weeks.</p>
        <p class="os-order-num">Order #LR-${Math.floor(Math.random()*90000+10000)}</p>
        <div class="os-actions">
          <button class="btn-gold" onclick="Router.go('home')">Return Home</button>
          <button class="btn-outline" onclick="Router.go('shop')">Continue Shopping</button>
        </div>
      </div>`;
  });

  // Format card number input
  document.getElementById('card-number')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').substring(0,16);
    e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
  });
}

