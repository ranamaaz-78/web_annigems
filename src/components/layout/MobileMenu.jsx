import { Link } from 'react-router-dom';
import { MOBILE_NAV } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import Logo from '../common/Logo';

export default function MobileMenu() {
  const { overlay, close } = useUI();
  const { user } = useAuth();
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
        <Link to={user ? '/account' : '/login'} onClick={close}>
          {user ? 'My Account' : 'Sign In / Register'}
        </Link>
      </nav>
    </div>
  );
}
