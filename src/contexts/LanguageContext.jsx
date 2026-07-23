import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translate, applyRemoteTranslations } from '../i18n/translations';
import { fetchTranslationBundle } from '../services/translationService';

const STORAGE_KEY = 'izere_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'rw' ? 'rw' : 'en';
  });
  const [i18nVersion, setI18nVersion] = useState(0);

  const reloadFromApi = useCallback(async () => {
    try {
      const bundle = await fetchTranslationBundle();
      applyRemoteTranslations(bundle);
      setI18nVersion((v) => v + 1);
    } catch {
      // Static translations.js still works offline
    }
  }, []);

  useEffect(() => {
    reloadFromApi();
  }, [reloadFromApi]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'rw' ? 'rw' : 'en';
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'rw') setLanguageState(lang);
  }, []);

  const t = useCallback((key) => translate(language, key), [language, i18nVersion]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, reloadFromApi }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
