// Pure filter + sort over the static catalogue.
export function filterProducts(products, { category, maxPrice, stones, sort }) {
  const stoneKeys = stones.map((s) => s.toLowerCase());

  const result = products.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (p.price > maxPrice) return false;
    if (stoneKeys.length) {
      const stone = p.stone.toLowerCase();
      const matches = stoneKeys.some((s) => (s === 'no stone' ? stone === 'no stone' : stone.includes(s)));
      if (!matches) return false;
    }
    return true;
  });

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => (b.badge === 'New') - (a.badge === 'New'),
  };
  return sorters[sort] ? [...result].sort(sorters[sort]) : result;
}
