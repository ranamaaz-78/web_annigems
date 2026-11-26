import { useMetalRates } from '../../../hooks/useMetalRates';

const CHIP = { XAU: 'Au', XAG: 'Ag' };

function Change({ value }) {
  const dir = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  return (
    <span className={`mf-chg ${dir}`} title="Change since the first reading of the day">
      {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '•'} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// Flat list of ticker cells: per ounce first, then each purity per gram.
const toCells = (metals) =>
  metals.flatMap((m) => [
    { key: `${m.symbol}-oz`, symbol: m.symbol, label: `${m.name} spot`, price: m.per_oz.formatted, unit: '/oz', change: m.change_percent },
    ...m.per_gram.map((g) => ({
      key: `${m.symbol}-${g.purity}`,
      symbol: m.symbol,
      label: `${m.name} ${g.purity}`,
      price: g.price.formatted,
      unit: '/g',
    })),
  ]);

function Row({ cells, hidden }) {
  return (
    <ul className="mf-row" aria-hidden={hidden || undefined}>
      {cells.map((c) => (
        <li className="mf-cell" key={c.key}>
          <span className={`mf-chip ${c.symbol.toLowerCase()}`}>{CHIP[c.symbol]}</span>
          <span className="mf-info">
            <span className="mf-label">{c.label}</span>
            <span className="mf-line">
              {/* keyed by price so a new value flashes once */}
              <span className="mf-price" key={c.price}>
                {c.price}
              </span>
              <span className="mf-unit">{c.unit}</span>
              {c.change !== undefined && <Change value={c.change} />}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function MetalFeed() {
  const rates = useMetalRates();
  const cells = rates ? toCells(rates.metals) : [];
  const time = rates && new Date(rates.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="mf" aria-label="Live gold and silver rates">
      <div className={`mf-badge${rates?.stale ? ' stale' : ''}`} title={time ? `Updated ${time}` : undefined}>
        <span className="mf-live">
          <i />
          {rates?.stale ? 'Delayed' : 'Live'}
        </span>
        <span className="mf-time">{time || '…'}</span>
      </div>
      <div className="mf-view">
        {cells.length ? (
          <div className="mf-track">
            <Row cells={cells} />
            {/* second copy makes the scroll loop seamless */}
            <Row cells={cells} hidden />
          </div>
        ) : (
          <p className="mf-wait">Fetching gold and silver prices…</p>
        )}
      </div>
    </section>
  );
}
