'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRANSLATIONS, LANGUAGES, type LangCode, type T } from './translations';

interface LanguageContextValue {
  language: LangCode;
  setLanguage: (l: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'EN',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<LangCode>('EN');

  useEffect(() => {
    const stored = localStorage.getItem('0xfuture-lang') as LangCode | null;
    const valid = LANGUAGES.some(l => l.code === stored);
    if (stored && valid) setLang(stored);
  }, []);

  const setLanguage = (l: LangCode) => {
    setLang(l);
    localStorage.setItem('0xfuture-lang', l);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslations(): T {
  const { language } = useLanguage();
  return TRANSLATIONS[language];
}
