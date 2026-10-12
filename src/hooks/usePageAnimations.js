import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap';

const EASE = 'power3.out';

// Many cards have `transition: all` in CSS, which fights GSAP's per-frame inline values and leaves
// them stuck near their start state. Disable transitions while animating, then restore the element.
const animateFrom = (targets, vars) => {
  const els = gsap.utils.toArray(targets);
  els.forEach((el) => {
    el.style.transition = 'none';
  });
  return gsap.from(els, {
    ...vars,
    onComplete: () => gsap.set(els, { clearProps: 'opacity,transform,transition' }),
  });
};

// Declarative scroll animations. Pages opt in with data attributes instead of writing GSAP:
//   data-reveal="up|left|right|fade|scale"  fade/slide an element in on scroll (data-delay optional)
//   data-stagger[="selector"]               stagger direct children (or a selector) on scroll
//   data-split                              split a heading into lines and reveal them
//   data-parallax="0.15"                    parallax an element (use on images inside overflow:hidden)
//   data-count="1500" [data-suffix="+"]     animate a number up
//   data-magnetic                           element gently follows the cursor
// Runs again on every route change and cleans up automatically.
export function usePageAnimations() {
  const scope = useRef(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const q = (sel) => gsap.utils.toArray(sel);
      const cleanups = [];

      q('[data-reveal]').forEach((el) => {
        const type = el.dataset.reveal || 'up';
        const from = { opacity: 0 };
        if (type === 'up') from.y = 48;
        if (type === 'left') from.x = -60;
        if (type === 'right') from.x = 60;
        if (type === 'scale') from.scale = 0.92;
        animateFrom(el, {
          ...from,
          duration: 1.1,
          ease: EASE,
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      q('[data-stagger]').forEach((el) => {
        const targets = el.dataset.stagger ? el.querySelectorAll(el.dataset.stagger) : el.children;
        if (!targets.length) return;
        animateFrom(targets, {
          opacity: 0,
          y: 56,
          duration: 0.95,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      q('[data-split]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'auto' });
        const tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
        cleanups.push(() => {
          tween.kill();
          split.revert();
        });
      });

      q('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: -amount * 100 },
          {
            yPercent: amount * 100,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      q('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString('en-US') + suffix;
          },
        });
      });

      if (window.matchMedia('(hover: hover)').matches) {
        q('[data-magnetic]').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener('mousemove', move);
          el.addEventListener('mouseleave', leave);
          cleanups.push(() => {
            el.removeEventListener('mousemove', move);
            el.removeEventListener('mouseleave', leave);
          });
        });
      }

      const refresh = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => {
        clearTimeout(refresh);
        cleanups.forEach((fn) => fn());
      };
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return scope;
}
