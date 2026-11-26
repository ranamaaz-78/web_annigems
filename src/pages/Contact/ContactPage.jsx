import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorText } from '../../api/client';
import Breadcrumb from '../../components/common/Breadcrumb';
import FormField from '../../components/common/FormField';
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from '../../components/common/Icons';
import { BRAND, CONTACT, CONTACT_TOPICS } from '../../data/site';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validateEmail, validateRequired } from '../../utils/validate';

const MIN_MESSAGE = 10;
const QUICK_HELP = [
  { to: '/track-order', title: 'Track an order', text: 'See where your piece is' },
  { to: '/returns', title: 'Returns & exchanges', text: '30-day policy explained' },
  { to: '/shipping-policy', title: 'Shipping', text: 'Delivery times and costs' },
  { to: '/faq', title: 'Help centre', text: 'Answers to common questions' },
];

export default function ContactPage() {
  const { showToast } = useUI();
  // Topics are managed in the admin (GET /bootstrap -> contact_topics).
  const topics = CONTACT_TOPICS;
  const empty = { name: '', email: '', topic: topics[0] ?? '', message: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null); // first name after a successful send

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const phoneHref = CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, '')}` : null;
  const mapsHref = CONTACT.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}` : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {
      name: validateRequired(form.name, 'Name'),
      email: validateEmail(form.email),
      message: form.message.trim().length >= MIN_MESSAGE ? '' : `Please write at least ${MIN_MESSAGE} characters.`,
    };
    setErrors(errs);
    if (hasErrors(errs) || busy) return;
    setBusy(true);
    try {
      await api('contact', { method: 'POST', body: { name: form.name.trim(), email: form.email.trim(), topic: form.topic || null, message: form.message.trim() } });
      setSent(form.name.trim().split(/\s+/)[0]);
      setForm(empty);
    } catch (err) {
      const fieldErrors = err.errors ?? {};
      if (Object.keys(fieldErrors).length) setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])));
      else showToast(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const ways = [
    CONTACT.whatsapp && { icon: <ChatIcon size={20} />, title: 'WhatsApp', value: 'Chat with an advisor', note: 'Fastest reply', href: `https://wa.me/${CONTACT.whatsapp}`, external: true, accent: true },
    phoneHref && { icon: <PhoneIcon size={20} />, title: 'Call us', value: CONTACT.phone, note: CONTACT.hours, href: phoneHref },
    CONTACT.email && { icon: <MailIcon size={20} />, title: 'Email', value: CONTACT.email, note: 'Reply within one business day', href: `mailto:${CONTACT.email}` },
  ].filter(Boolean);

  return (
    <div className="ct">
      <header className="ct-head">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        <p className="ab-ey" data-reveal="fade">
          We would love to hear from you
        </p>
        <h1 className="ct-title" data-split>
          Talk to the <em>atelier</em>
        </h1>
        <p className="ct-sub" data-reveal="up">
          A question about a stone, a size, a custom design or your order? Our jewellery advisors are here to help.
        </p>
      </header>

      {/* ── Quickest ways to reach us ── */}
      <div className="ct-ways" data-stagger=".ct-way">
        {ways.map((w) => (
          <a key={w.title} className={`ct-way${w.accent ? ' accent' : ''}`} href={w.href} {...(w.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <span className="ct-way-ico">{w.icon}</span>
            <span className="ct-way-body">
              <span className="ct-way-title">{w.title}</span>
              <span className="ct-way-val">{w.value}</span>
              <span className="ct-way-note">{w.note}</span>
            </span>
            <span className="ct-way-arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </div>

      <div className="ct-grid">
        {/* ── Message form ── */}
        <section className="ct-card ct-form-card" data-reveal="left">
          {sent !== null ? (
            <div className="ct-sent" role="status">
              <span className="ct-sent-ico">✓</span>
              <h2>Thank you{sent ? `, ${sent}` : ''}.</h2>
              <p>Your message is with our advisors. We reply within one business day, usually much sooner.</p>
              <button type="button" className="ab-btn-ghost" onClick={() => setSent(null)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="ct-card-title">Send a message</h2>
              <p className="ct-card-sub">Tell us what you have in mind. No question is too small.</p>

              {topics.length > 0 && (
                <fieldset className="ct-topics">
                  <legend>What is it about?</legend>
                  <div className="ct-chips">
                    {topics.map((t) => (
                      <label key={t} className={`ct-chip${form.topic === t ? ' on' : ''}`}>
                        <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="co-form">
                <div className="form-r2">
                  <FormField id="ct-name" name="name" label="Your name" placeholder="Priya Mehta" value={form.name} onChange={set('name')} error={errors.name} />
                  <FormField id="ct-email" name="email" label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} error={errors.email} />
                </div>
                <FormField id="ct-message" name="message" label="Message" as="textarea" rows={6} placeholder="How can we help?" value={form.message} onChange={set('message')} error={errors.message} />
                <div className="ct-submit">
                  <span className="ct-count">{form.message.trim().length < MIN_MESSAGE ? `${MIN_MESSAGE - form.message.trim().length} more characters` : 'Looks good'}</span>
                  <button type="submit" className="btn-gold" data-magnetic disabled={busy}>
                    {busy ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* ── Atelier: photo, address, hours, map ── */}
        <aside className="ct-card ct-atelier" data-reveal="right">
          <div className="ct-atelier-img">
            <img src="/images/banner_design_ring.jpg" alt={`The ${BRAND.name} atelier`} />
            <span className="ct-atelier-tag">Visit the atelier</span>
          </div>
          <ul className="ct-info">
            {CONTACT.address && (
              <li>
                <span className="ct-info-ico">
                  <PinIcon />
                </span>
                <div>
                  <strong>Atelier</strong>
                  <p>{CONTACT.address}</p>
                </div>
              </li>
            )}
            {CONTACT.hours && (
              <li>
                <span className="ct-info-ico">
                  <ClockIcon />
                </span>
                <div>
                  <strong>Opening hours</strong>
                  <p>{CONTACT.hours}</p>
                </div>
              </li>
            )}
          </ul>
          {CONTACT.mapSrc && (
            <div className="ct-map">
              <iframe title={`${BRAND.name} atelier location`} src={CONTACT.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
          {mapsHref && (
            <a className="ab-btn-ghost ct-directions" href={mapsHref} target="_blank" rel="noreferrer">
              <PinIcon /> Get directions
            </a>
          )}
        </aside>
      </div>

      {/* ── Quick help ── */}
      <section className="ct-help">
        <h2 className="ct-help-title">Looking for something quick?</h2>
        <div className="ct-help-grid" data-stagger=".ct-help-item">
          {QUICK_HELP.map((h) => (
            <Link key={h.to} className="ct-help-item" to={h.to}>
              <span>
                <b>{h.title}</b>
                <small>{h.text}</small>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
