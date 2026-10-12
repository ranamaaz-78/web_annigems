import { CATEGORIES, MAX_PRICE, STONE_FILTERS } from '../../data/catalog';
import { formatPrice } from '../../utils/format';

const CATEGORY_OPTIONS = [{ id: 'all', label: 'All Jewelry' }, ...CATEGORIES];

export default function ShopSidebar({ category, maxPrice, stones, onCategory, onMaxPrice, onToggleStone, onReset }) {
  return (
    <aside className="sidebar">
      <div className="sb-section">
        <p className="sb-title">Category</p>
        <div className="sb-cats">
          {CATEGORY_OPTIONS.map((c) => (
            <button key={c.id} className={`sb-cat${category === c.id ? ' active' : ''}`} onClick={() => onCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-section">
        <p className="sb-title">Price Range</p>
        <input
          type="range"
          className="price-slider"
          min="0"
          max={MAX_PRICE}
          step="50"
          value={maxPrice}
          onChange={(e) => onMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
        />
        <div className="price-labels">
          <span>$0</span>
          <span>{maxPrice >= MAX_PRICE ? '$5,000+' : formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div className="sb-section">
        <p className="sb-title">Stone</p>
        <div className="chk-filters">
          {STONE_FILTERS.map((stone) => (
            <label className="chk-label" key={stone}>
              <input type="checkbox" checked={stones.includes(stone)} onChange={() => onToggleStone(stone)} /> {stone}
            </label>
          ))}
        </div>
      </div>

      <button className="btn-ghost btn-full" onClick={onReset}>
        Clear All Filters
      </button>
    </aside>
  );
}
