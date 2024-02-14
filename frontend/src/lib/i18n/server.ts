import { createInstance, i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { PropsWithChildren, cache, createElement } from 'react'
import { initReactI18next } from 'react-i18next'
import { TranslationClientProvider } from './client'
import { translationConfig } from './config'

export interface TranslationPageOptions {
  locale?: string
  clientNamespaces?: string[]
}

export const translationPage = (options: TranslationPageOptions) => {
  if (options.locale) {
    setLocale(options.locale)
  }
  if (options.clientNamespaces) {
    setClientNamespaces(options.clientNamespaces)
  }
}

const i18nInstance = cache<() => { current?: i18n }>(() => ({ current: undefined }))

export const getI18nInstance = () => {
  return i18nInstance().current
}

export const setI18nInstance = (value: i18n) => {
  i18nInstance().current = value
}

const clientNamespaces = cache<() => { current: string[] }>(() => ({ current: [] }))

export const getClientNamespaces = () => {
  return clientNamespaces().current
}

export const setClientNamespaces = (value: string[]) => {
  clientNamespaces().current = value
}

const i18nLocale = cache<() => { current: string }>(() => ({
  current: translationConfig.defaultLocale
}))

const getLocale = () => {
  return i18nLocale().current
}

const setLocale = (value: string) => {
  i18nLocale().current = value
}

async function init(lng: string, ns?: string[] | string | undefined) {
  const i18n = createInstance()

  i18n.use(initReactI18next)

  i18n.use(resourcesToBackend((l: string, n: string) => import(`@/../messages/${l}/${n}.json`)))

  await i18n.init({
    lng,
    fallbackLng: translationConfig.defaultLocale,
    supportedLngs: translationConfig.locales,
    ns,
    preload: translationConfig.locales,
    interpolation: {
      escapeValue: false
    }
  })

  return i18n
}

export async function getTranslation(ns?: string[] | string | undefined) {
  const locale = getLocale()

  let i18n: i18n | undefined = getI18nInstance()

  if (!i18n) {
    i18n = await init(locale, ns)
    setI18nInstance(i18n)
  }

  // Пространства загружаются динамически по мере необходимости
  if (ns) {
    await i18n.loadNamespaces(ns)
    await i18n.setDefaultNamespace(Array.isArray(ns) ? ns[0] : ns)
  }

  return {
    t: i18n.t
  }
}

export async function TranslationServerProvider({ children }: PropsWithChildren) {
  const locale = getLocale()
  const namespaces = getClientNamespaces()

  const i18n = await init(locale, namespaces)

  return createElement(
    TranslationClientProvider,
    {
      locale,
      namespaces,
      resources: {
        [locale]: i18n.services.resourceStore.data[locale]
      }
    },
    children
  )
}
