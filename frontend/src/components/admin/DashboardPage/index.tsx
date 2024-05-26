// import { useTranslations } from 'next-intl'
// import { useTranslations } from 'next-intl'
'use client'

export function DashboardPage() {
  // const t = useTranslations('Index')
  // requireUserPreload(true)
  // const t = useI18n()
  // const scopedT = useScopedI18n('hello')
  return (
    <div>
      <div>
        {/* <p>{t('hello')}</p> */}

        {/* Both are equivalent: */}
        {/* <p>{t('hello.world')}</p> */}
        {/* <p>{scopedT('world')}</p> */}

        {/* <p>{t('welcome', { name: 'John' })}</p> */}
        {/* <p>{t('welcome', { name: <strong>John</strong> })}</p> */}
      </div>
    </div>
  )
}
