import { CONFIG_SIZES, SIZE_CHART, SIZE_GUIDE_STEPS } from '../../data/configurator';
import PanelHeader from './PanelHeader';

export default function SizeStep({ selected, onSelect, onBack, onNext }) {
  return (
    <div className="conf-panel active">
      <PanelHeader title="Select Your Ring Size" subtitle="US sizes. Complimentary resize within 60 days of delivery." />
      <div className="conf-size-layout">
        <div>
          <div className="conf-size-grid">
            {CONFIG_SIZES.map((size) => (
              <button key={size} className={`csz-btn${selected === size ? ' sel' : ''}`} onClick={() => onSelect(size)}>
                {size}
              </button>
            ))}
          </div>
          <p className="size-note">✦ Free resize within 60 days &nbsp;|&nbsp; ✦ Engraving available (size 5+)</p>
        </div>
        <div className="size-guide-card">
          <h4>How to Measure</h4>
          <div className="sg-steps">
            {SIZE_GUIDE_STEPS.map((text, i) => (
              <div className="sg-step" key={text}>
                <span className="sg-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="sg-chart">
            <div className="sg-row head">
              <span>US</span>
              <span>Diameter</span>
              <span>Circumference</span>
            </div>
            {SIZE_CHART.map((row) => (
              <div className="sg-row" key={row.us}>
                <span>{row.us}</span>
                <span>{row.diameter}</span>
                <span>{row.circumference}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="conf-nav">
        <button className="conf-nav-back" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-gold conf-next" onClick={onNext} disabled={!selected}>
          Continue to Stone →
        </button>
      </div>
    </div>
  );
}
