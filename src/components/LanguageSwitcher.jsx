import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Site language">
      {[
        { code: 'en', label: 'EN' },
        { code: 'rw', label: 'RW' },
      ].map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={language === code ? 'active' : ''}
          aria-pressed={language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
