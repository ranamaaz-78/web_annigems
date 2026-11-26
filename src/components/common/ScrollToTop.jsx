import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../lib/lenis';

// Scroll to the top whenever the route (path or query) changes,
// unless the navigation asks to keep the position (state.keepScroll), e.g. Design Your Ring choices.
export default function ScrollToTop() {
  const { pathname, search, state } = useLocation();
  const keep = Boolean(state?.keepScroll);
  useEffect(() => {
    if (!keep) scrollToTop();
  }, [pathname, search]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
