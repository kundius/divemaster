'use client'

import { useTranslation } from 'react-i18next'

export function ClientComponent() {
  const { t } = useTranslation(['errors'])

  return (
    <div>
      <p>{t('access_denied')}</p>
      <p>{t('example:example')}</p>
      <p>{t('errors:access_denied')}</p>
      <p>{t('Welcome to React')}</p>
      <button
        type='button'
        onClick={() => {
          console.log('test', t('access_denied'))
        }}
      >
        alert
      </button>
    </div>
  )
}
