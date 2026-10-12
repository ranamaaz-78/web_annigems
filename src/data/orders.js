// Demo account and seed orders so account / tracking pages have content to show.

export const DEMO_USER = {
  id: 'u-demo',
  firstName: 'Priya',
  lastName: 'Mehta',
  email: 'demo@aanigems.com',
  password: 'Demo@1234',
  phone: '+91 98765 43210',
  provider: 'password',
  addresses: [
    {
      id: 'a1',
      label: 'Home',
      name: 'Priya Mehta',
      line1: '123 Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400050',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true,
    },
  ],
};

// Fulfilment stages shown on the tracking timeline.
export const ORDER_STAGES = [
  { id: 'placed', label: 'Order Placed', desc: 'We have received your order.' },
  { id: 'crafting', label: 'Crafting', desc: 'Our artisans are hand-finishing your piece.' },
  { id: 'quality', label: 'Quality Check', desc: 'Certified inspection and polishing.' },
  { id: 'shipped', label: 'Shipped', desc: 'Insured and on its way to you.' },
  { id: 'delivered', label: 'Delivered', desc: 'Delivered and signed for.' },
];

const DAY = 86400000;

export const SEED_ORDERS = [
  {
    id: 'AG-48213',
    email: DEMO_USER.email,
    createdAt: Date.now() - 3 * DAY,
    stage: 2,
    shippingMethod: 'standard',
    address: { name: 'Priya Mehta', line1: '123 Bandra West', city: 'Mumbai', state: 'Maharashtra', zip: '400050', country: 'India' },
    items: [
      { key: 'r1', id: 'r1', name: 'Aurora Solitaire', subtitle: 'Classic 4-Prong Cathedral Setting', price: 799, qty: 1, image: '/images/ring1_plain.jpg', meta: { size: '7' } },
    ],
    totals: { subtotal: 799, discount: 0, shipping: 0, tax: 63.92, total: 862.92 },
  },
  {
    id: 'AG-31877',
    email: DEMO_USER.email,
    createdAt: Date.now() - 40 * DAY,
    stage: 4,
    shippingMethod: 'express',
    address: { name: 'Priya Mehta', line1: '123 Bandra West', city: 'Mumbai', state: 'Maharashtra', zip: '400050', country: 'India' },
    items: [
      { key: 'e1', id: 'e1', name: 'Lumiere Diamond Studs', subtitle: '18K Gold - Round Brilliant Diamond', price: 1200, qty: 1, image: '/images/prod_earrings1.jpg', meta: {} },
    ],
    totals: { subtotal: 1200, discount: 120, shipping: 45, tax: 86.4, total: 1211.4 },
  },
];

// Accounts offered by the simulated Google chooser.
export const GOOGLE_ACCOUNTS = [
  { firstName: 'Ananya', lastName: 'Sharma', email: 'ananya.sharma@gmail.com' },
  { firstName: 'Rohan', lastName: 'Verma', email: 'rohan.verma@gmail.com' },
];
