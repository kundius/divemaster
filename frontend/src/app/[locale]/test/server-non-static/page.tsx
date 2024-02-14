import { translationPage } from '@/lib/i18n/server'
import ServerComponent from '../ServerComponent'

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  console.log('server-non-static')
  translationPage({
    locale
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      server-non-static {locale}
      <ServerComponent />
    </main>
  )
}
