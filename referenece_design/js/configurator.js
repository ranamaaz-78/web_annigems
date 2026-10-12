/* ─────────────────────────────────────────────────────
   LuxeRings Store — configurator.js
   Embedded ring configurator (4-step: Ring → Size → Stone → Preview)
   Integrates the live gold price from Store
───────────────────────────────────────────────────── */

const CONF_RINGS = {
  1: {
    id: 1, name: 'Aurora Solitaire', type: 'Classic 4-Prong Cathedral',
    material: '18K Gold', goldWeightG: 3.2, craftFee: 180, setting: '4-Prong Cathedral',
    img: 'images/ring1_plain.jpg',
    desc: 'A timeless cathedral setting with four elegant prongs that elevate your chosen stone, letting light dance through every facet.'
  },
  2: {
    id: 2, name: 'Élise Vintage Halo', type: 'Ornate Milgrain Setting',
    material: '18K Gold', goldWeightG: 4.8, craftFee: 240, setting: 'Milgrain Halo',
    img: 'images/ring2_plain.jpg',
    desc: 'Inspired by Edwardian artistry. Delicate milgrain borders and hand-carved filigree create an heirloom-worthy masterpiece.'
  },
};

const CONF_STONES = {
  ruby:     { id:'ruby',     name:'Burmese Ruby',       origin:'Mogok Valley, Myanmar', gemPrice:450,  rarity:'Rare',    color:'#e53935', glow:'rgba(229,57,53,0.25)',    gem:'radial-gradient(ellipse at 30% 25%, #ff8a80, #e53935, #7f0000)', images:{ 1:'images/ring1_ruby.jpg',    2:'images/ring2_ruby.jpg'    }, desc:'Fiery passion. 1.2 carats, AAA clarity, Mogok Valley.' },
  sapphire: { id:'sapphire', name:'Ceylon Sapphire',    origin:'Sri Lanka',              gemPrice:520,  rarity:'Premium', color:'#1565c0', glow:'rgba(21,101,192,0.25)',   gem:'radial-gradient(ellipse at 30% 25%, #82b1ff, #1565c0, #0a1628)', images:{ 1:'images/ring1_sapphire.jpg', 2:'images/ring2_sapphire.jpg' }, desc:'Royal elegance. 1.5 carats, VVS1 clarity, Sri Lanka.' },
  emerald:  { id:'emerald',  name:'Colombian Emerald',  origin:'Muzo, Colombia',         gemPrice:580,  rarity:'Rare',    color:'#00897b', glow:'rgba(0,137,123,0.25)',    gem:'radial-gradient(ellipse at 30% 25%, #69f0ae, #00897b, #00251a)', images:{ 1:'images/ring1_emerald.jpg',  2:'images/ring2_emerald.jpg'  }, desc:'Nature\'s finest green. 1.3 carats, VS1, Muzo Mines.' },
  diamond:  { id:'diamond',  name:'White Diamond',      origin:'D-Color · VS1 · GIA',   gemPrice:1200, rarity:'Elite',   color:'#90caf9', glow:'rgba(144,202,249,0.2)',   gem:'radial-gradient(ellipse at 30% 25%, #ffffff, #d6eaff, #5a98d3)',  images:{ 1:'images/ring1_diamond.jpg',  2:'images/ring2_diamond.jpg'  }, desc:'The eternal classic. 1.0 carat D-color VS1, GIA certified.' },
};

