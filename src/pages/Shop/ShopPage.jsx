import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/client';
import { getLenis } from '../../lib/lenis';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import { CATEGORIES, MAX_PRICE, SORT_OPTIONS, STONE_FILTERS } from '../../data/catalog';
import { PRODUCTS, mergeProducts } from '../../data/products';
import { capitalize } from '../../utils/format';
import { filterProducts } from './filterProducts';
import ShopSidebar from './ShopSidebar';

const VALID_CATEGORIES = ['all', 'jewellery', ...CATEGORIES.map((c) => c.id)];
const VALID_SORTS = SORT_OPTIONS.map((o) => o.value);

export default function ShopPage() {
  // Category, sort and max price live in the URL so links and the back button work
  const [params, setParams] = useSearchParams();
  // ?stone=Ruby (Shop by Stone links) pre-selects that stone filter
  const [stones, setStones] = useState(() => params.getAll('stone').filter((s) => STONE_FILTERS.includes(s)));
  const [filtersOpen, setFiltersOpen] = useState(false); // bottom sheet on small screens

  const category = VALID_CATEGORIES.includes(params.get('cat')) ? params.get('cat') : 'all';
  const sort = VALID_SORTS.includes(params.get('sort')) ? params.get('sort') : 'featured';
  const maxParam = Number(params.get('max'));
  const maxPrice = maxParam > 0 && maxParam < MAX_PRICE ? maxParam : MAX_PRICE;

  const updateParam = (key, value, defaultValue) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, String(value));
        return next;
      },
      { replace: key === 'max' }, // dragging the slider shouldn't flood history
    );
  };

  // While the sheet is open: page scroll is locked, Escape or a wider window closes it.
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const close = () => setFiltersOpen(false);
    const onKey = (e) => e.key === 'Escape' && close();
    const wide = window.matchMedia('(min-width: 1025px)');
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', close);
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', close);
    };
  }, [filtersOpen]);

  const activeFilters = (category !== 'all' ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0) + stones.length;

  const toggleStone = (stone) =>
    setStones((prev) => (prev.includes(stone) ? prev.filter((s) => s !== stone) : [...prev, stone]));

  const resetFilters = () => {
    setStones([]);
    setParams({});
  };

  // Filtered on the server (GET /products). The catalogue loaded at start-up is filtered locally
  // until the response arrives, so the grid never flashes empty.
  const localProducts = useMemo(
    () => filterProducts(PRODUCTS, { category, maxPrice, stones, sort }),
    [category, maxPrice, stones, sort],
  );
  const filterKey = JSON.stringify({ category, maxPrice, stones, sort });
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const q = new URLSearchParams({ sort, per_page: '50' });
    if (category !== 'all') q.set('category', category);
    if (maxPrice < MAX_PRICE) q.set('max_price', String(Math.round(maxPrice * 100)));
    stones.forEach((s) => q.append('stone[]', s));
    const t = setTimeout(() => {
      api(`products?${q}`, { signal: controller.signal })
        .then((res) => setRemote({ key: filterKey, products: mergeProducts(res.data), total: res.meta?.total ?? res.data.length }))
        .catch(() => {});
    }, 150);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [filterKey, category, maxPrice, stones, sort]);

  const fresh = remote?.key === filterKey ? remote : null;
  const products = fresh ? fresh.products : localProducts;
  const count = fresh ? fresh.total : localProducts.length;

  const crumbs = [{ label: 'Home', to: '/' }, category === 'all' ? { label: 'Shop' } : { label: 'Shop', to: '/shop' }];
  if (category !== 'all') crumbs.push({ label: capitalize(category) });

  return (
    <div className="shop-page">
      <Breadcrumb items={crumbs} />
      <div className="shop-layout">
        <ShopSidebar
          category={category}
          maxPrice={maxPrice}
          stones={stones}
          onCategory={(id) => updateParam('cat', id, 'all')}
          onMaxPrice={(v) => updateParam('max', v, MAX_PRICE)}
          onToggleStone={toggleStone}
          onReset={resetFilters}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          count={count}
        />
        <div>
          <div className="shop-toolbar">
            <button
              type="button"
              className="filter-btn"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="shop-filters"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
              {activeFilters > 0 && <b>{activeFilters}</b>}
            </button>
            <p className="shop-count">{count} pieces</p>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value, 'featured')}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <ProductGrid products={products}>
            {products.length === 0 && (
              <div className="shop-empty">
                <p>No pieces match your filters.</p>
                <button className="btn-ghost" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </ProductGrid>
        </div>
      </div>
    </div>
  );
}
