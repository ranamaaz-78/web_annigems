import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../lib/lenis';

// Scroll to the top whenever the route (path or query) changes.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [pathname, search]);
  return null;
}
