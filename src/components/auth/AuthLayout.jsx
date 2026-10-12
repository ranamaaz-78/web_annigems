import { Outlet } from 'react-router-dom';
import { usePageAnimations } from '../../hooks/usePageAnimations';
import PageTransition from '../common/PageTransition';
import ScrollToTop from '../common/ScrollToTop';
import Toast from '../overlays/Toast';

// Bare shell for login / register / password pages: no navbar, no footer.
export default function AuthLayout() {
  const rootRef = usePageAnimations();
  return (
    <>
      <ScrollToTop />
      <PageTransition />
      <Toast />
      <div className="auth-root" ref={rootRef}>
        <Outlet />
      </div>
    </>
  );
}
