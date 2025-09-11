import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useState } from 'react';
import { I18nProvider } from '../lib/i18n';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  return (
    <I18nProvider locale={locale} setLocale={setLocale}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
