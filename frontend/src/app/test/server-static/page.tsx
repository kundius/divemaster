import ServerComponent from '../ServerComponent'
import { translationPage } from '@/lib/i18n/server'

export default function Page() {
  console.log('server-static')
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      server-static
      <ServerComponent />
    </main>
  )
}
