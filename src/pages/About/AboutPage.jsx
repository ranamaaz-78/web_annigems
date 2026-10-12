import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { ABOUT } from '../../data/about';
import { BRAND } from '../../data/site';

export default function AboutPage() {
  return (
    <>
      <div className="page-wrap">
        <PageHero
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Story' }]}
          eyebrow={`Since ${BRAND.since}`}
          title="Where Gold Meets Artistry"
          subtitle="Four decades of handcrafted fine jewelry, made one piece at a time."
        />
      </div>

      <section className="about-feature">
        <div className="about-img" data-reveal="scale">
          <img src="/images/banner_design_ring.jpg" alt="Artisan crafting a ring" data-parallax="0.12" />
        </div>
        <div className="about-copy">
          <p className="sec-ey" data-reveal="fade">
            Our Story
          </p>
          <h2 className="sec-title" data-split>
            Crafted with passion. Worn with pride.
          </h2>
          {ABOUT.story.map((p) => (
            <p className="sec-sub" key={p} data-reveal="up">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="stats-band" data-stagger=".stat-item">
        {ABOUT.stats.map((s) => (
          <div className="stat-item" key={s.label}>
            <span className="stat-big" data-count={s.value} data-suffix={s.suffix}>
              0
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="sec-hdr">
          <p className="sec-ey" data-reveal="fade">
            What we stand for
          </p>
          <h2 className="sec-title" data-split>
            Our Values
          </h2>
        </div>
        <div className="values-grid" data-stagger=".value-card">
          {ABOUT.values.map((v) => (
            <div className="value-card" key={v.title}>
              <span className="value-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sec-hdr">
          <p className="sec-ey" data-reveal="fade">
            Our Journey
          </p>
          <h2 className="sec-title" data-split>
            Milestones
          </h2>
        </div>
        <ol className="milestones" data-stagger="li">
          {ABOUT.milestones.map((m) => (
            <li key={m.year}>
              <span className="ms-year">{m.year}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="sec-cta" data-reveal="up">
          <Link className="btn-gold" to="/design-your-ring" data-magnetic>
            Design Your Ring
          </Link>{' '}
          <Link className="btn-outline" to="/contact">
            Visit the Atelier
          </Link>
        </div>
      </section>
    </>
  );
}
