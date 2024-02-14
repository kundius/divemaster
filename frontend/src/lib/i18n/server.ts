import { createInstance, i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { PropsWithChildren, cache, createElement } from 'react'
import { TranslationClientProvider, initReactI18next } from './client'
import { translationConfig } from './config'

type TranslationCacheType = () => {
  locale: string
  clientNamespaces: string[]
  i18n: i18n | undefined
}

const translationCache = cache<TranslationCacheType>(() => ({
  locale: translationConfig.defaultLocale,
  clientNamespaces: [],
  i18n: undefined
}))

export interface TranslationPageOptions {
  locale?: string
  clientNamespaces?: string[]
}

export const translationPage = (options: TranslationPageOptions) => {
  const state = translationCache()

  if (options.locale) {
    state.locale = options.locale
  }

  if (options.clientNamespaces) {
    state.clientNamespaces = options.clientNamespaces
  }
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
  const state = translationCache()

  if (!state.i18n) {
    state.i18n = await init(state.locale, ns)
  }

  // Пространства загружаются динамически по мере необходимости
  if (ns) {
    await state.i18n.loadNamespaces(ns)
    await state.i18n.setDefaultNamespace(Array.isArray(ns) ? ns[0] : ns)
  }

  return {
    t: state.i18n.t
  }
}

export async function TranslationServerProvider({ children }: PropsWithChildren) {
  const state = translationCache()

  const i18n = await init(state.locale, state.clientNamespaces)

  return createElement(
    TranslationClientProvider,
    {
      locale: state.locale,
      namespaces: state.clientNamespaces,
      resources: {
        [state.locale]: i18n.services.resourceStore.data[state.locale]
      }
    },
    children
  )
}
