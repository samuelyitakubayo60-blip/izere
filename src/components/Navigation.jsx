import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';

const NAV_LINKS = [
  { to: '/', key: 'home', end: true },
  { to: '/contraception', key: 'contraception' },
  { to: '/pregnancy', key: 'pregnancy' },
  { to: '/menstrual', key: 'menstrual' },
  { to: '/sti', key: 'sti' },
  { to: '/about', key: 'about' },
  { to: '/donate', key: 'donate' },
];

export default function Navigation() {
  const { t } = useLanguage();
  const { isAdmin, canEditSite, logout, user } = useAuth();
  const { openChat } = useChatUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const closeMobile = () => setMobileOpen(false);

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

  const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

  return (
    <div className="navbar-fixed-wrap">
      <nav className="navbar" aria-label="Main navigation">
        <div className="container flex items-center justify-between flex-wrap gap-2 py-3">
          <Link to="/" className="navbar-brand" onClick={closeMobile}>
            <Icon name="heartbeat" className="me-2" style={{ color: 'var(--primary)' }} />
            IZERE
          </Link>

          <div className="hidden lg:flex items-center gap-2 me-3">
            <button type="button" className="a11y-btn" onClick={() => toggleA11y('contrast')}>
              <Icon name="adjust" /> {t('nav.contrast')}
            </button>
            <button type="button" className="a11y-btn" onClick={() => toggleA11y('text')}>
              <Icon name="text-height" /> {t('nav.largeText')}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ to, key, end }) => (
              <NavLink key={key} to={to} end={end} className={navClass} onClick={closeMobile}>
                <T k={`nav.${key}`} />
              </NavLink>
            ))}
            {canEditSite && (
              <NavLink to="/admin" className={navClass} onClick={closeMobile}>
                <T k={isAdmin ? 'nav.admin' : 'nav.dashboard'} />
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/login" className="nav-link hidden sm:inline text-sm">
                {t('nav.staffLogin')}
              </Link>
            )}
            {user && (
              <button type="button" onClick={logout} className="nav-link hidden sm:inline text-sm bg-transparent border-0 cursor-pointer">
                {t('nav.signOut')}
              </button>
            )}
            <LanguageSwitcher />
            <button type="button" className="btn-nav-cta hidden md:inline-flex items-center gap-2 border-0 cursor-pointer" onClick={openChat}>
              <Icon name="comments" /> {t('nav.chatNow')}
            </button>
            <button
              type="button"
              className="lg:hidden a11y-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <Icon name={mobileOpen ? 'times' : 'bars'} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden mobile-nav-panel px-4 py-4">
            <div className="container flex flex-col gap-1">
              {NAV_LINKS.map(({ to, key, end }) => (
                <NavLink key={key} to={to} end={end} className={navClass} onClick={closeMobile}>
                  <T k={`nav.${key}`} />
                </NavLink>
              ))}
              {canEditSite && (
                <NavLink to="/admin" className={navClass} onClick={closeMobile}>
                  <T k={isAdmin ? 'nav.admin' : 'nav.dashboard'} />
                </NavLink>
              )}
              <button type="button" className="btn-nav-cta mt-2 border-0 cursor-pointer justify-center" onClick={() => { openChat(); closeMobile(); }}>
                <Icon name="comments" /> {t('nav.chatNow')}
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
