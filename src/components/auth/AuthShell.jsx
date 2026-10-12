import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../data/site';
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';

const PERKS = [
  { icon: '✦', title: 'Track every order', text: 'Live crafting-to-delivery updates' },
  { icon: '◈', title: 'Faster checkout', text: 'Saved addresses and wishlist' },
  { icon: '♦', title: 'Early access', text: 'New collections before anyone else' },
];

const SPARKLES = 14;

// Full-screen split layout for auth pages: cinematic brand panel left, focused form right.
export default function AuthShell({ title, subtitle, children, footer, image = '/images/hero_banner_user.jpg' }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to('.av-img', { scale: 1.12, duration: 18, ease: 'none', repeat: -1, yoyo: true });
      gsap.to('.av-sparkle', {
        y: () => gsap.utils.random(-40, -140),
        x: () => gsap.utils.random(-30, 30),
        opacity: () => gsap.utils.random(0.2, 0.9),
        duration: () => gsap.utils.random(3, 6),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.25, from: 'random' },
      });
      const tl = gsap.timeline({ delay: 0.9, defaults: { ease: 'power3.out' } });
      tl.from('.av-top', { opacity: 0, y: -20, duration: 0.7 })
        .from('.av-copy .sec-ey', { opacity: 0, y: 20, duration: 0.6 }, 0.1)
        .from('.av-h', { opacity: 0, y: 40, duration: 1 }, 0.2)
        .from('.av-perk', { opacity: 0, x: -30, duration: 0.7, stagger: 0.12 }, 0.5)
        .from('.ap-bar', { opacity: 0, y: -16, duration: 0.6 }, 0.2)
        .from('.ap-card > *', { opacity: 0, y: 26, duration: 0.7, stagger: 0.07, clearProps: 'all' }, 0.35);
    },
    { scope: root },
  );

  return (
    <div className="auth-page" ref={root}>
      <aside className="auth-visual">
        <img className="av-img" src={image} alt="" />
        <div className="av-ov" />
        <div className="av-sparkles" aria-hidden="true">
          {Array.from({ length: SPARKLES }, (_, i) => (
            <span key={i} className="av-sparkle" style={{ left: `${(i * 37) % 100}%`, top: `${40 + ((i * 53) % 55)}%` }} />
          ))}
        </div>
        <Link to="/" className="av-top" aria-label="AANI GEMAS home">
          <Logo className="nav-logo" textClassName="nav-logo-text" />
        </Link>
        <div className="av-copy">
          <p className="sec-ey">Since {BRAND.since}</p>
          <h2 className="av-h">
            {BRAND.tagline[0]}
            <br />
            <em>{BRAND.tagline[1]}</em>
          </h2>
          <ul className="av-perks">
            {PERKS.map((p) => (
              <li className="av-perk" key={p.title}>
                <span>{p.icon}</span>
                <div>
                  <strong>{p.title}</strong>
                  <small>{p.text}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="ap-bar">
          <Link to="/" className="ap-back">
            <span aria-hidden="true">←</span> Back to store
          </Link>
          <ThemeToggle />
        </div>
        <div className="ap-scroll" data-lenis-prevent>
          <div className="ap-card">
            <Link to="/" className="ap-logo-m" aria-label="Home">
              <Logo className="nav-logo" textClassName="nav-logo-text" imgHeight={34} />
            </Link>
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-sub">{subtitle}</p>}
            {children}
            {footer && <p className="auth-foot">{footer}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
