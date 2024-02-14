import { translationPage } from '@/lib/i18n/server'
import { ClientComponent } from '../ClientComponent'

export default function Page() {
  console.log('client-non-static')
  translationPage({
    clientNamespaces: ['errors', 'example']
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      client-non-static
      <ClientComponent />
    </main>
  )
}
