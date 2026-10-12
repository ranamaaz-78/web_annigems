// Policy page content. Each policy: slug, title, intro, updated and sections [{ id, heading, body: string[] }].
// NOTE: placeholder copy for client review — have legal approve before launch.

const UPDATED = '1 October 2026';

export const POLICIES = {
  'shipping-policy': {
    title: 'Shipping Policy',
    eyebrow: 'Delivery',
    intro: 'Every order is insured, tracked and signed for. Here is how we get your piece safely to you.',
    updated: UPDATED,
    sections: [
      {
        id: 'processing',
        heading: 'Processing time',
        body: [
          'Ready-to-ship pieces are dispatched within 2–3 business days. Made-to-order and customised pieces, including rings from Design Your Ring, are handcrafted and typically ship within 4–6 weeks.',
          'You will receive an email at every stage: order confirmed, crafting, quality check and shipped.',
        ],
      },
      {
        id: 'methods',
        heading: 'Delivery methods & rates',
        body: [
          'Standard Delivery (5–7 business days) is $25 and free on orders over $500. Express Delivery (2–3 business days) is $45. Overnight Delivery (next business day) is $95.',
          'International orders carry an additional $20 handling charge and may take longer depending on customs.',
        ],
      },
      {
        id: 'insurance',
        heading: 'Insurance & signature',
        body: ['All parcels are fully insured for their declared value and require an adult signature on delivery. We cannot leave jewelry unattended.'],
      },
      {
        id: 'customs',
        heading: 'Customs & duties',
        body: ['International customers are responsible for any import duties or taxes charged by their country. These are not included in our prices.'],
      },
    ],
  },
  returns: {
    title: 'Returns & Exchange',
    eyebrow: 'Peace of mind',
    intro: 'Not completely in love? Return or exchange within 30 days — no questions asked.',
    updated: UPDATED,
    sections: [
      {
        id: 'window',
        heading: '30-day returns',
        body: ['You may return any ready-to-ship piece within 30 days of delivery for a full refund, provided it is unworn, in original condition and in its original packaging with certificates.'],
      },
      {
        id: 'custom',
        heading: 'Custom & engraved pieces',
        body: ['Because they are made especially for you, bespoke rings and engraved items cannot be returned, but we will happily resize or repair them free of charge for 60 days.'],
      },
      {
        id: 'how',
        heading: 'How to return',
        body: ['Contact us with your order number to receive a prepaid, insured return label. Once we receive and inspect the piece, your refund is issued to the original payment method within 5–7 business days.'],
      },
      {
        id: 'exchange',
        heading: 'Exchanges',
        body: ['Prefer a different size or design? Exchanges are free within 30 days. Any price difference is charged or refunded.'],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Your data',
    intro: 'We collect only what we need to serve you and we never sell your personal information.',
    updated: UPDATED,
    sections: [
      {
        id: 'collect',
        heading: 'Information we collect',
        body: ['Account details (name, email, phone), delivery addresses, order history and, if you contact us, the messages you send. Payment details are handled by our payment processor and are never stored by us.'],
      },
      {
        id: 'use',
        heading: 'How we use it',
        body: ['To process and deliver orders, provide support, send order updates and, with your consent, share news about new collections. You can unsubscribe at any time.'],
      },
      {
        id: 'cookies',
        heading: 'Cookies & storage',
        body: ['We use essential cookies and local storage to remember your cart, wishlist, theme and sign-in. Analytics cookies are used only in aggregate.'],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        body: ['You may request access to, correction of, or deletion of your data at any time by contacting privacy@aanigems.com.'],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    eyebrow: 'Legal',
    intro: 'By using this site and placing an order you agree to the terms below.',
    updated: UPDATED,
    sections: [
      {
        id: 'orders',
        heading: 'Orders & pricing',
        body: ['All prices are shown in US dollars and may change with the gold market. The price confirmed at checkout is the price you pay. We may cancel an order if a pricing error occurs, with a full refund.'],
      },
      {
        id: 'payment',
        heading: 'Payment',
        body: ['We accept major cards, UPI and net banking. Orders are processed once payment is authorised.'],
      },
      {
        id: 'ip',
        heading: 'Intellectual property',
        body: ['All designs, images and content on this site belong to AANI GEMAS and may not be reproduced without written permission.'],
      },
      {
        id: 'liability',
        heading: 'Limitation of liability',
        body: ['To the extent permitted by law, our liability is limited to the purchase price of the product concerned.'],
      },
      {
        id: 'law',
        heading: 'Governing law',
        body: ['These terms are governed by the laws of India. Disputes fall under the jurisdiction of the courts of Mumbai.'],
      },
    ],
  },
  warranty: {
    title: 'Warranty & Lifetime Care',
    eyebrow: 'Made to last',
    intro: 'Every AANI GEMAS piece is backed by a lifetime craftsmanship warranty and complimentary care.',
    updated: UPDATED,
    sections: [
      {
        id: 'covered',
        heading: "What's covered",
        body: ['Manufacturing defects, faulty stone settings, broken clasps and prongs, and loss of plating in normal wear, for the lifetime of the piece.'],
      },
      {
        id: 'not-covered',
        heading: 'What is not covered',
        body: ['Accidental damage, loss or theft, damage from chemicals, and wear from improper use. We can often repair these for a fair charge.'],
      },
      {
        id: 'care',
        heading: 'Complimentary care',
        body: ['Free professional cleaning, inspection and polishing once a year, and free resizing within 60 days of purchase.'],
      },
      {
        id: 'claim',
        heading: 'Making a claim',
        body: ['Contact us with your order number and photos. We will send an insured prepaid label and repair or replace the piece.'],
      },
    ],
  },
};

export const FAQS = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Ready-to-ship pieces arrive in 5–7 business days with Standard Delivery. Made-to-order pieces ship within 4–6 weeks.' },
      { q: 'Is shipping free?', a: 'Standard shipping is free on orders over $500. Otherwise rates start at $25.' },
      { q: 'Can I track my order?', a: 'Yes. Use the Track Order page with your order number and email, or view it under My Account.' },
    ],
  },
  {
    category: 'Returns & Care',
    items: [
      { q: 'What is your return policy?', a: '30-day free returns on unworn, ready-to-ship pieces. Custom and engraved items are repaired or resized instead.' },
      { q: 'Do you offer resizing?', a: 'Free resizing within 60 days of purchase on most rings. Beyond that, a small fee applies.' },
      { q: 'How do I care for my jewelry?', a: 'Store it in the provided pouch, avoid harsh chemicals and clean gently with a soft cloth. We offer complimentary yearly cleaning.' },
    ],
  },
  {
    category: 'Gold & Gemstones',
    items: [
      { q: 'What gold purity do you use?', a: 'All our gold jewelry is 18K (75% pure gold), hallmarked and certified.' },
      { q: 'Are your diamonds certified?', a: 'Yes. All diamonds and major gemstones are GIA certified and come with their certificate.' },
      { q: 'Why does the price change?', a: 'Gold-based prices follow the live gold rate so you only ever pay a fair, transparent price.' },
    ],
  },
  {
    category: 'Custom Rings & Payment',
    items: [
      { q: 'How does Design Your Ring work?', a: 'Choose a setting, a stone and your size in four steps and see a live price. Our artisans then craft it to order.' },
      { q: 'Which payment methods do you accept?', a: 'Visa, Mastercard, AMEX, PayPal, UPI and net banking.' },
      { q: 'Is my payment secure?', a: 'Yes. Payments are encrypted and processed by a PCI-compliant provider.' },
    ],
  },
];
