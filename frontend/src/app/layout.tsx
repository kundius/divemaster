import { Toaster } from '@/components/ui/sonner'
import { SWRGlobalProvider } from '@/lib/api/swr-global-provider'
import { AuthServerProvider } from '@/lib/auth/server-provider'
import { cn } from '@/lib/utils'
import '@/styles/globals.scss'
import type { Metadata } from 'next'
import { Roboto as FontSans, Roboto_Condensed as FontSansAlt, Montserrat } from 'next/font/google'

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
          <AuthServerProvider>{children}</AuthServerProvider>
        </SWRGlobalProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
