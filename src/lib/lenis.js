// Holds the Lenis smooth-scroll instance so other modules (ScrollToTop, overlays) can control it.
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};

export const getLenis = () => instance;

export const scrollToTop = () => {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' });
};
