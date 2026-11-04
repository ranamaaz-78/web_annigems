import { useEffect, useRef, useState } from 'react';
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { mergeProducts } from '../../data/products';
import { usePricing } from '../../hooks/usePricing';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { SearchIcon } from '../common/Icons';

const MAX_RESULTS = 6;
const SEARCH_DELAY_MS = 200;

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

  // Quick search on the API (GET /search?q=), debounced while typing.
  const [found, setFound] = useState({ q: '', items: [] });
  const term = query.trim();

  useEffect(() => {
    if (!term) return undefined;
    const controller = new AbortController();
    const t = setTimeout(() => {
      api(`search?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((res) => setFound({ q: term, items: mergeProducts(res.data).slice(0, MAX_RESULTS) }))
        .catch(() => {});
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [term]);

  // Previous results stay visible while the next request is in flight.
  const results = term ? found.items : [];
  const searched = found.q === term;

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
            searched && <div className="sr-empty">No results found</div>
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
