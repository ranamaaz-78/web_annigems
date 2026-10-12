import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLenis } from '../lib/lenis';
import { UIContext } from './contexts';

// Controls global overlays (cart drawer, search, auth, quick view, mobile menu) and the toast.

export function UIProvider({ children }) {
  const [overlay, setOverlay] = useState(null); // 'cart' | 'search' | 'quickview' | 'menu' | null
  const [quickViewId, setQuickViewId] = useState(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimer = useRef(null);

  const close = useCallback(() => setOverlay(null), []);
  const openCart = useCallback(() => setOverlay('cart'), []);
  const openSearch = useCallback(() => setOverlay('search'), []);
  const toggleMenu = useCallback(() => setOverlay((o) => (o === 'menu' ? null : 'menu')), []);
  const openQuickView = useCallback((id) => {
    setQuickViewId(id);
    setOverlay('quickview');
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Lock page scroll while a blocking overlay is open
  useEffect(() => {
    const locks = overlay === 'cart' || overlay === 'quickview';
    document.body.style.overflow = locks ? 'hidden' : '';
    const lenis = getLenis();
    if (lenis && locks) lenis.stop();
    else if (lenis) lenis.start();
  }, [overlay]);

  // Escape closes any overlay
  useEffect(() => {
    if (!overlay) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay, close]);

  const value = useMemo(
    () => ({ overlay, quickViewId, toast, close, openCart, openSearch, toggleMenu, openQuickView, showToast }),
    [overlay, quickViewId, toast, close, openCart, openSearch, toggleMenu, openQuickView, showToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

