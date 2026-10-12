import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { FAQS } from '../../data/policies';

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((g) => category === 'All' || g.category === category)
      .map((g) => ({ ...g, items: g.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length);
  }, [query, category]);

  return (
    <div className="page-wrap narrow">
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
        eyebrow="Help centre"
        title="Frequently Asked Questions"
        subtitle="Quick answers about orders, care, gold and custom rings."
      />

      <div className="faq-tools" data-reveal="up">
        <input type="search" placeholder="Search questions…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search FAQ" />
        <div className="chips">
          {['All', ...FAQS.map((g) => g.category)].map((c) => (
            <button key={c} className={`chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && <p className="muted center">No questions match “{query}”. Try another word or contact us.</p>}

      {groups.map((g) => (
        <section key={g.category} className="faq-group" data-reveal="up">
          <h2>{g.category}</h2>
          <div className="acc">
            {g.items.map((item) => {
              const id = `${g.category}-${item.q}`;
              const isOpen = open === id;
              return (
                <div className={`acc-item${isOpen ? ' open' : ''}`} key={id}>
                  <button className="acc-hdr" onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen}>
                    <span>{item.q}</span>
                    <span className="acc-arrow">+</span>
                  </button>
                  <div className="acc-body">
                    <p style={{ padding: '0 0 16px', color: 'var(--t2)', fontSize: 14 }}>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="policy-help" data-reveal="up">
        <h3>Can’t find your answer?</h3>
        <p>Talk to a jewelry advisor — we reply within one business day.</p>
        <Link to="/contact" className="btn-gold" data-magnetic>
          Contact us
        </Link>
      </div>
    </div>
  );
}
