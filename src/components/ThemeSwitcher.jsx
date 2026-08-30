import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from './Icon';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="lang-switcher theme-switcher" role="group" aria-label={t('nav.theme')}>
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        aria-pressed={theme === 'dark'}
        aria-label={t('nav.themeDark')}
        title={t('nav.themeDark')}
        onClick={() => setTheme('dark')}
      >
        <Icon name="moon" />
        <span className="theme-switcher-label">{t('nav.themeDark')}</span>
      </button>
      <button
        type="button"
        className={theme === 'light' ? 'active' : ''}
        aria-pressed={theme === 'light'}
        aria-label={t('nav.themeLight')}
        title={t('nav.themeLight')}
        onClick={() => setTheme('light')}
      >
        <Icon name="sun" />
        <span className="theme-switcher-label">{t('nav.themeLight')}</span>
      </button>
    </div>
  );
}
