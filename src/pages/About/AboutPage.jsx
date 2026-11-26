import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ABOUT } from '../../data/about';
import { BRAND, HOME } from '../../data/site';

// How a piece is made, in the order the story above describes it.
const PROCESS = [
  { n: '01', title: 'Designed in-house', text: 'Every piece begins as a sketch at our Mumbai atelier.' },
  { n: '02', title: 'Stones selected', text: 'GIA certified gemstones and responsibly sourced 18K gold.' },
  { n: '03', title: 'Set by hand', text: 'Master artisans shape, set and polish each piece by hand.' },
  { n: '04', title: 'Inspected', text: 'Checked under magnification before it leaves the workshop.' },
];

export default function AboutPage() {
  const heroImage = HOME.hero?.image || '/images/hero_banner_user.jpg';
  const [lead, ...rest] = ABOUT.story;

  return (
    <div className="ab">
      {/* ── Hero: full-width photo, title and the stats on a glass strip ── */}
      <section className="ab-hero">
        <img className="ab-hero-img" src={heroImage} alt="" data-parallax="0.1" />
        <div className="ab-hero-shade" />
        <div className="ab-hero-inner">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Our Story' }]} />
          <p className="ab-ey" data-reveal="fade">
            {BRAND.name} · Since {BRAND.since}
          </p>
          <h1 className="ab-hero-title" data-split>
            Where gold meets <em>artistry</em>
          </h1>
          <p className="ab-hero-sub" data-reveal="up">
            Four decades of handcrafted fine jewellery, made one piece at a time.
          </p>
        </div>
        {ABOUT.stats.length > 0 && (
          <div className="ab-stats" data-stagger=".ab-stat">
            {ABOUT.stats.map((s) => (
              <div className="ab-stat" key={s.label}>
                <span className="ab-stat-num" data-count={s.value} data-suffix={s.suffix}>
                  0
                </span>
                <span className="ab-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Story: editorial text beside a two-photo collage ── */}
      <section className="ab-story">
        <div className="ab-story-copy">
          <p className="ab-ey" data-reveal="fade">
            Our story
          </p>
          <h2 className="ab-h2" data-split>
            Crafted with passion. <em>Worn with pride.</em>
          </h2>
          {lead && (
            <p className="ab-lead" data-reveal="up">
              {lead}
            </p>
          )}
          {rest.map((p) => (
            <p className="ab-p" key={p} data-reveal="up">
              {p}
            </p>
          ))}
          <p className="ab-sign" data-reveal="fade">
            — The {BRAND.name} atelier, Mumbai
          </p>
        </div>
        <div className="ab-collage" data-reveal="scale">
          <img className="ab-col-main" src="/images/banner_design_ring.jpg" alt="An artisan setting a ruby by hand" data-parallax="0.08" />
          <img className="ab-col-small" src="/images/ring2_sapphire.jpg" alt="A finished sapphire halo ring" />
          <span className="ab-col-badge">
            <b>{BRAND.since}</b>
            <small>Est. Mumbai</small>
          </span>
        </div>
      </section>

      {/* ── Values ── */}
      {ABOUT.values.length > 0 && (
        <section className="ab-band">
          <div className="ab-sec-hdr">
            <p className="ab-ey" data-reveal="fade">
              What we stand for
            </p>
            <h2 className="ab-h2" data-split>
              Our values
            </h2>
          </div>
          <div className="ab-values" data-stagger=".ab-value">
            {ABOUT.values.map((v, i) => (
              <article className="ab-value" key={v.title}>
                <span className="ab-value-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ab-value-ico" aria-hidden="true">
                  {v.icon}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── How a piece is made ── */}
      <section className="ab-sec">
        <div className="ab-sec-hdr">
          <p className="ab-ey" data-reveal="fade">
            From sketch to sparkle
          </p>
          <h2 className="ab-h2" data-split>
            How every piece is made
          </h2>
        </div>
        <ol className="ab-process" data-stagger="li">
          {PROCESS.map((s) => (
            <li key={s.n}>
              <span className="ab-process-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Journey: horizontal timeline (vertical on phones) ── */}
      {ABOUT.milestones.length > 0 && (
        <section className="ab-sec">
          <div className="ab-sec-hdr">
            <p className="ab-ey" data-reveal="fade">
              Our journey
            </p>
            <h2 className="ab-h2" data-split>
              Milestones
            </h2>
          </div>
          <ol className="ab-timeline" data-stagger="li">
            {ABOUT.milestones.map((m) => (
              <li key={m.year}>
                <span className="ab-tl-dot" aria-hidden="true" />
                <span className="ab-tl-year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Call to action ── */}
      <section className="ab-cta" data-reveal="up">
        <img src="/images/ring1_diamond.jpg" alt="" />
        <div className="ab-cta-shade" />
        <div className="ab-cta-body">
          <p className="ab-ey">Begin your piece</p>
          <h2 className="ab-h2">
            Your story, <em>set in gold.</em>
          </h2>
          <div className="ab-cta-btns">
            <Link className="btn-gold" to="/design-your-ring" data-magnetic>
              Design your ring
            </Link>
            <Link className="ab-btn-ghost" to="/contact">
              Visit the atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
