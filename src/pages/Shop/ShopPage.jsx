import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import { CATEGORIES, MAX_PRICE, SORT_OPTIONS } from '../../data/catalog';
import { PRODUCTS } from '../../data/products';
import { capitalize } from '../../utils/format';
import { filterProducts } from './filterProducts';
import ShopSidebar from './ShopSidebar';

const VALID_CATEGORIES = ['all', ...CATEGORIES.map((c) => c.id)];
const VALID_SORTS = SORT_OPTIONS.map((o) => o.value);

export default function ShopPage() {
  // Category, sort and max price live in the URL so links and the back button work
  const [params, setParams] = useSearchParams();
  const [stones, setStones] = useState([]);

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

  const toggleStone = (stone) =>
    setStones((prev) => (prev.includes(stone) ? prev.filter((s) => s !== stone) : [...prev, stone]));

  const resetFilters = () => {
    setStones([]);
    setParams({});
  };

  const products = useMemo(
    () => filterProducts(PRODUCTS, { category, maxPrice, stones, sort }),
    [category, maxPrice, stones, sort],
  );

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
        />
        <div>
          <div className="shop-toolbar">
            <p className="shop-count">{products.length} pieces</p>
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
          <ProductGrid products={products} variant="cols3">
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
