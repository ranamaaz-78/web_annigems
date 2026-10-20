import { Link } from 'react-router-dom';
import { MOBILE_NAV } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import Logo from '../common/Logo';

export default function MobileMenu() {
  const { overlay, close } = useUI();
  const { user, isB2B } = useAuth();
  return (
    <div className={`mob-menu${overlay === 'menu' ? ' open' : ''}`} aria-hidden={overlay !== 'menu'}>
      <button className="mob-close" onClick={close} aria-label="Close menu">
        ✕
      </button>
      <Logo className="mob-logo" imgHeight={38} style={{ display: 'flex', alignItems: 'center', gap: 10 }} />
      <nav className="mob-nav">
        {MOBILE_NAV.map((item) => (
          <Link key={item.label} to={item.to} className={item.highlight ? 'gold-lk' : undefined} onClick={close}>
            {item.label}
          </Link>
        ))}
        <Link to={isB2B ? '/b2b' : user ? '/account' : '/login'} onClick={close}>
          {isB2B ? 'Business Dashboard' : user ? 'My Account' : 'Sign In / Register'}
        </Link>
        {!user && (
          <Link to="/b2b/login" onClick={close}>
            Business Login
          </Link>
        )}
      </nav>
    </div>
  );
}