function renderConfigurator() {
  let confState = { step: 1, ring: null, size: null, stone: null };

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="configurator-page">
      <!-- Page header -->
      <div class="conf-page-header">
        <div class="breadcrumb-bar" style="justify-content:center;border:none;padding-bottom:8px">
          <span onclick="Router.go('home')" class="bc-link">Home</span>
          <span class="bc-sep">›</span>
          <span class="bc-active">Design Your Ring</span>
        </div>
        <h1 class="conf-page-title">Design Your<br/><em>Perfect Ring</em></h1>
        <p class="conf-page-sub">Choose your setting, select your size, pick your stone.<br/>Priced live on today's gold market — every piece truly yours.</p>
      </div>

      <!-- Progress -->
      <div class="conf-progress">
        <div class="conf-prog-track"><div class="conf-prog-fill" id="conf-fill"></div></div>
        <div class="conf-prog-steps">
          ${[{n:1,l:'Choose Ring'},{n:2,l:'Select Size'},{n:3,l:'Pick Stone'},{n:4,l:'Preview'}].map(s => `
            <div class="conf-ps ${s.n===1?'active':''}" id="conf-ps-${s.n}" data-step="${s.n}">
              <div class="conf-ps-circle"><span>${s.n}</span></div>
              <div class="conf-ps-label">${s.l}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Panels -->
      <div id="conf-panels">
        <!-- PANEL 1: Ring -->
        <div class="conf-panel active" id="conf-p1">
          <div class="conf-panel-header">
            <h2 class="conf-panel-title">Choose Your Setting</h2>
            <p class="conf-panel-sub">Select the gold ring style you'd like to set your stone into.</p>
          </div>
          <div class="conf-ring-grid">
            ${Object.values(CONF_RINGS).map(r => `
              <div class="conf-ring-card" data-ring="${r.id}">
                <div class="crc-img-wrap">
                  <img src="${r.img}" alt="${r.name}" class="crc-img" />
                  <div class="crc-hover-label">Select →</div>
                </div>
                <div class="crc-body">
                  <div class="crc-head">
                    <div>
                      <h3 class="crc-name">${r.name}</h3>
                      <p class="crc-type">${r.type}</p>
                    </div>
                    <span class="crc-badge">${r.material}</span>
                  </div>
                  <p class="crc-desc">${r.desc}</p>
                  <div class="crc-specs">
                    <span>Gold: ${r.goldWeightG}g</span>
                    <span>${r.setting}</span>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- PANEL 2: Size -->
        <div class="conf-panel" id="conf-p2">
          <div class="conf-panel-header">
            <h2 class="conf-panel-title">Select Your Ring Size</h2>
            <p class="conf-panel-sub">US sizes. Complimentary resize within 60 days of delivery.</p>
          </div>
          <div class="conf-size-layout">
            <div>
              <div class="conf-size-grid" id="conf-size-grid"></div>
              <p class="conf-size-note">✦ Free resize within 60 days &nbsp;|&nbsp; ✦ Engraving available (size 5+)</p>
            </div>
            <div class="conf-size-guide">
              <h4>How to Measure</h4>
              <div class="conf-sg-steps">
                <div class="conf-sg-step"><span class="csg-num">01</span><span>Wrap a strip of paper around your finger base</span></div>
                <div class="conf-sg-step"><span class="csg-num">02</span><span>Mark where it overlaps and measure in mm</span></div>
                <div class="conf-sg-step"><span class="csg-num">03</span><span>Use the chart to find your US size</span></div>
              </div>
              <div class="conf-size-chart">
                <div class="csc-row csc-head"><span>US</span><span>Diameter</span><span>Circ.</span></div>
                ${[['5','15.7mm','49.3mm'],['6','16.5mm','51.9mm'],['7','17.3mm','54.4mm'],['8','18.2mm','57.0mm'],['9','19.0mm','59.5mm'],['10','19.8mm','62.1mm']].map(r=>`<div class="csc-row"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span></div>`).join('')}
              </div>
            </div>
          </div>
          <div class="conf-nav">
            <button class="btn-outline conf-back" data-to="1">← Back</button>
            <button class="btn-gold conf-next disabled" id="conf-next-size" disabled data-to="3">Continue to Stone →</button>
          </div>
        </div>

        <!-- PANEL 3: Stone -->
        <div class="conf-panel" id="conf-p3">
          <div class="conf-panel-header">
            <h2 class="conf-panel-title">Select Your Gemstone</h2>
            <p class="conf-panel-sub">Each stone is ethically sourced and hand-graded for exceptional brilliance.</p>
            <div class="conf-live-badge">
              <span class="live-dot-anim"></span>
              <span id="conf-live-text">Fetching live gold price…</span>
            </div>
          </div>
          <!-- Selected ring mini bar -->
          <div class="conf-selected-bar" id="conf-ring-bar">
            <img id="csb-img" src="" alt="" class="csb-img" />
            <div class="csb-info">
              <p id="csb-name" class="csb-name">—</p>
              <p id="csb-size" class="csb-size">Size —</p>
            </div>
            <button class="csb-change" onclick="confGoStep(1)">Change Ring</button>
          </div>
          <div class="conf-stone-grid">
            ${Object.values(CONF_STONES).map(s => `
              <div class="conf-stone-card" data-stone="${s.id}">
                <div class="csc-gem-wrap">
                  <div class="csc-gem ${s.id==='diamond'?'diamond-gem-conf':''}" style="${s.id!=='diamond'?`background:${s.gem}; box-shadow:0 0 40px ${s.color}60, inset 0 0 20px rgba(255,255,255,0.3)`:''}"></div>
                </div>
                <div class="csc-info">
                  <div class="csc-top">
                    <h4 class="csc-name">${s.name}</h4>
                    <span class="csc-rarity csc-rarity-${s.rarity.toLowerCase()}">${s.rarity}</span>
                  </div>
                  <p class="csc-origin">${s.origin}</p>
                  <div class="csc-price-row">
                    <span class="csc-gem-price">${fmt(s.gemPrice)}</span>
                    <span class="csc-gold-price" id="conf-gold-${s.id}">+ gold</span>
                  </div>
                  <p class="csc-desc">${s.desc}</p>
                </div>
              </div>`).join('')}
          </div>
          <div class="conf-nav">
            <button class="btn-outline conf-back" data-to="2">← Back</button>
          </div>
        </div>

        <!-- PANEL 4: Preview -->
        <div class="conf-panel" id="conf-p4">
          <div class="conf-panel-header">
            <h2 class="conf-panel-title">Your Bespoke Creation</h2>
            <p class="conf-panel-sub">Here is your ring as it will be crafted — priced on today's live gold rate.</p>
          </div>
          <div class="conf-preview-layout">
            <div class="conf-preview-img-col">
              <div class="conf-preview-showcase">
                <img id="conf-preview-img" src="" alt="" class="conf-preview-img" />
                <div id="conf-preview-glow" class="conf-preview-glow"></div>
              </div>
              <p class="conf-preview-caption">Final product — handcrafted to order</p>
              <div class="conf-quality-badges">
                <span>✦ GIA Certified</span><span>✦ 18K Gold</span><span>✦ Ethically Sourced</span>
              </div>
            </div>
            <div class="conf-preview-info">
              <div class="conf-ready-tag">✓ Ready to Order</div>
              <h3 class="conf-preview-title" id="conf-prev-title">—</h3>
              <div class="conf-summary-card">
                <div class="confsc-row"><span>Setting</span><span id="cprev-ring">—</span></div>
                <div class="confsc-row"><span>Gemstone</span><span id="cprev-stone">—</span></div>
                <div class="confsc-row"><span>Ring Size</span><span id="cprev-size">—</span></div>
                <div class="confsc-row"><span>Gold Weight</span><span id="cprev-weight">—</span></div>
                <div class="confsc-row"><span>Delivery</span><span>4–6 weeks</span></div>
              </div>
              <div class="conf-price-card">
                <div class="cpc-title">
                  <span>Price Breakdown</span>
                  <div class="cpc-live"><span class="live-dot-anim"></span><span id="cpc-live-note">—</span></div>
                </div>
                <div class="cpc-rows">
                  <div class="cpc-row"><span>Gold value (<span id="cpc-gold-w">—</span>g × 18K purity × spot)</span><span id="cpc-gold-val">—</span></div>
                  <div class="cpc-row"><span>Craftsmanship & setting</span><span id="cpc-craft">—</span></div>
                  <div class="cpc-row"><span>Gemstone (<span id="cpc-sname">—</span>)</span><span id="cpc-stone-val">—</span></div>
                </div>
                <div class="cpc-total"><span>Total Price</span><span class="cpc-total-val" id="cpc-total">—</span></div>
                <p class="cpc-note">* Gold priced at today's spot: <strong id="cpc-spot">—</strong>/oz. Locked at checkout.</p>
              </div>
              <div class="conf-preview-actions">
                <button class="btn-gold conf-atc-btn" id="conf-atc-btn">Add to Cart</button>
                <button class="btn-outline" id="conf-restart-btn">Start Over</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // Build size grid
  const sizeGrid = document.getElementById('conf-size-grid');
  for (let s = 4; s <= 12; s += 0.5) {
    const label = s % 1 === 0 ? String(s) : s.toFixed(1);
    const btn   = document.createElement('button');
    btn.className = 'conf-size-btn';
    btn.textContent = label;
    btn.dataset.size = label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.conf-size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      confState.size = label;
      const nextBtn = document.getElementById('conf-next-size');
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
    });
    sizeGrid.appendChild(btn);
  }

  // Ring selection
  document.querySelectorAll('.conf-ring-card').forEach(card => {
    card.addEventListener('click', () => {
      confState.ring = CONF_RINGS[parseInt(card.dataset.ring)];
      document.querySelectorAll('.conf-ring-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => confGoStep(2), 200);
    });
  });

  // Stone selection
  document.querySelectorAll('.conf-stone-card').forEach(card => {
    card.addEventListener('click', () => {
      confState.stone = CONF_STONES[card.dataset.stone];
      document.querySelectorAll('.conf-stone-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => { buildConfPreview(confState); confGoStep(4); }, 200);
    });
  });

  // Nav buttons
  document.querySelectorAll('.conf-back').forEach(btn => {
    btn.addEventListener('click', () => confGoStep(parseInt(btn.dataset.to)));
  });
  document.getElementById('conf-next-size')?.addEventListener('click', () => {
    if (confState.size) {
      // Populate ring bar
      const ring = confState.ring;
      document.getElementById('csb-img').src = ring.img;
      document.getElementById('csb-name').textContent = ring.name;
      document.getElementById('csb-size').textContent = `US Size ${confState.size}`;
      // Update gold prices on stone cards
      updateConfGoldPrices();
      confGoStep(3);
    }
  });

  // Add to cart
  document.getElementById('conf-atc-btn')?.addEventListener('click', () => {
    const { ring, stone, size } = confState;
    if (!ring || !stone || !size) return;
    const total = calcConfTotal(ring, stone);
    Store.addToCart({
      id: `conf-${ring.id}-${stone.id}`,
      name: `${ring.name} × ${stone.name}`,
      subtitle: `Custom ${ring.setting} · ${stone.name}`,
      price: total,
      img: stone.images[ring.id],
      qty: 1,
      meta: { size, stone: stone.name, ring: ring.name },
    });
    showToast(`${ring.name} × ${stone.name} added to cart!`);
    setTimeout(() => confGoStep(1), 3500);
  });

  document.getElementById('conf-restart-btn')?.addEventListener('click', () => {
    confState = { step:1, ring:null, size:null, stone:null };
    document.querySelectorAll('.conf-ring-card, .conf-stone-card, .conf-size-btn').forEach(el => el.classList.remove('selected'));
    document.getElementById('conf-next-size').disabled = true;
    document.getElementById('conf-next-size').classList.add('disabled');
    confGoStep(1);
  });

  // Update gold price labels when Store emits
  Store.on('goldPrice', updateConfGoldPrices);
  updateConfGoldPrices();

  // Initial step
  confGoStep(1);

  function confGoStep(step) {
    confState.step = step;
    document.querySelectorAll('.conf-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`conf-p${step}`)?.classList.add('active');
    document.querySelectorAll('.conf-ps').forEach((ps, i) => {
      ps.classList.remove('active','done');
      const circle = ps.querySelector('.conf-ps-circle');
      const n = i + 1;
      if (n < step) { ps.classList.add('done'); circle.innerHTML = '<span>✓</span>'; }
      else if (n === step) { ps.classList.add('active'); circle.innerHTML = `<span>${n}</span>`; }
      else { circle.innerHTML = `<span>${n}</span>`; }
    });
    const pct = ((step-1)/3)*100;
    document.getElementById('conf-fill').style.width = pct + '%';
    document.getElementById('configurator-page')?.scrollIntoView?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // expose for inline onclick
  window.confGoStep = confGoStep;
}

function calcConfTotal(ring, stone) {
  const perG = Store.goldPerG || 79.8;
  const goldVal = ring.goldWeightG * (18/24) * perG;
  return goldVal + ring.craftFee + stone.gemPrice;
}

function updateConfGoldPrices() {
  const selectedRing = Object.values(CONF_RINGS)[0]; // fallback
  const perG  = Store.goldPerG  || 79.8;
  const perOz = Store.goldPerOz || 2480;

  const liveText = document.getElementById('conf-live-text');
  if (liveText) liveText.textContent = `Live gold: ${fmt(perOz)}/oz · ${fmt(perG)}/g`;

  Object.values(CONF_STONES).forEach(stone => {
    const el = document.getElementById(`conf-gold-${stone.id}`);
    if (el) {
      // Use whichever ring is selected, fallback to ring 1
      const ring = Object.values(CONF_RINGS)[0];
      const goldCost = ring.goldWeightG * (18/24) * perG;
      el.textContent = `+ ${fmt(goldCost)} gold`;
    }
  });
}

function buildConfPreview(confState) {
  const { ring, stone, size } = confState;
  if (!ring || !stone) return;

  const perG  = Store.goldPerG  || 79.8;
  const perOz = Store.goldPerOz || 2480;
  const goldVal   = ring.goldWeightG * (18/24) * perG;
  const total     = goldVal + ring.craftFee + stone.gemPrice;

  document.getElementById('conf-preview-img').src = stone.images[ring.id] || ring.img;
  document.getElementById('conf-preview-img').alt = `${ring.name} with ${stone.name}`;
  document.getElementById('conf-preview-glow').style.background =
    `radial-gradient(ellipse at 50% 80%, ${stone.glow} 0%, transparent 65%)`;

  document.getElementById('conf-prev-title').textContent   = `${ring.name} · ${stone.name}`;
  document.getElementById('cprev-ring').textContent        = ring.name;
  document.getElementById('cprev-stone').textContent       = stone.name;
  document.getElementById('cprev-size').textContent        = `US Size ${size}`;
  document.getElementById('cprev-weight').textContent      = `${ring.goldWeightG}g (18K)`;

  document.getElementById('cpc-live-note').textContent     = `Live gold: ${fmt(perOz)}/oz`;
  document.getElementById('cpc-spot').textContent          = fmt(perOz);
  document.getElementById('cpc-gold-w').textContent        = ring.goldWeightG;
  document.getElementById('cpc-gold-val').textContent      = fmt(goldVal);
  document.getElementById('cpc-craft').textContent         = fmtI(ring.craftFee);
  document.getElementById('cpc-sname').textContent         = stone.name;
  document.getElementById('cpc-stone-val').textContent     = fmtI(stone.gemPrice);
  document.getElementById('cpc-total').textContent         = fmt(total);
}
