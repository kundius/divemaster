import { getTranslation } from '@/lib/i18n/server'

export default async function ServerComponent() {
  const { t } = await getTranslation(['errors', 'example', 'translation'])

  return (
    <div>
      <p>{t('access_denied')}</p>
      <p>{t('example:example')}</p>
      <p>{t('Welcome to React')}</p>
      <p>{t('Welcome to React', {
        ns: 'translation'
      })}</p>
    </div>
  )
}
