import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translate } from '../i18n/translations';

const STORAGE_KEY = 'izere_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'rw' ? 'rw' : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'rw' ? 'rw' : 'en';
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'rw') setLanguageState(lang);
  }, []);

  const t = useCallback((key) => translate(language, key), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
