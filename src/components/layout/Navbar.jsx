import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useScrolled, useScrollingDown } from '../../hooks/useScrolled';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from '../common/Icons';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

// /shop?cat=… links share one path, so "active" has to compare the category too.
const shopCat = (search) => new URLSearchParams(search).get('cat');

export default function Navbar() {
  const scrolled = useScrolled(60);
  const hidden = useScrollingDown();
  const { cartCount } = useShop();
  const { openSearch, openCart, toggleMenu } = useUI();
  const { user, isB2B } = useAuth();
  const { pathname, search } = useLocation();
  const onShop = pathname === '/shop';
  const cat = shopCat(search);
  const shopClass = (key) => `nav-link${onShop && cat === key ? ' active' : ''}`;

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`}>
      <div className="nav-inner">
        <Link to="/" aria-label="Home">
          <Logo className="nav-logo" textClassName="nav-logo-text" />
        </Link>

        <div className="nav-links">
          <Link className={shopClass('gemstones')} to="/shop?cat=gemstones">
            Gemstones
          </Link>
          <Link className={shopClass('mountings')} to="/shop?cat=mountings">
            Mountings
          </Link>
          <Link className={`nav-link${onShop && cat !== 'gemstones' && cat !== 'mountings' ? ' active' : ''}`} to="/shop?cat=jewellery">
            Jewellery
          </Link>
          <NavLink className="nav-link hl" to="/design-your-ring">
            Design Your Ring
          </NavLink>
          <NavLink className={navClass} to="/about">
            About
          </NavLink>
          <NavLink className={navClass} to="/contact">
            Contact
          </NavLink>
        </div>

        <div className="nav-right">
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
          {isB2B && (
            <Link className="b2b-pill" to="/b2b" title="Business dashboard">
              Business
            </Link>
          )}
          <Link className="nav-icon" to={isB2B ? '/b2b' : user ? '/account' : '/login'} title={user ? 'My account' : 'Sign in'} aria-label="Account">
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
