import { useState } from 'react';
import FormField from '../../components/common/FormField';
import PageHero from '../../components/common/PageHero';
import { CONTACT } from '../../data/site';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validateEmail, validateRequired } from '../../utils/validate';

const TOPICS = ['Order enquiry', 'Custom / bespoke ring', 'Repairs & resizing', 'Gold & gemstone advice', 'Other'];

export default function ContactPage() {
  const { showToast } = useUI();
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      name: validateRequired(form.name, 'Name'),
      email: validateEmail(form.email),
      message: form.message.trim().length >= 10 ? '' : 'Please write at least 10 characters.',
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    setForm({ name: '', email: '', topic: TOPICS[0], message: '' });
    showToast('Message sent — we will reply within 24 hours');
  };

  return (
    <div className="page-wrap">
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="We would love to hear from you"
        title="Contact the Atelier"
        subtitle="Questions about a piece, a custom design or your order? Our jewelry advisors reply within one business day."
      />

      <div className="contact-grid">
        <form className="side-card" onSubmit={handleSubmit} noValidate data-reveal="left">
          <h3 className="cs-title">Send a message</h3>
          <div className="co-form">
            <div className="form-r2">
              <FormField id="ct-name" name="name" label="Your Name" placeholder="Priya Mehta" value={form.name} onChange={set('name')} error={errors.name} />
              <FormField id="ct-email" name="email" label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} />
            </div>
            <FormField id="ct-topic" name="topic" label="Topic" as="select" value={form.topic} onChange={set('topic')}>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </FormField>
            <FormField id="ct-message" name="message" label="Message" as="textarea" rows={6} placeholder="How can we help?" value={form.message} onChange={set('message')} error={errors.message} />
            <button type="submit" className="btn-gold" data-magnetic>
              Send Message
            </button>
          </div>
        </form>

        <div className="contact-side" data-reveal="right">
          <div className="side-card">
            <h3 className="cs-title">Visit &amp; reach us</h3>
            <ul className="contact-list">
              <li>
                <span>📍</span>
                <div>
                  <strong>Atelier</strong>
                  <p>{CONTACT.address}</p>
                </div>
              </li>
              <li>
                <span>✆</span>
                <div>
                  <strong>Phone</strong>
                  <p>
                    <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
                  </p>
                </div>
              </li>
              <li>
                <span>✉</span>
                <div>
                  <strong>Email</strong>
                  <p>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </p>
                </div>
              </li>
              <li>
                <span>◷</span>
                <div>
                  <strong>Hours</strong>
                  <p>{CONTACT.hours}</p>
                </div>
              </li>
            </ul>
            <a className="btn-whatsapp" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
          <div className="map-wrap">
            <iframe title="AANI GEMAS atelier location" src={CONTACT.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </div>
  );
}
