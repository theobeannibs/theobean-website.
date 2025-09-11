import { useT } from '../lib/i18n';

export default function Mission() {
  const { t } = useT();
  return <div className="p-8">{t('mission')}</div>;
}
