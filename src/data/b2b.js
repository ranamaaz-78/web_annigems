// Copy for the B2B (business) pages. Business accounts, tiers and orders come from the API.

export const BUSINESS_TYPES = ['Retail jeweller', 'Wholesaler', 'Boutique / designer', 'Online retailer', 'Other'];

export const WHOLESALE_PERKS = [
  { icon: '✦', title: 'Member pricing', text: 'Platinum, Gold or Silver discounts on the full catalogue' },
  { icon: '◈', title: 'Cash on delivery', text: 'Order online, pay when your order arrives' },
  { icon: '♦', title: 'Custom rings', text: 'Design Your Ring at member rates' },
];

// What a business order goes through (shown on the review step).
export const B2B_ORDER_FLOW = [
  'Our team reviews and approves your order.',
  'Once approved, our artisans craft and quality-check your pieces.',
  'You pay in cash when the order is delivered.',
];
