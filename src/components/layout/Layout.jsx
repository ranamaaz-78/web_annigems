import { Outlet } from 'react-router-dom';
import { usePageAnimations } from '../../hooks/usePageAnimations';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import PageTransition from '../common/PageTransition';
import ScrollToTop from '../common/ScrollToTop';
import CartDrawer from '../overlays/CartDrawer';
import QuickViewModal from '../overlays/QuickViewModal';
import SearchOverlay from '../overlays/SearchOverlay';
import Toast from '../overlays/Toast';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import Navbar from './Navbar';

// App shell: navbar, global overlays, the routed page and the footer.
export default function Layout() {
  useSmoothScroll();
  const mainRef = usePageAnimations();
  return (
    <>
      <PageTransition />
      <ScrollToTop />
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickViewModal />
      <Toast />
      <main className="app-main" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
