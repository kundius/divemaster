'use client'

import { Resource, createInstance } from 'i18next'
import { PropsWithChildren, createElement } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { translationConfig } from './config'

export function TranslationClientProvider({
  children,
  locale,
  namespaces,
  resources
}: PropsWithChildren<{
  locale?: string
  namespaces?: string[]
  resources?: Resource
}>) {
  const i18n = createInstance()

  i18n.use(initReactI18next)

  i18n.init({
    lng: locale,
    fallbackLng: translationConfig.defaultLocale,
    supportedLngs: translationConfig.locales,
    ns: namespaces,
    resources
  })

  return createElement(I18nextProvider, { i18n }, children)
}

export { initReactI18next }
