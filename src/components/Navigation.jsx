import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/logo.png';
import { SOCIAL_LINKS } from '../data/socialLinks';
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
  }, [location.pathname]);

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
        {label} <Icon name={open ? 'chevron-up' : 'chevron-down'} />
      </button>
      {open ? (
        <div className="nav-dropdown-menu" id={id} role="menu">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Accordion({ label, open, onToggle, active, children }) {
  return (
    <div className="nav-acc">
      <button
        type="button"
        className={`navbar-mobile-toggle${active ? ' is-active' : ''}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} />
      </button>
      {open ? <div className="navbar-mobile-accordion-content">{children}</div> : null}
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
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [rhExpanded, setRhExpanded] = useState(false);
  const [desktopRhOpen, setDesktopRhOpen] = useState(false);

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
    setServicesExpanded(false);
    setRhExpanded(false);
    setDesktopRhOpen(false);
  }, [location.pathname]);

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
  const rhActive = REPRODUCTIVE_HEALTH_LINKS.some((s) => location.pathname === s.to);
  const dashboardKey = isAdmin ? 'nav.admin' : isCounselor ? 'nav.counselInbox' : 'nav.dashboard';

  const primaryLinks = (
    <>
      <NavLink to="/" end className={navClass}>
        <T k="nav.home" />
      </NavLink>
      <Dropdown id="nav-services" label={<T k="nav.services" />} active={servicesActive}>
        <button
          type="button"
          className={`nav-dropdown-item nav-dropdown-btn${rhActive ? ' nav-link-active' : ''}`}
          aria-expanded={desktopRhOpen}
          onClick={() => setDesktopRhOpen((o) => !o)}
        >
          <span><T k="nav.reproductiveHealth" /></span>
          <Icon name={desktopRhOpen ? 'chevron-up' : 'chevron-down'} />
        </button>
        {desktopRhOpen
          ? REPRODUCTIVE_HEALTH_LINKS.map(({ to, key }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) => `nav-dropdown-item nav-dropdown-sub${isActive ? ' nav-link-active' : ''}`}
                role="menuitem"
              >
                <T k={`nav.${key}`} />
              </NavLink>
            ))
          : null}
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
      <NavLink to="/care" className={navClass}>
        <T k="nav.findCare" />
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
      <button type="button" className="btn-nav-cta btn-nav-chat border-0 cursor-pointer" onClick={openChat}>
        <Icon name="comments" /> {t('nav.chatNow')}
      </button>
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
      <div className="navbar-utility">
        <div className="container navbar-utility-inner">
          <div className="navbar-utility-social" aria-label={t('footer.socialTitle')}>
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
              >
                <Icon name={item.icon} brand />
              </a>
            ))}
          </div>
          <div className="navbar-utility-actions" aria-label={t('nav.settings')}>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              type="button"
              className={`navbar-tool-btn${highContrast ? ' is-on' : ''}`}
              onClick={() => toggleA11y('contrast')}
              title={t('nav.contrast')}
              aria-label={t('nav.contrast')}
            >
              <Icon name="adjust" /> <span className="navbar-tool-label"><T k="nav.contrast" /></span>
            </button>
            <button
              type="button"
              className={`navbar-tool-btn${largeText ? ' is-on' : ''}`}
              onClick={() => toggleA11y('text')}
              title={t('nav.largeText')}
              aria-label={t('nav.largeText')}
            >
              <Icon name="text-height" /> <span className="navbar-tool-label"><T k="nav.largeText" /></span>
            </button>
          </div>
        </div>
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
            <NavLink to="/" end className={navClass}>
              <T k="nav.home" />
            </NavLink>
            <Accordion
              label={<T k="nav.services" />}
              open={servicesExpanded}
              onToggle={() => setServicesExpanded((o) => !o)}
              active={servicesActive}
            >
              <Accordion
                label={<T k="nav.reproductiveHealth" />}
                open={rhExpanded}
                onToggle={() => setRhExpanded((o) => !o)}
                active={rhActive}
              >
                {REPRODUCTIVE_HEALTH_LINKS.map(({ to, key }) => (
                  <NavLink
                    key={key}
                    to={to}
                    className={({ isActive }) => `nav-link navbar-mobile-sub${isActive ? ' nav-link-active' : ''}`}
                  >
                    <T k={`nav.${key}`} />
                  </NavLink>
                ))}
              </Accordion>
              <NavLink
                to="/sti"
                className={({ isActive }) => `nav-link navbar-mobile-sub${isActive ? ' nav-link-active' : ''}`}
              >
                <T k="nav.sti" />
              </NavLink>
            </Accordion>
            <NavLink to="/shop" className={navClass}>
              <T k="nav.shop" />
              {count > 0 ? ` (${count})` : ''}
            </NavLink>
            <NavLink to="/care" className={navClass}>
              <T k="nav.findCare" />
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
