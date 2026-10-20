// Static data for the B2B (business) module and the admin demo account.
// Everything here seeds localStorage; there is no backend yet.

export const DEMO_B2B_USER = {
  id: 'b-demo',
  accountType: 'b2b',
  status: 'active',
  firstName: 'Rahul',
  lastName: 'Rao',
  email: 'b2b@aanigems.com',
  password: 'Business@1234',
  phone: '+91 98200 11122',
  provider: 'password',
  company: { name: 'Rao Jewellers Pvt Ltd', type: 'Retail Jeweller', gst: '27AABCR1234F1Z5' },
  creditLimit: 25000,
  creditTermsDays: 30,
  createdAt: Date.now() - 90 * 86400000,
  addresses: [
    {
      id: 'ba1',
      label: 'Showroom',
      name: 'Rao Jewellers',
      line1: '14 Zaveri Bazaar',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400002',
      country: 'India',
      phone: '+91 98200 11122',
      isDefault: true,
    },
  ],
};

export const BUSINESS_TYPES = ['Retail Jeweller', 'Wholesaler', 'Boutique / Designer', 'Online Retailer', 'Other'];
export const CREDIT_TERMS = [15, 30, 45, 60];

// Default rules used until the admin sets a product-specific one.
export const DEFAULT_PRICING = {
  default: { mode: 'percent', value: 20 },
  config: { mode: 'percent', value: 15 },
  products: {},
};

export const WHOLESALE_PERKS = [
  { icon: '✦', title: 'Trade pricing', text: 'Dedicated business prices on the full catalogue' },
  { icon: '◈', title: 'Credit terms', text: 'Approved accounts can order on credit' },
  { icon: '♦', title: 'Custom rings', text: 'Design Your Ring at trade rates' },
];

export const B2B_STEPS = [
  { id: 'submitted', label: 'Order Submitted', desc: 'Your order has been sent to our team.' },
  { id: 'approval', label: 'Admin Approval', desc: 'We are reviewing stock, pricing and your account.' },
  { id: 'payment', label: 'Payment / Credit', desc: 'Pay by payment link or use your credit line.' },
  { id: 'crafting', label: 'Crafting', desc: 'Our artisans are hand-finishing your pieces.' },
  { id: 'quality', label: 'Quality Check', desc: 'Certified inspection and polishing.' },
  { id: 'shipped', label: 'Shipped', desc: 'Insured and on its way to you.' },
  { id: 'delivered', label: 'Delivered', desc: 'Delivered and signed for.' },
];

const DAY = 86400000;
const addr = { name: 'Rao Jewellers', line1: '14 Zaveri Bazaar', city: 'Mumbai', state: 'Maharashtra', zip: '400002', country: 'India' };
const line = (key, name, subtitle, retailPrice, price, qty, image, meta = {}) => ({ key, id: key, name, subtitle, retailPrice, price, qty, image, meta });
const totalsOf = (items, shipping = 0) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  return { subtotal, discount: 0, shipping, tax, total: subtotal + shipping + tax };
};

const stud = line('e1', 'Lumiere Diamond Studs', '18K Gold - Round Brilliant Diamond', 1200, 960, 5, '/images/prod_earrings1.jpg');
const solitaire = line('r1', 'Aurora Solitaire', 'Classic 4-Prong Cathedral Setting', 799, 639.2, 4, '/images/ring1_plain.jpg', { size: '7' });
const pendant = line('n1', 'Etoile Diamond Pendant', 'Diamond Pendant', 850, 680, 6, '/images/prod_necklace1.jpg');
const bangle = line('b2', 'Royale Sapphire Bangle', 'Sapphire Bangle', 2100, 1680, 2, '/images/prod_bracelet2.jpg');

const base = { type: 'b2b', email: DEMO_B2B_USER.email, company: DEMO_B2B_USER.company.name, shippingMethod: 'standard', address: addr };

export const SEED_B2B_ORDERS = [
  {
    ...base,
    id: 'BG-20418',
    createdAt: Date.now() - 1 * DAY,
    stage: 0,
    approval: 'pending',
    poNumber: 'PO-7781',
    notes: 'Need before the festive season.',
    payment: { method: null, status: 'unpaid' },
    items: [solitaire, pendant],
    totals: totalsOf([solitaire, pendant]),
  },
  {
    ...base,
    id: 'BG-20377',
    createdAt: Date.now() - 4 * DAY,
    stage: 0,
    approval: 'approved',
    poNumber: 'PO-7702',
    notes: '',
    payment: { method: null, status: 'unpaid' },
    items: [bangle],
    totals: totalsOf([bangle]),
  },
  {
    ...base,
    id: 'BG-20301',
    createdAt: Date.now() - 12 * DAY,
    stage: 0,
    approval: 'approved',
    poNumber: 'PO-7650',
    notes: '',
    payment: { method: 'online', status: 'link_sent', link: '/b2b/pay/BG-20301', requestedAt: Date.now() - 10 * DAY },
    items: [stud],
    totals: totalsOf([stud]),
  },
  {
    ...base,
    id: 'BG-20190',
    createdAt: Date.now() - 30 * DAY,
    stage: 3,
    approval: 'approved',
    poNumber: 'PO-7411',
    notes: '',
    payment: { method: 'credit', status: 'credit_approved', requestedAt: Date.now() - 28 * DAY, dueAt: Date.now() + 2 * DAY },
    items: [pendant, stud],
    totals: totalsOf([pendant, stud]),
  },
];

export const SEED_CREDIT_REQUESTS = [
  { id: 'cr-1', email: DEMO_B2B_USER.email, company: DEMO_B2B_USER.company.name, amount: 40000, note: 'Festive season stock-up.', status: 'pending', createdAt: Date.now() - 2 * DAY },
];

