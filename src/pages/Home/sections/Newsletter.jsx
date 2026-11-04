import { useState } from 'react';
import { api, errorText } from '../../../api/client';
import { BRAND } from '../../../data/site';
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

  return (
    <section className="nl-section">
      <div className="nl-inner" data-reveal="up">
        <div>
          <p className="nl-ey">✦ Private Circle</p>
          <h3 className="nl-title">Join the {BRAND.name} Circle</h3>
          <p className="nl-sub">Be the first to access new collections, exclusive offers, and invitations to private trunk shows.</p>
        </div>
        <form className="nl-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="nl-email">
            Email address
          </label>
          <input id="nl-email" name="email" type="email" className="nl-input" placeholder="Your email address" required />
          <button type="submit" className="btn-gold" disabled={busy}>
            {busy ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
