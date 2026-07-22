import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const { t } = useLanguage();

  return (
    <nav className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex-shrink-0 text-2xl font-bold">
            IZERE
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link to="/" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/contraception" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.contraception')}
            </Link>
            <Link to="/pregnancy" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.pregnancy')}
            </Link>
            <Link to="/menstrual" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.menstrual')}
            </Link>
            <Link to="/sti" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.sti')}
            </Link>
            <Link to="/blog" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              {t('nav.blog')}
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
