// Static data for the "Design Your Ring" configurator.

export const CONFIG_STEPS = ['Choose Ring', 'Select Size', 'Pick Stone', 'Preview'];

export const CONFIG_RINGS = [
  {
    id: 1,
    name: 'Aurora Solitaire',
    type: 'Classic 4-Prong Cathedral',
    goldWeightG: 3.2,
    craftFee: 180,
    setting: '4-Prong Cathedral',
    image: '/images/ring1_plain.jpg',
    description: 'A timeless cathedral setting with four elegant prongs.',
  },
  {
    id: 2,
    name: 'Elise Vintage Halo',
    type: 'Ornate Milgrain Setting',
    goldWeightG: 4.8,
    craftFee: 240,
    setting: 'Milgrain Halo',
    image: '/images/ring2_plain.jpg',
    description: 'Inspired by Edwardian artistry. Delicate milgrain borders and hand-carved filigree.',
  },
];

export const CONFIG_STONES = [
  {
    id: 'ruby',
    name: 'Burmese Ruby',
    origin: 'Mogok Valley, Myanmar',
    gemPrice: 450,
    rarity: 'Rare',
    color: '#e53935',
    glow: 'rgba(229,57,53,0.25)',
    gem: 'radial-gradient(ellipse at 30% 25%,#ff8a80,#e53935,#7f0000)',
    images: { 1: '/images/ring1_ruby.jpg', 2: '/images/ring2_ruby.jpg' },
    description: 'Fiery passion. 1.2 carats, AAA clarity, Mogok Valley.',
  },
  {
    id: 'sapphire',
    name: 'Ceylon Sapphire',
    origin: 'Sri Lanka',
    gemPrice: 520,
    rarity: 'Premium',
    color: '#1565c0',
    glow: 'rgba(21,101,192,0.25)',
    gem: 'radial-gradient(ellipse at 30% 25%,#82b1ff,#1565c0,#0a1628)',
    images: { 1: '/images/ring1_sapphire.jpg', 2: '/images/ring2_sapphire.jpg' },
    description: 'Royal elegance. 1.5 carats, VVS1 clarity, Sri Lanka.',
  },
  {
    id: 'emerald',
    name: 'Colombian Emerald',
    origin: 'Muzo, Colombia',
    gemPrice: 580,
    rarity: 'Rare',
    color: '#00897b',
    glow: 'rgba(0,137,123,0.25)',
    gem: 'radial-gradient(ellipse at 30% 25%,#69f0ae,#00897b,#00251a)',
    images: { 1: '/images/ring1_emerald.jpg', 2: '/images/ring2_emerald.jpg' },
    description: 'Finest green. 1.3 carats, VS1, Muzo Mines, Colombia.',
  },
  {
    id: 'diamond',
    name: 'White Diamond',
    origin: 'D-Color, VS1, GIA',
    gemPrice: 1200,
    rarity: 'Elite',
    color: '#90caf9',
    glow: 'rgba(144,202,249,0.2)',
    gem: null, // rendered with the animated .diamond CSS class instead
    images: { 1: '/images/ring1_diamond.jpg', 2: '/images/ring2_diamond.jpg' },
    description: 'The eternal classic. 1.0 carat D-color VS1, GIA certified.',
  },
];

// Configurator offers half sizes from 4 to 12
export const CONFIG_SIZES = Array.from({ length: 17 }, (_, i) => {
  const size = 4 + i * 0.5;
  return Number.isInteger(size) ? String(size) : size.toFixed(1);
});

export const SIZE_CHART = [
  { us: '5', diameter: '15.7mm', circumference: '49.3mm' },
  { us: '6', diameter: '16.5mm', circumference: '51.9mm' },
  { us: '7', diameter: '17.3mm', circumference: '54.4mm' },
  { us: '8', diameter: '18.2mm', circumference: '57.0mm' },
  { us: '9', diameter: '19.0mm', circumference: '59.5mm' },
  { us: '10', diameter: '19.8mm', circumference: '62.1mm' },
];

export const SIZE_GUIDE_STEPS = [
  'Wrap a strip of paper around your finger base',
  'Mark where it overlaps and measure in mm',
  'Use the chart below to find your US size',
];
