import { Link } from 'react-router-dom';

export default function DesignRingBanner() {
  return (
    <Link className="drb" to="/design-your-ring">
      <div className="drb-img">
        <img src="/images/banner_design_ring.jpg" alt="Design your ring" data-parallax="0.12" />
        <div className="drb-overlay" />
      </div>
      <div className="drb-content">
        <p className="drb-tag" data-reveal="fade">Bespoke Service</p>
        <h2 className="drb-title" data-reveal="up">
          Design
          <br />
          <em>Your Perfect Ring</em>
        </h2>
        <p className="drb-desc">
          Choose your setting, your size, your stone.
          <br />
          Priced live on today&apos;s gold market.
        </p>
        <span className="btn-gold" data-magnetic>Begin Your Creation →</span>
      </div>
    </Link>
  );
}
