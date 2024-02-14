import { translationPage } from '@/lib/i18n/server'
import ServerComponent from '../ServerComponent'

export default function Page() {
  console.log('server-non-static')
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      server-non-static
      <ServerComponent />
    </main>
  )
}
