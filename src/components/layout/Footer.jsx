import { Link } from 'react-router-dom';
import { BRAND, FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, PAYMENT_BADGES } from '../../data/site';
import { InstagramIcon } from '../common/Icons';
import Logo from '../common/Logo';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <Logo className="f-logo" imgHeight={44} />
            <p className="f-tagline">
              {BRAND.tagline[0]}
              <br />
              {BRAND.tagline[1]}
            </p>
            <div className="f-socials">
              <a className="f-social" href="#" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a className="f-social" href="#" aria-label="X">
                𝕏
              </a>
            </div>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div className="f-col" key={col.heading}>
              <h5>{col.heading}</h5>
              {col.links.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label}>{link.label}</a>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            © {CURRENT_YEAR} {BRAND.name}. All rights reserved.
          </p>
          <div className="f-btm-lks">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="f-payments">
            {PAYMENT_BADGES.map((b) => (
              <span className="pay-badge" key={b}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
