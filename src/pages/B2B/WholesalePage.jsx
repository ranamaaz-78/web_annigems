import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import PageHero from '../../components/common/PageHero';
import { BUSINESS_TYPES, WHOLESALE_PERKS } from '../../data/b2b';
import { useAuth } from '../../hooks/useAuth';
import { useB2B } from '../../hooks/useB2B';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validateEmail, validatePhone, validateRequired } from '../../utils/validate';

const HOW_IT_WORKS = [
  { title: 'Tell us about your business', text: 'Send the short form below.' },
  { title: 'We verify and set you up', text: 'Our team creates your business account and sets your trade terms.' },
  { title: 'Sign in and order', text: 'You receive login details, see trade prices and order with approval, payment link or credit.' },
];

const EMPTY = { businessName: '', contactName: '', email: '', phone: '', type: BUSINESS_TYPES[0], gst: '', message: '' };

// Public page: business accounts cannot self-register, so this collects an access request for the admin.
export default function WholesalePage() {
  const { isB2B } = useAuth();
  const { addEnquiry } = useB2B();
  const { showToast } = useUI();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      businessName: validateRequired(form.businessName, 'Business name'),
      contactName: validateRequired(form.contactName, 'Contact name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    addEnquiry(form);
    setSent(true);
    showToast('Request sent. We will be in touch soon.');
  };

  return (
    <div className="page-wrap">
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Wholesale' }]}
        eyebrow="AANI GEMAS for Business"
        title="Wholesale & Trade"
        subtitle="Trade pricing, credit terms and custom rings for jewellers, boutiques and designers."
      />

      <div className="b2b-perks" data-stagger=".b2b-perk">
        {WHOLESALE_PERKS.map((p) => (
          <div className="b2b-perk" key={p.title}>
            <span>{p.icon}</span>
            <strong>{p.title}</strong>
            <small>{p.text}</small>
          </div>
        ))}
      </div>

      <div className="b2b-apply">
        <div data-reveal="left">
          <h2 className="pd-section-title" style={{ textAlign: 'left' }}>
            How it works
          </h2>
          <ol className="b2b-how">
            {HOW_IT_WORKS.map((s, i) => (
              <li key={s.title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{s.title}</strong>
                  <small>{s.text}</small>
                </div>
              </li>
            ))}
          </ol>
          <p className="muted">
            Already have a business account? <Link to="/b2b/login">{isB2B ? 'Open your dashboard' : 'Sign in here'}</Link>
          </p>
        </div>

        <div className="side-card" data-reveal="right">
          {sent ? (
            <div className="b2b-sent">
              <span className="success-mark">✦</span>
              <h3 className="cs-title">Request received</h3>
              <p className="muted">Thank you. Our team will review your details and email you the login details once your business account is ready.</p>
            </div>
          ) : (
            <>
              <h3 className="cs-title">Request a business account</h3>
              <form className="co-form" onSubmit={handleSubmit} noValidate>
                <FormField id="wh-biz" label="Business Name" value={form.businessName} onChange={set('businessName')} error={errors.businessName} />
                <div className="form-r2">
                  <FormField id="wh-name" label="Contact Name" value={form.contactName} onChange={set('contactName')} error={errors.contactName} />
                  <FormField id="wh-phone" label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
                </div>
                <FormField id="wh-email" label="Business Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
                <div className="form-r2">
                  <FormField id="wh-type" as="select" label="Business Type" value={form.type} onChange={set('type')}>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </FormField>
                  <FormField id="wh-gst" label="GST / Tax ID (optional)" value={form.gst} onChange={set('gst')} />
                </div>
                <FormField id="wh-msg" as="textarea" rows={3} label="Tell us about your needs (optional)" value={form.message} onChange={set('message')} />
                <button type="submit" className="btn-gold">
                  Send Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
