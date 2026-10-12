import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../../data/site';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from '../../../lib/gsap';

export default function Hero() {
  const root = useRef(null);

  // Intro timeline (runs after the page curtain lifts) plus a scroll-driven background parallax.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create('.hero-h1', { type: 'lines', mask: 'lines' });
      const tl = gsap.timeline({ delay: 1.0, defaults: { ease: 'power4.out' } });
      tl.from('.hero-img-wrap', { scale: 1.18, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.hero-ey', { opacity: 0, y: 20, duration: 0.8 }, 0.1)
        .from(split.lines, { yPercent: 115, duration: 1.2, stagger: 0.14 }, 0.2)
        .from('.hero-p', { opacity: 0, y: 24, duration: 0.9 }, 0.7)
        .from('.hero-ctas > *', { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 }, 0.9)
        .from('.hero-scroll', { opacity: 0, duration: 1 }, 1.3);

      gsap.to('.hero-img-wrap', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-content', {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      return () => {
        split.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: root },
  );

  return (
    <section className="hero" ref={root}>
      <div className="hero-img-wrap">
        {/* Same image in both themes; CSS swaps visibility and overlay per theme */}
        <img className="hero-banner hero-banner-dark" src="/images/hero_banner_user.jpg" alt={`${BRAND.name} fine jewelry`} />
        <img className="hero-banner hero-banner-light" src="/images/hero_banner_user.jpg" alt="" aria-hidden="true" />
        <div className="hero-grad" />
      </div>
      <div className="hero-content">
        <span className="hero-ey">Handcrafted Fine Jewelry · Since {BRAND.since}</span>
        <h1 className="hero-h1">
          Where Gold
          <br />
          <em>Meets Artistry</em>
        </h1>
        <p className="hero-p">
          Bespoke rings, necklaces, earrings and bracelets crafted in 18K gold.
          <br />
          Every piece tells a story. Every stone speaks in colour.
        </p>
        <div className="hero-ctas">
          <Link className="btn-gold" to="/shop" data-magnetic>
            Shop Collection
          </Link>
          <Link className="btn-outline" to="/design-your-ring" data-magnetic>
            Design Your Ring
          </Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-bar" />
      </div>
    </section>
  );
}
