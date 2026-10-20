import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { SearchIcon } from '../common/Icons';

const MAX_RESULTS = 6;

export default function SearchOverlay() {
  const { overlay, close } = useUI();
  const navigate = useNavigate();
  const { productPrice } = usePricing();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const open = overlay === 'search';

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // Filters the static catalogue in-memory
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.includes(q) || p.tags.some((t) => t.includes(q)),
    ).slice(0, MAX_RESULTS);
  }, [query]);

  const dismiss = () => {
    setQuery('');
    close();
  };

  const openProduct = (id) => {
    dismiss();
    navigate(`/product/${id}`);
  };

  return (
    <div className={`search-ov${open ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && dismiss()}>
      <div className="search-box">
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search rings, necklaces, stones…"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <button onClick={dismiss} aria-label="Close search">
          ✕
        </button>
      </div>
      {query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="sr-empty">No results found</div>
          ) : (
            results.map((p) => (
              <button className="sr-item" key={p.id} onClick={() => openProduct(p.id)}>
                <img src={p.image} alt={p.name} />
                <div>
                  <p className="sr-name">{p.name}</p>
                  <p className="sr-cat">
                    {p.category} · {formatPrice(productPrice(p).price)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
