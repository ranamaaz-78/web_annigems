import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/gsap';

// Gold curtain that wipes away on every route change (and on first load).
export default function PageTransition() {
  const curtain = useRef(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(curtain.current, { autoAlpha: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.set(curtain.current, { autoAlpha: 1, yPercent: 0 })
        .from('.pt-logo', { opacity: 0, y: 14, duration: 0.35, ease: 'power2.out' })
        .to(curtain.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.12')
        .set(curtain.current, { autoAlpha: 0 });
      gsap.from('.app-main', { opacity: 0, y: 24, duration: 0.9, delay: 0.35, ease: 'power3.out', clearProps: 'all' });
    },
    { scope: curtain, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div className="page-transition" ref={curtain} aria-hidden="true">
      <span className="pt-logo">✦</span>
    </div>
  );
}
