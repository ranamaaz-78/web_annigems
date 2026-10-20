import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

const LINKS = [
  { to: '/b2b', label: 'Dashboard', end: true },
  { to: '/b2b/orders', label: 'Orders' },
  { to: '/b2b/credit', label: 'Credit' },
  { to: '/b2b/company', label: 'Company Profile' },
  { to: '/b2b/addresses', label: 'Addresses' },
  { to: '/b2b/password', label: 'Password' },
  { to: '/wishlist', label: 'Wishlist' },
];

// Sidebar shell for all /b2b/* pages (mirrors the customer account area).
export default function B2BLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out');
    navigate('/b2b/login');
  };

  return (
    <div className="page-wrap">
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Business' }]} eyebrow="Business Account" title={user.company?.name ?? 'Business'} />
      <div className="acct-layout">
        <aside className="acct-nav" data-reveal="left">
          <div className="acct-user">
            <span className="acct-av">{user.company?.name?.[0] ?? user.firstName[0]}</span>
            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <small>{user.email}</small>
            </div>
          </div>
          <nav>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `acct-link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/shop" className="acct-link">
              Browse trade catalogue →
            </NavLink>
            <button className="acct-link acct-logout" onClick={handleLogout}>
              Sign out
            </button>
          </nav>
        </aside>
        <section className="acct-main">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
