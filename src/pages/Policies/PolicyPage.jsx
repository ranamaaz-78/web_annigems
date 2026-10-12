import { Link, Navigate, useLocation } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { POLICIES } from '../../data/policies';
import { getLenis } from '../../lib/lenis';

const OTHER_LINKS = [
  { to: '/shipping-policy', label: 'Shipping Policy' },
  { to: '/returns', label: 'Returns & Exchange' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/warranty', label: 'Warranty & Care' },
  { to: '/faq', label: 'FAQ' },
];

// One component renders every policy page, keyed off the URL path (/shipping-policy, /returns, ...).
export default function PolicyPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const policy = POLICIES[slug];

  if (!policy) return <Navigate to="/" replace />;

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -100 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-wrap">
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: policy.title }]} eyebrow={policy.eyebrow} title={policy.title} subtitle={policy.intro} />
      <div className="policy-layout">
        <aside className="policy-toc" data-reveal="left">
          <p className="toc-title">On this page</p>
          {policy.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => jump(e, s.id)}>
              {s.heading}
            </a>
          ))}
          <p className="toc-title" style={{ marginTop: 24 }}>
            More policies
          </p>
          {OTHER_LINKS.filter((l) => l.to !== pathname).map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </aside>
        <article className="policy-body">
          <p className="muted">Last updated {policy.updated}</p>
          {policy.sections.map((s, i) => (
            <section key={s.id} id={s.id} data-reveal="up">
              <h2>
                <span>{String(i + 1).padStart(2, '0')}</span> {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <div className="policy-help" data-reveal="up">
            <h3>Still have questions?</h3>
            <p>Our advisors are happy to help.</p>
            <Link to="/contact" className="btn-gold" data-magnetic>
              Contact us
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
