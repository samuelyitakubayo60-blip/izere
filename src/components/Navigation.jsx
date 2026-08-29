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

const REPRODUCTIVE_HEALTH_LINKS = [
  { to: '/contraception', key: 'contraception' },
  { to: '/pregnancy', key: 'pregnancy' },
  { to: '/menstrual', key: 'menstrual' },
];

function Dropdown({ id, label, active, children, alignEnd }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className={`nav-dropdown${open ? ' is-open' : ''}${alignEnd ? ' nav-dropdown-end' : ''}`} ref={ref}>
      <button
        type="button"
        className={`nav-link nav-dropdown-toggle${active ? ' nav-link-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {label} <Icon name="chevron-down" />
      </button>
      <div className="nav-dropdown-menu" id={id} role="menu">
        {children}
      </div>
    </div>
  );
}

export default function Navigation() {
  const { t } = useLanguage();
  const { isAdmin, canAccessDashboard, isCounselor, logout, user } = useAuth();
  const { count } = useCart();
  const { openChat } = useChatUI();
  const location = useLocation();
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
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

  const settingsMenu = (
    <>
      <div className="nav-settings-row" role="none">
        <span><T k="nav.language" /></span>
        <LanguageSwitcher />
      </div>
      <button type="button" className="nav-dropdown-item nav-dropdown-btn" onClick={() => toggleA11y('contrast')}>
        <Icon name="adjust" /> <T k="nav.contrast" />
      </button>
      <button type="button" className="nav-dropdown-item nav-dropdown-btn" onClick={() => toggleA11y('text')}>
        <Icon name="text-height" /> <T k="nav.largeText" />
      </button>
    </>
  );

  const primaryLinks = (
    <>
      <NavLink to="/" end className={navClass}>
        <T k="nav.home" />
      </NavLink>
      <Dropdown id="nav-services" label={<T k="nav.services" />} active={servicesActive}>
        <NavLink
          to="/contraception"
          className={({ isActive }) => `nav-dropdown-item${isActive ? ' nav-link-active' : ''}`}
          role="menuitem"
        >
          <T k="nav.reproductiveHealth" />
        </NavLink>
        {REPRODUCTIVE_HEALTH_LINKS.map(({ to, key }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) => `nav-dropdown-item nav-dropdown-sub${isActive ? ' nav-link-active' : ''}`}
            role="menuitem"
            style={{ paddingLeft: '1.5rem' }}
          >
            <T k={`nav.${key}`} />
          </NavLink>
        ))}
        <NavLink
          to="/sti"
          className={({ isActive }) => `nav-dropdown-item${isActive ? ' nav-link-active' : ''}`}
          role="menuitem"
        >
          <T k="nav.sti" />
        </NavLink>
      </Dropdown>
      <NavLink to="/shop" className={navClass}>
        <Icon name="store" className="nav-link-icon" />
        <T k="nav.shop" />
        {count > 0 ? ` (${count})` : ''}
      </NavLink>
      <NavLink to="/about" className={navClass}>
        <T k="nav.about" />
      </NavLink>
      <NavLink to="/contact" className={navClass}>
        <T k="nav.contact" />
      </NavLink>
      <NavLink to="/donate" className="btn-nav-donate">
        <T k="nav.donate" />
      </NavLink>
      <Dropdown
        id="nav-settings"
        label={(
          <>
            <Icon name="cog" /> <T k="nav.settings" />
          </>
        )}
        alignEnd
      >
        {settingsMenu}
      </Dropdown>
      {!user ? (
        <Link to="/login" className="nav-link">
          {t('nav.staffLogin')}
        </Link>
      ) : (
        <>
          {canAccessDashboard && (
            <NavLink to="/admin" className={navClass}>
              <T k={dashboardKey} />
            </NavLink>
          )}
          <button type="button" onClick={logout} className="nav-link">
            {t('nav.signOut')}
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="navbar-fixed-wrap">
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
            <NavLink to="/" end className={navClass}>
              <T k="nav.home" />
            </NavLink>
            <p className="navbar-mobile-label">
              <T k="nav.services" />
            </p>
            <NavLink
              to="/contraception"
              className={({ isActive }) => `nav-link navbar-mobile-sub${isActive ? ' nav-link-active' : ''}`}
            >
              <T k="nav.reproductiveHealth" />
            </NavLink>
            {REPRODUCTIVE_HEALTH_LINKS.map(({ to, key }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) => `nav-link navbar-mobile-sub navbar-mobile-sub-sub${isActive ? ' nav-link-active' : ''}`}
                style={{ paddingLeft: '2.2rem' }}
              >
                <T k={`nav.${key}`} />
              </NavLink>
            ))}
            <NavLink
              to="/sti"
              className={({ isActive }) => `nav-link navbar-mobile-sub${isActive ? ' nav-link-active' : ''}`}
            >
              <T k="nav.sti" />
            </NavLink>
            <NavLink to="/shop" className={navClass}>
              <T k="nav.shop" />
              {count > 0 ? ` (${count})` : ''}
            </NavLink>
            <NavLink to="/about" className={navClass}>
              <T k="nav.about" />
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              <T k="nav.contact" />
            </NavLink>
            <NavLink to="/donate" className="btn-nav-donate">
              <T k="nav.donate" />
            </NavLink>
            <p className="navbar-mobile-label">
              <T k="nav.settings" />
            </p>
            <div className="navbar-mobile-utility">{settingsMenu}</div>
            {!user ? (
              <Link to="/login" className="nav-link">
                {t('nav.staffLogin')}
              </Link>
            ) : (
              <>
                {canAccessDashboard && (
                  <NavLink to="/admin" className={navClass}>
                    <T k={dashboardKey} />
                  </NavLink>
                )}
                <button type="button" onClick={logout} className="nav-link">
                  {t('nav.signOut')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
