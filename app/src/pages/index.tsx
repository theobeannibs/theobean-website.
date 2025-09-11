import { useT } from '../lib/i18n';

export default function Home() {
  const { t, locale, setLocale } = useT();
  return (
    <main className="p-8">
      <header className="flex justify-between">
        <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        <button onClick={() => setLocale(locale === 'en' ? 'es' : 'en')} className="underline">
          {locale === 'en' ? 'ES' : 'EN'}
        </button>
      </header>
    </main>
  );
}
