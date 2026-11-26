import { Link } from 'react-router-dom';
import { BRAND, CONTACT, FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, PAYMENT_BADGES } from '../../data/site';
import Logo from '../common/Logo';

const CURRENT_YEAR = new Date().getFullYear();

const Svg = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const PhoneIcon = () => (
  <Svg>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Svg>
);
const MailIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);
const PinIcon = () => (
  <Svg>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);
const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const ChatIcon = () => (
  <Svg>
    <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z" />
  </Svg>
);

const FooterLink = ({ link }) =>
  link.to ? <Link to={link.to}>{link.label}</Link> : <span>{link.label}</span>;

export default function Footer() {
  const [line1, line2] = BRAND.tagline ?? [];
  const contact = [
    CONTACT.phone && { icon: <PhoneIcon />, label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    CONTACT.email && { icon: <MailIcon />, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.address && { icon: <PinIcon />, label: CONTACT.address },
    CONTACT.hours && { icon: <ClockIcon />, label: CONTACT.hours },
  ].filter(Boolean);

  return (
    <footer className="ft">
      <div className="ft-card">
        <div className="ft-cta">
          <div>
            <p className="ft-eyebrow">{BRAND.name}{BRAND.since ? ` · Since ${BRAND.since}` : ''}</p>
            <h2 className="ft-title">
              {line1 || 'Crafted with passion.'}
              <br />
              <em>{line2 || 'Worn with pride.'}</em>
            </h2>
            <p className="ft-sub">Questions about a stone, a size or a custom piece? Talk to our atelier.</p>
          </div>
          <div className="ft-cta-btns">
            <Link className="btn-gold" to="/design-your-ring">
              Design your ring
            </Link>
            {CONTACT.whatsapp ? (
              <a className="ft-btn" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
                <ChatIcon /> Chat on WhatsApp
              </a>
            ) : (
              <Link className="ft-btn" to="/contact">
                Contact us
              </Link>
            )}
          </div>
        </div>

        <div className="ft-main">
          <div className="ft-brand">
            <Link to="/" aria-label={`${BRAND.name} home`}>
              <Logo className="ft-logo" imgHeight={40} />
            </Link>
            <ul className="ft-contact">
              {contact.map((c) => (
                <li key={c.label}>
                  <span className="ft-ico">{c.icon}</span>
                  {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
                </li>
              ))}
            </ul>
          </div>

          <nav className="ft-cols" aria-label="Footer">
            {FOOTER_COLUMNS.map((col) => (
              <div className="ft-col" key={col.heading}>
                {/* Desktop: plain columns. Phones: each column folds (details/summary). */}
                <details className="ft-fold">
                  <summary>{col.heading}</summary>
                  <div className="ft-links">
                    {col.links.map((link) => (
                      <FooterLink key={link.label} link={link} />
                    ))}
                  </div>
                </details>
                <div className="ft-open">
                  <h3>{col.heading}</h3>
                  <div className="ft-links">
                    {col.links.map((link) => (
                      <FooterLink key={link.label} link={link} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="ft-bottom">
          <p>
            © {CURRENT_YEAR} {BRAND.name}. All rights reserved.
          </p>
          <div className="ft-legal">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="ft-pay" aria-label="Accepted payment methods">
            {PAYMENT_BADGES.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>

        <p className="ft-word" aria-hidden="true">
          {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
