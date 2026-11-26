import { SIZE_CHART, SIZE_GUIDE_STEPS } from '../../data/configurator';
import { formatPrice } from '../../utils/format';
import { configuratorTotal } from '../../utils/pricing';
import GemIcon from './GemIcon';

// Option lists shared by the desktop studio and the phone layout (CSS arranges them per layout).

export function RingOptions({ rings, selected, onChoose, configPrice }) {
  return (
    <div className="dyr-rings">
      {rings.map((r) => (
        <button key={r.id} type="button" className={`dyr-opt dyr-ring${selected?.id === r.id ? ' sel' : ''}`} onClick={() => onChoose(r)} aria-pressed={selected?.id === r.id}>
          <span className="dyr-ring-img">
            <img src={r.image} alt="" />
          </span>
          <span className="dyr-opt-body">
            <span className="dyr-opt-name">{r.name}</span>
            <span className="dyr-opt-meta dyr-ring-type">{r.type}</span>
            <span className="dyr-opt-meta">
              {r.karat}K · {r.goldWeightG}g gold
            </span>
          </span>
          <span className="dyr-opt-price">
            <small>from</small>
            {formatPrice(configPrice(r.goldValue + r.craftFee))}
          </span>
        </button>
      ))}
    </div>
  );
}

export function StoneOptions({ stones, ring, selected, onChoose, configPrice }) {
  return (
    <div className="dyr-stones">
      {stones.map((s) => (
        <button key={s.id} type="button" className={`dyr-opt dyr-stone${selected?.id === s.id ? ' sel' : ''}`} onClick={() => onChoose(s)} aria-pressed={selected?.id === s.id}>
          <GemIcon stone={s} />
          <span className="dyr-opt-body">
            <span className="dyr-opt-name">{s.name}</span>
            <span className="dyr-opt-meta">{[s.carat && `${s.carat} ct`, s.origin].filter(Boolean).join(' · ')}</span>
            <span className="dyr-stone-row">
              <span className="dyr-stone-total">{ring ? formatPrice(configPrice(configuratorTotal(ring, s))) : `+${formatPrice(s.gemPrice)}`}</span>
              {s.rarity && <span className={`dyr-rarity ${s.rarity.toLowerCase()}`}>{s.rarity}</span>}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function SizeOptions({ sizes, selected, onChoose }) {
  return (
    <div className="dyr-sizes" role="radiogroup" aria-label="US ring size">
      {sizes.map((v) => (
        <button key={v} type="button" role="radio" aria-checked={selected === String(v)} className={`dyr-size${selected === String(v) ? ' sel' : ''}`} onClick={() => onChoose(v)}>
          {v}
        </button>
      ))}
    </div>
  );
}

export function SizeGuide() {
  return (
    <div className="dyr-guide">
      <ol>
        {SIZE_GUIDE_STEPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
      <table>
        <thead>
          <tr>
            <th>US</th>
            <th>Diameter</th>
            <th>Circumference</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((row) => (
            <tr key={row.us}>
              <td>{row.us}</td>
              <td>{row.diameter}</td>
              <td>{row.circumference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PriceBreakdown({ ring, stone, price, perOz, isB2B, ringPercent }) {
  return (
    <dl className="dyr-break">
      <div>
        <dt>
          Gold · {ring.goldWeightG}g × {ring.karat}K at {formatPrice(perOz)}/oz
        </dt>
        <dd>{formatPrice(price.gold)}</dd>
      </div>
      <div>
        <dt>Craftsmanship &amp; setting</dt>
        <dd>{formatPrice(price.craft)}</dd>
      </div>
      {stone && (
        <div>
          <dt>{stone.name}</dt>
          <dd>{formatPrice(price.gem)}</dd>
        </div>
      )}
      {isB2B && price.retail > price.total && (
        <div className="b2b">
          <dt>Business pricing ({ringPercent}% off)</dt>
          <dd>−{formatPrice(price.retail - price.total)}</dd>
        </div>
      )}
    </dl>
  );
}
