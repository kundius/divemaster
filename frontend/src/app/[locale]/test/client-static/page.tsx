import { translationPage } from '@/lib/i18n/server'
import { ClientComponent } from '../ClientComponent'

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  console.log('client-static')
  translationPage({
    locale,
    clientNamespaces: ['translation', 'errors']
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      client-static {locale}
      <ClientComponent />
    </main>
  )
}
