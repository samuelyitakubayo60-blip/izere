import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex rounded-lg border border-white/30 overflow-hidden ${className}`}
      role="group"
      aria-label="Site language"
    >
      {[
        { code: 'en', label: 'EN' },
        { code: 'rw', label: 'RW' },
      ].map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
            language === code
              ? 'bg-white text-red-600'
              : 'bg-transparent text-white hover:bg-white/20'
          }`}
          aria-pressed={language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
