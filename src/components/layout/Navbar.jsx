import { Link, NavLink } from 'react-router-dom';
import { GOLD_RATE } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useScrolled, useScrollingDown } from '../../hooks/useScrolled';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { formatPrice } from '../../utils/format';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from '../common/Icons';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import MegaMenu from './MegaMenu';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export default function Navbar() {
  const scrolled = useScrolled(60);
  const hidden = useScrollingDown();
  const { cartCount } = useShop();
  const { openSearch, openCart, toggleMenu } = useUI();
  const { user } = useAuth();

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`}>
      <div className="nav-inner">
        <Link to="/" aria-label="Home">
          <Logo className="nav-logo" textClassName="nav-logo-text" />
        </Link>

        <div className="nav-links">
          <div className="has-mega">
            <NavLink className={navClass} to="/shop">
              Shop
            </NavLink>
            <MegaMenu />
          </div>
          <NavLink className="nav-link hl" to="/design-your-ring">
            ✦ Design Your Ring
          </NavLink>
          <Link className="nav-link" to="/shop">
            Collections
          </Link>
          <NavLink className={navClass} to="/about">
            About
          </NavLink>
          <NavLink className={navClass} to="/contact">
            Contact
          </NavLink>
        </div>

        <div className="nav-right">
          <div className="gold-ticker" title="Indicative gold rate">
            <span className="gt-au">Au</span>
            <span className="gt-price">{formatPrice(GOLD_RATE.perOz)}</span>
            <span className="gt-unit">/oz</span>
            <span className="gt-dot live" />
          </div>
          <button className="nav-icon" onClick={openSearch} title="Search" aria-label="Search">
            <SearchIcon />
          </button>
          <Link className="nav-icon nav-icon-wl" to="/wishlist" title="Wishlist" aria-label="Wishlist">
            <HeartIcon />
          </Link>
          <button className="nav-icon" onClick={openCart} title="Cart" aria-label="Cart">
            <BagIcon />
            <span className={`cart-badge${cartCount > 0 ? ' show' : ''}`}>{cartCount}</span>
          </button>
          <Link className="nav-icon" to={user ? '/account' : '/login'} title={user ? 'My account' : 'Sign in'} aria-label="Account">
            {user ? <span className="nav-av">{user.firstName[0]}</span> : <UserIcon />}
          </Link>
          <ThemeToggle />
          <button className="hamburger" onClick={toggleMenu} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
