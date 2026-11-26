import { useState } from 'react';
import { api, errorText } from '../../../api/client';
import { CATEGORIES } from '../../../data/catalog';
import { BRAND, HOME } from '../../../data/site';
import { useUI } from '../../../hooks/useUI';

export default function Newsletter() {
  const { showToast } = useUI();
  const [busy, setBusy] = useState(false);

  // POST /newsletter
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const email = new FormData(form).get('email');
    setBusy(true);
    try {
      await api('newsletter', { method: 'POST', body: { email } });
      form.reset();
      showToast(`Welcome to the ${BRAND.name} Circle! ✦`);
    } catch (err) {
      showToast(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  // A jewellery photo already managed in the admin: the necklaces category, else the hero.
  const photo = CATEGORIES.find((c) => c.id === 'necklaces')?.image || CATEGORIES[0]?.image || HOME.hero?.image;

  return (
    <section className="nl-section">
      <div className="nl-card" data-reveal="up">
        <div className="nl-photo">{photo && <img src={photo} alt="" loading="lazy" />}</div>
        <div className="nl-body">
          <p className="nl-ey">✦ Private Circle</p>
          <h3 className="nl-title">Join the {BRAND.name} Circle</h3>
          <p className="nl-sub">One letter a month from our atelier. No noise, only beautiful things.</p>
          <ul className="nl-perks">
            <li>First look at new collections</li>
            <li>Members-only offers</li>
            <li>Invitations to private trunk shows</li>
          </ul>
          <form className="nl-form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="nl-email">
              Email address
            </label>
            <input id="nl-email" name="email" type="email" className="nl-input" placeholder="Your email address" required />
            <button type="submit" className="btn-gold" disabled={busy}>
              {busy ? 'Joining…' : 'Join the Circle'}
            </button>
          </form>
          <p className="nl-fine">Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
