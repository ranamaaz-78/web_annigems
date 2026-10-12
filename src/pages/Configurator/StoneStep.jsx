import { CONFIG_STONES } from '../../data/configurator';
import { GOLD_RATE } from '../../data/site';
import { formatPrice } from '../../utils/format';
import { goldValue } from '../../utils/pricing';
import PanelHeader from './PanelHeader';
import StoneGem from './StoneGem';

export default function StoneStep({ ring, size, selected, onSelect, onChangeRing, onBack }) {
  const goldCost = goldValue(ring);

  return (
    <div className="conf-panel active">
      <PanelHeader title="Select Your Gemstone" subtitle="Each stone is ethically sourced and hand-graded.">
        <div className="live-badge">
          <span className="live-dot" />
          <span>Gold: {formatPrice(GOLD_RATE.perOz)}/oz</span>
        </div>
      </PanelHeader>

      <div className="ring-bar">
        <img src={ring.image} alt={ring.name} />
        <div className="ring-bar-info">
          <p className="ring-bar-name">{ring.name}</p>
          <p className="ring-bar-size">US Size {size}</p>
        </div>
        <button className="ring-bar-btn" onClick={onChangeRing}>
          Change Ring
        </button>
      </div>

      <div className="stone-grid">
        {CONFIG_STONES.map((stone) => (
          <button
            key={stone.id}
            className={`sc${selected?.id === stone.id ? ' sel' : ''}`}
            onClick={() => onSelect(stone)}
           
          >
            <div className="sc-gem-wrap">
              <StoneGem stone={stone} />
            </div>
            <div className="sc-info">
              <div className="sc-top">
                <h4 className="sc-name">{stone.name}</h4>
                <span className={`sc-rarity ${stone.rarity.toLowerCase()}`}>{stone.rarity}</span>
              </div>
              <p className="sc-origin">{stone.origin}</p>
              <div className="sc-price-row">
                <span className="sc-gem-price">{formatPrice(stone.gemPrice)}</span>
                <span className="sc-gold-price">+ {formatPrice(goldCost)} gold</span>
              </div>
              <p className="sc-desc">{stone.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="conf-nav">
        <button className="conf-nav-back" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}
