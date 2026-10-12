import { BRAND } from '../../../data/site';
import { useUI } from '../../../hooks/useUI';

export default function Newsletter() {
  const { showToast } = useUI();

  // Static form — no subscription request is made
  const handleSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    showToast(`Welcome to the ${BRAND.name} Circle! ✦`);
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
          <input id="nl-email" type="email" className="nl-input" placeholder="Your email address" required />
          <button type="submit" className="btn-gold">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
