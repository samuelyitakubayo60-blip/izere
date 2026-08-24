import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/logo.png';
import { useEffect, useRef, useState } from 'react';

const SERVICE_LINKS = [
  { to: '/contraception', key: 'contraception' },
  { to: '/pregnancy', key: 'pregnancy' },
  { to: '/menstrual', key: 'menstrual' },
  { to: '/sti', key: 'sti' },
];

export default function Navigation() {
  const { t } = useLanguage();
  const { isAdmin, canAccessDashboard, isCounselor, logout, user } = useAuth();
  const { count } = useCart();
  const { openChat } = useChatUI();
  const location = useLocation();
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef(null);

  const toggleA11y = (mode) => {
    if (mode === 'contrast') {
      setHighContrast((v) => {
        document.body.classList.toggle('high-contrast', !v);
        return !v;
      });
    } else {
      setLargeText((v) => {
        document.body.classList.toggle('simple-mode', !v);
        return !v;
      });
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-mobile-open', mobileOpen);
    return () => document.body.classList.remove('nav-mobile-open');
  }, [mobileOpen]);

  const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;
  const servicesActive = SERVICE_LINKS.some((s) => location.pathname === s.to);
  const dashboardKey = isAdmin ? 'nav.admin' : isCounselor ? 'nav.counselInbox' : 'nav.dashboard';

  const utility = (
    <div className="navbar-utility-actions">
      <button
        type="button"
        className={`a11y-btn${highContrast ? ' is-on' : ''}`}
        onClick={() => toggleA11y('contrast')}
      >
        <Icon name="adjust" /> {t('nav.contrast')}
      </button>
      <button
        type="button"
        className={`a11y-btn${largeText ? ' is-on' : ''}`}
        onClick={() => toggleA11y('text')}
      >
        <Icon name="text-height" /> {t('nav.largeText')}
      </button>
      <LanguageSwitcher />
      {!user ? (
        <Link to="/login" className="a11y-btn navbar-auth">
          {t('nav.staffLogin')}
        </Link>
      ) : (
        <button type="button" onClick={logout} className="a11y-btn navbar-auth">
          {t('nav.signOut')}
        </button>
      )}
      {canAccessDashboard && (
        <NavLink to="/admin" className="a11y-btn navbar-auth">
          <T k={dashboardKey} />
        </NavLink>
      )}
    </div>
  );

  const servicesMenu = (
    <div className={`nav-dropdown${servicesOpen ? ' is-open' : ''}`} ref={servicesRef}>
      <button
        type="button"
        className={`nav-link nav-dropdown-toggle${servicesActive ? ' nav-link-active' : ''}`}
        aria-expanded={servicesOpen}
        aria-haspopup="true"
        onClick={() => setServicesOpen((o) => !o)}
      >
        <T k="nav.services" /> <Icon name="chevron-down" />
      </button>
      <div className="nav-dropdown-menu" role="menu">
        {SERVICE_LINKS.map(({ to, key }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) => `nav-dropdown-item${isActive ? ' nav-link-active' : ''}`}
            role="menuitem"
            onClick={() => setServicesOpen(false)}
          >
            <T k={`nav.${key}`} />
          </NavLink>
        ))}
      </div>
    </div>
  );

  const primaryLinks = (
    <>
      <NavLink to="/" end className={navClass}>
        <T k="nav.home" />
      </NavLink>
      {servicesMenu}
      <NavLink to="/shop" className={navClass}>
        <Icon name="store" className="nav-link-icon" />
        <T k="nav.shop" />
        {count > 0 ? ` (${count})` : ''}
      </NavLink>
      <NavLink to="/about" className={navClass}>
        <T k="nav.about" />
      </NavLink>
      <NavLink to="/donate" className="btn-nav-donate">
        <T k="nav.donate" />
      </NavLink>
      <button type="button" className="btn-nav-cta btn-nav-chat border-0 cursor-pointer" onClick={openChat}>
        <Icon name="comments" /> {t('nav.chatNow')}
      </button>
    </>
  );

  return (
    <div className="navbar-fixed-wrap">
      <div className="navbar-utility">
        <div className="container navbar-utility-inner">{utility}</div>
      </div>
      <nav className="navbar" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-main">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="IZERE" className="navbar-brand-logo" />
              <T k="nav.siteTitle" />
            </Link>
            <button
              type="button"
              className="navbar-burger"
              aria-expanded={mobileOpen}
              aria-controls="izere-mobile-menu"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <Icon name={mobileOpen ? 'times' : 'bars'} />
            </button>
            <div className="navbar-primary">{primaryLinks}</div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="navbar-mobile" id="izere-mobile-menu">
          <div className="container">
            <NavLink to="/" end className={navClass} onClick={() => setMobileOpen(false)}>
              <T k="nav.home" />
            </NavLink>
            <p className="navbar-mobile-label">
              <T k="nav.services" />
            </p>
            {SERVICE_LINKS.map(({ to, key }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) => `nav-link navbar-mobile-sub${isActive ? ' nav-link-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <T k={`nav.${key}`} />
              </NavLink>
            ))}
            <NavLink to="/shop" className={navClass} onClick={() => setMobileOpen(false)}>
              <T k="nav.shop" />
              {count > 0 ? ` (${count})` : ''}
            </NavLink>
            <NavLink to="/about" className={navClass} onClick={() => setMobileOpen(false)}>
              <T k="nav.about" />
            </NavLink>
            <NavLink to="/donate" className="btn-nav-donate" onClick={() => setMobileOpen(false)}>
              <T k="nav.donate" />
            </NavLink>
            <button
              type="button"
              className="btn-nav-cta btn-nav-chat border-0 cursor-pointer"
              onClick={() => {
                setMobileOpen(false);
                openChat();
              }}
            >
              <Icon name="comments" /> {t('nav.chatNow')}
            </button>
            <div className="navbar-mobile-utility">{utility}</div>
          </div>
        </div>
      )}
    </div>
  );
}
