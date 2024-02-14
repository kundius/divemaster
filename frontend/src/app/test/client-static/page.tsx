import { translationPage } from '@/lib/i18n/server'
import { ClientComponent } from '../ClientComponent'

export default function Page() {
  console.log('client-static')
  translationPage({
    clientNamespaces: ['translation', 'errors']
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      client-static
      <ClientComponent />
    </main>
  )
}
