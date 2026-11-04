import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { SERVICES } from '../../data/site';


export default function ServicesPage() {
  return (
    <div className="page-wrap">
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="After-care"
        title="Our Services"
        subtitle="Your piece is for life. We resize, engrave, repair and redesign it whenever you need."
      />
      <div className="svc-grid" data-stagger=".svc-card">
        {SERVICES.map((s) => (
          <article className="svc-card" key={s.title}>
            <span className="svc-icon">{s.icon}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <small>{s.note}</small>
            <Link to={s.to ?? '/contact'} className="btn-outline btn-sm">
              {s.to ? 'Start designing' : 'Book this service'}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
