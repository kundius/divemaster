import { translationPage } from '@/lib/i18n/server'
import { ClientComponent } from '../ClientComponent'

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  console.log('client-non-static')
  translationPage({
    locale,
    clientNamespaces: ['errors', 'example']
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      client-non-static {locale}
      <ClientComponent />
    </main>
  )
}
