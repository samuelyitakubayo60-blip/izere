import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/', key: 'home' },
  { to: '/contraception', key: 'contraception' },
  { to: '/pregnancy', key: 'pregnancy' },
  { to: '/menstrual', key: 'menstrual' },
  { to: '/sti', key: 'sti' },
  { to: '/blog', key: 'blog' },
];

const Navigation = () => {
  const { t } = useLanguage();
  const { isAdmin, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const linkClass =
    'block px-4 py-3 rounded-lg text-base font-medium hover:bg-red-700/80 transition-colors';

  return (
    <nav className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex-shrink-0 text-2xl font-bold" onClick={closeMobile}>
            IZERE
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ to, key }) => (
              <Link
                key={key}
                to={to}
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium border border-white/40"
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!user && (
              <Link
                to="/login"
                className="hidden sm:inline text-sm hover:bg-red-700 px-2 py-1 rounded-md"
              >
                {t('nav.staffLogin')}
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="hidden sm:inline text-sm hover:bg-red-700 px-2 py-1 rounded-md"
              >
                {t('nav.signOut')}
              </button>
            )}
            <LanguageSwitcher />

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={closeMobile}
            aria-label="Close menu overlay"
          />
          <div
            id="mobile-nav-menu"
            className="lg:hidden absolute left-0 right-0 top-16 z-30 bg-gradient-to-b from-red-600 to-pink-600 border-t border-white/20 shadow-xl px-4 py-4 pb-6"
          >
            <div className="flex flex-col gap-1 max-w-7xl mx-auto">
              {NAV_LINKS.map(({ to, key }) => (
                <Link key={key} to={to} className={linkClass} onClick={closeMobile}>
                  {t(`nav.${key}`)}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className={linkClass} onClick={closeMobile}>
                  {t('nav.admin')}
                </Link>
              )}
              {!user && (
                <Link to="/login" className={linkClass} onClick={closeMobile}>
                  {t('nav.staffLogin')}
                </Link>
              )}
              {user && (
                <button type="button" className={`${linkClass} text-left w-full`} onClick={() => { logout(); closeMobile(); }}>
                  {t('nav.signOut')}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
