import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

const LINKS = [
  { to: '/account', label: 'Profile', end: true },
  { to: '/account/orders', label: 'My Orders' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/password', label: 'Password' },
  { to: '/wishlist', label: 'Wishlist' },
];

// Sidebar shell for all /account/* pages.
export default function AccountLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out');
    navigate('/');
  };

  return (
    <div className="page-wrap">
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} eyebrow="My Account" title={`Hello, ${user.firstName}`} />
      <div className="acct-layout">
        <aside className="acct-nav" data-reveal="left">
          <div className="acct-user">
            <span className="acct-av">{user.firstName[0]}</span>
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
