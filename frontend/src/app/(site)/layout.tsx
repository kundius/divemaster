// import { AuthClientProvider } from '@/lib/auth/client-provider'
import { DefaultLayout } from '@/components/site/DefaultLayout'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DefaultLayout>{children}</DefaultLayout>
}
