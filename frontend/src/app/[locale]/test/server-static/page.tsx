import ServerComponent from '../ServerComponent'
import { translationPage } from '@/lib/i18n/server'

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  console.log('server-static')
  translationPage({
    locale
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      server-static {locale}
      <ServerComponent />
    </main>
  )
}
