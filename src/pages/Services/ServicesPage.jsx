import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';

const SERVICES = [
  { icon: '◎', title: 'Ring Resizing', text: 'Free resize within 60 days of delivery. Send your ring back, we return it in 7-10 days.', note: 'Free for 60 days' },
  { icon: '✎', title: 'Engraving', text: 'Names, dates or short messages hand-engraved inside your band. Available on sizes 5 and above.', note: 'Complimentary on rings' },
  { icon: '✦', title: 'Jewelry Repairs', text: 'Prong re-tipping, stone tightening, polishing and chain repair by our master artisans.', note: 'Quote within 48 hours' },
  { icon: '♦', title: 'Custom Design', text: 'Build your own ring with a setting, size and gemstone, priced on today’s gold rate.', note: 'Design Your Ring', to: '/design-your-ring' },
];

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
