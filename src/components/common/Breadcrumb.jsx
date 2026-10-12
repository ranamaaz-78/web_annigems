import { Link } from 'react-router-dom';

// items: [{ label, to? }] — the last item (no `to`) is the current page.
export default function Breadcrumb({ items, style }) {
  return (
    <nav className="bc" aria-label="Breadcrumb" style={style}>
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'contents' }}>
          {i > 0 && <span className="bc-sep">›</span>}
          {item.to ? (
            <Link className="bc-lk" to={item.to}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
