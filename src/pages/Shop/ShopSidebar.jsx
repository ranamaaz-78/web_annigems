import { CATEGORIES, MAX_PRICE, STONE_FILTERS } from '../../data/catalog';
import { formatPrice, formatPriceRounded } from '../../utils/format';

const CATEGORY_OPTIONS = [{ id: 'all', label: 'All' }, ...CATEGORIES];

export default function ShopSidebar({ category, maxPrice, stones, onCategory, onMaxPrice, onToggleStone, onReset, open, onClose, count }) {
  return (
    <>
    {/* Phones and tablets: the sidebar is a bottom sheet opened by the Filters button */}
    <div className={`sb-backdrop${open ? ' open' : ''}`} onClick={onClose} aria-hidden="true" />
    <aside className={`sidebar${open ? ' open' : ''}`} id="shop-filters" aria-label="Filters" data-lenis-prevent>
      <div className="sb-head">
        <span>Filters</span>
        <button type="button" onClick={onClose} aria-label="Close filters">
          ✕
        </button>
      </div>
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
          <span>{formatPriceRounded(0)}</span>
          <span>{maxPrice >= MAX_PRICE ? `${formatPriceRounded(MAX_PRICE)}+` : formatPrice(maxPrice)}</span>
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
      <div className="sb-foot">
        <button type="button" className="btn-gold btn-full" onClick={onClose}>
          Show {count} pieces
        </button>
      </div>
    </aside>
    </>
  );
}
