import { createContext, useContext } from 'react';
import en from './en';
import es from './es';

type Locale = 'en' | 'es';
const dictionaries = { en, es };

interface Ctx {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<Ctx>({
  t: (k) => k,
  locale: 'en',
  setLocale: () => {},
});

export const I18nProvider: React.FC<{ locale: Locale; setLocale: (l: Locale) => void; children: React.ReactNode }> = ({ locale, setLocale, children }) => {
  const t = (key: string) => dictionaries[locale][key] || key;
  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useT = () => useContext(I18nContext);
