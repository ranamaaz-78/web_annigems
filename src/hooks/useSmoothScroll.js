import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap';
import { setLenis } from '../lib/lenis';

// Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
