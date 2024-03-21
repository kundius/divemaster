// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon', '@nuxt/fonts'],
  // modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/ui', '@nuxt/fonts'],
  routeRules: {
    '/admin/**': { ssr: false },
    '/user/**': { ssr: false }
  },
  runtimeConfig: {
    public: {
      TZ: process.env.TZ || 'Europe/Moscow',
      SITE_URL: process.env.SITE_URL || '127.0.0.1',
      API_URL: process.env.API_URL || '/api/',
      JWT_EXPIRE: process.env.JWT_EXPIRE || '2592000'
    }
  },
  
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  i18n: {
    langDir: 'lexicons',
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.js', iso: 'ru-RU' }
      // { code: 'en', name: 'English', file: 'en.js', iso: 'en-GB' },
      // { code: 'de', name: 'Deutsch', file: 'de.js', iso: 'de-DE' },
      // { code: 'nl', name: 'Nederlands', file: 'nl.js', iso: 'nl-NL' },
      // { code: 'fr', name: 'Français', file: 'fr.js', iso: 'fr-FR' }
    ],
    defaultLocale: 'ru'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/_variables.scss";'
        }
      }
    }
  }
})
