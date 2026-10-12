import SectionHeader from '../../../components/common/SectionHeader';
import { TESTIMONIALS } from '../../../data/testimonials';

export default function Testimonials() {
  return (
    <section className="test-section">
      <div className="test-inner">
        <SectionHeader eyebrow="Client Stories" title="What Our Clients Say" />
        <div className="test-grid" data-stagger=".t-card">
          {TESTIMONIALS.map((t) => (
            <div className="t-card" key={t.name}>
              <div className="t-stars">{'★'.repeat(t.rating)}</div>
              <p className="t-text">&ldquo;{t.text}&rdquo;</p>
              <div className="t-author">
                <div className="t-av">{t.initials}</div>
                <div>
                  <p className="t-name">{t.name}</p>
                  <p className="t-loc">{t.location}</p>
                  <p className="t-prod">{t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
