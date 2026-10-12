// Brand, navigation, footer and store-policy content.

export const BRAND = {
  name: 'AANI GEMAS',
  logo: '/images/logo_aani.png',
  tagline: ['Crafted with passion.', 'Worn with pride.'],
  since: 1987,
};

// Static display rate — the frontend does not fetch live prices.
export const GOLD_RATE = {
  perOz: 2480,
  get perGram() {
    return this.perOz / 31.1035;
  },
  purity18k: 18 / 24,
};

export const USP_ITEMS = [
  { icon: '🚚', label: 'Free Shipping over $500' },
  { icon: '✦', label: 'GIA Certified Gemstones' },
  { icon: '↩', label: '30-Day Free Returns' },
  { icon: '🔒', label: 'Secure & Insured Delivery' },
  { icon: '♦', label: 'Lifetime Craftsmanship Warranty' },
];

export const MEGA_MENU = {
  columns: [
    {
      heading: 'Categories',
      links: [
        { label: 'Rings', to: '/shop?cat=rings' },
        { label: 'Necklaces', to: '/shop?cat=necklaces' },
        { label: 'Earrings', to: '/shop?cat=earrings' },
        { label: 'Bracelets', to: '/shop?cat=bracelets' },
      ],
    },
    {
      heading: 'Shop By',
      links: [
        { label: 'New Arrivals', to: '/shop?sort=newest' },
        { label: 'Bestsellers', to: '/shop?sort=rating' },
        { label: 'On Sale', to: '/shop' },
        { label: 'Under $1000', to: '/shop?max=1000' },
      ],
    },
    {
      heading: 'Collections',
      links: [
        { label: 'Engagement Rings', to: '/shop?cat=rings' },
        { label: 'Anniversary Gifts', to: '/shop' },
        { label: 'Bridal Sets', to: '/shop' },
        { label: 'Gift Guide', to: '/shop' },
      ],
    },
  ],
  featured: {
    tag: 'New Arrival',
    name: 'Seren Sapphire Halo',
    image: '/images/ring2_sapphire.jpg',
    to: '/product/r4',
  },
};

export const MOBILE_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Rings', to: '/shop?cat=rings' },
  { label: 'Necklaces', to: '/shop?cat=necklaces' },
  { label: 'Earrings', to: '/shop?cat=earrings' },
  { label: 'Bracelets', to: '/shop?cat=bracelets' },
  { label: '✦ Design Your Ring', to: '/design-your-ring', highlight: true },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Track Order', to: '/track-order' },
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Collections',
    links: [
      { label: 'Rings', to: '/shop?cat=rings' },
      { label: 'Necklaces', to: '/shop?cat=necklaces' },
      { label: 'Earrings', to: '/shop?cat=earrings' },
      { label: 'Bracelets', to: '/shop?cat=bracelets' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Design Your Ring', to: '/design-your-ring' },
      { label: 'Ring Resizing' },
      { label: 'Engraving' },
      { label: 'Jewelry Repairs' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Shipping Info', to: '/shipping-policy' },
      { label: 'Returns & Exchange', to: '/returns' },
      { label: 'Track Order', to: '/track-order' },
      { label: 'Warranty & Care', to: '/warranty' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'My Account', to: '/account' },
      { label: 'My Orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
];

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Shipping', to: '/shipping-policy' },
];

export const CONTACT = {
  address: '21 Linking Road, Bandra West, Mumbai 400050, India',
  phone: '+91 98765 43210',
  email: 'care@aanigems.com',
  hours: 'Mon–Sat, 10:00 – 19:00 IST',
  whatsapp: '919876543210',
  mapSrc: 'https://www.google.com/maps?q=Linking+Road+Bandra+West+Mumbai&output=embed',
};
export const PAYMENT_BADGES = ['VISA', 'MC', 'AMEX', 'PayPal', 'UPI'];

export const SHIPPING_POLICY = [
  'Free shipping on all orders over $500',
  'Insured and tracked worldwide delivery',
  '30-day hassle-free returns',
];

export const CARE_INSTRUCTIONS = [
  'Store in the provided jewelry pouch',
  'Avoid exposure to harsh chemicals',
  'Clean gently with a soft cloth',
];

export const FREE_SHIPPING_THRESHOLD = 500;
export const TAX_RATE = 0.08;

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 25, freeOverThreshold: true },
  { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 45 },
  { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 95 },
];

export const COUNTRIES = ['India', 'United States', 'United Kingdom', 'UAE', 'Other'];
export const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'];

export const PAYMENT_TABS = [
  { id: 'card', label: '💳 Credit Card' },
  { id: 'upi', label: '📱 UPI' },
  { id: 'bank', label: '🏦 Net Banking' },
];

export const TRUST_POINTS = ['🔒 Secure Checkout', '✦ GIA Certified Jewelry', '↩ 30-Day Returns'];

// Demo coupon codes (percent off the subtotal).
export const COUPONS = {
  AANI10: { percent: 10, label: '10% off your order' },
  WELCOME15: { percent: 15, label: '15% welcome offer' },
};
