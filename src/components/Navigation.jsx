import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/logo.png';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', key: 'home', end: true },
  { to: '/contraception', key: 'contraception' },
  { to: '/pregnancy', key: 'pregnancy' },
  { to: '/menstrual', key: 'menstrual' },
  { to: '/sti', key: 'sti' },
  { to: '/shop', key: 'shop' },
  { to: '/about', key: 'about' },
  { to: '/donate', key: 'donate' },
];

export default function Navigation() {
  const { t } = useLanguage();
  const { isAdmin, canEditSite, logout, user } = useAuth();
  const { count } = useCart();
  const { openChat } = useChatUI();
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

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
        <div className="container">
          <div className="navbar-top">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="IZERE" className="navbar-brand-logo" />
              <T k="nav.siteTitle" />
            </Link>

            <div className="navbar-top-actions">
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
              {!user ? (
                <Link to="/login" className="a11y-btn navbar-auth">
                  {t('nav.staffLogin')}
                </Link>
              ) : (
                <button type="button" onClick={logout} className="a11y-btn navbar-auth">
                  {t('nav.signOut')}
                </button>
              )}
              <LanguageSwitcher />
              <button type="button" className="btn-nav-cta border-0 cursor-pointer" onClick={openChat}>
                <Icon name="comments" /> {t('nav.chatNow')}
              </button>
            </div>
          </div>

          <div className="navbar-menu">
            {NAV_LINKS.map(({ to, key, end }) => (
              <NavLink key={key} to={to} end={end} className={navClass}>
                <T k={`nav.${key}`} />
                {key === 'shop' && count > 0 ? ` (${count})` : ''}
              </NavLink>
            ))}
            {canEditSite && (
              <NavLink to="/admin" className={navClass}>
                <T k={isAdmin ? 'nav.admin' : 'nav.dashboard'} />
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
