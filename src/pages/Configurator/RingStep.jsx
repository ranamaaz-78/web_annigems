import { CONFIG_RINGS } from '../../data/configurator';
import PanelHeader from './PanelHeader';

export default function RingStep({ selected, onSelect }) {
  return (
    <div className="conf-panel active">
      <PanelHeader title="Choose Your Setting" subtitle="Select the gold ring style you would like to customize." />
      <div className="conf-ring-grid">
        {CONFIG_RINGS.map((ring) => (
          <button
            key={ring.id}
            className={`crc${selected?.id === ring.id ? ' sel' : ''}`}
            onClick={() => onSelect(ring)}
           
          >
            <div className="crc-img">
              <img src={ring.image} alt={ring.name} />
              <div className="crc-hover-lbl">Select →</div>
            </div>
            <div className="crc-body">
              <div className="crc-head">
                <div>
                  <p className="crc-name">{ring.name}</p>
                  <p className="crc-type">{ring.type}</p>
                </div>
                <span className="crc-badge">18K Gold</span>
              </div>
              <p className="crc-desc">{ring.description}</p>
              <div className="crc-specs">
                <span>Gold: {ring.goldWeightG}g</span>
                <span>{ring.setting}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
