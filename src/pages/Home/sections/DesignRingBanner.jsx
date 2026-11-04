import { Link } from 'react-router-dom';
import { HOME } from '../../../data/site';
import { splitFirstSentence } from '../../../utils/text';

export default function DesignRingBanner() {
  // Copy is managed in the admin (GET /home -> design_ring_banner).
  const b = HOME.designRingBanner ?? {};
  const [line1, line2] = splitFirstSentence(b.text || "Choose your setting, your size, your stone. Priced live on today's gold market.");
  return (
    <Link className="drb" to={b.cta?.to || '/design-your-ring'}>
      <div className="drb-img">
        <img src="/images/banner_design_ring.jpg" alt="Design your ring" data-parallax="0.12" />
        <div className="drb-overlay" />
      </div>
      <div className="drb-content">
        <p className="drb-tag" data-reveal="fade">{b.tag || 'Bespoke Service'}</p>
        <h2 className="drb-title" data-reveal="up">
          {b.titleLine1 || 'Design'}
          <br />
          <em>{b.titleLine2 || 'Your Perfect Ring'}</em>
        </h2>
        <p className="drb-desc">
          {line1}
          {line2 && <br />}
          {line2}
        </p>
        <span className="btn-gold" data-magnetic>{b.cta?.label || 'Begin Your Creation →'}</span>
      </div>
    </Link>
  );
}
