import type { Metadata } from 'next'
import { Roboto as FontSans, Roboto_Condensed as FontSansAlt, Montserrat } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { SWRGlobalProvider } from '@/lib/api/swr-global-provider'
import { cn } from '@/lib/utils'
import { AuthServerProvider } from '@/providers/auth-server-provider'
import { CartStoreProvider } from '@/providers/cart-store-provider'
import { LocationStoreProvider } from '@/providers/location-store-provider'
import { OrderStoreProvider } from '@/providers/order-store-provider'
import '@/styles/globals.scss'
import Script from 'next/script'
import { Suspense } from 'react'
import YandexMetrika from '@/components/YandexMetrika'

const fontSans = FontSans({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap'
})

const fontSansAlt = FontSansAlt({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-sans-narrow',
  display: 'swap'
})

const fontMontserrat = Montserrat({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-sans-wide',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontSansAlt.variable,
          fontMontserrat.variable
        )}
      >
        <SWRGlobalProvider>
          <AuthServerProvider>
            <LocationStoreProvider>
              <CartStoreProvider>
                <OrderStoreProvider>{children}</OrderStoreProvider>
              </CartStoreProvider>
            </LocationStoreProvider>
          </AuthServerProvider>
        </SWRGlobalProvider>
        <Toaster richColors position="top-center" />
        <Script id="metrika-counter" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(98552573, "init", {
              defer: true,
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });`}
        </Script>
        <Suspense fallback={<></>}>
          <YandexMetrika code={98552573} />
        </Suspense>
      </body>
    </html>
  )
}
