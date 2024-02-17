import { HasScope } from '@/components/HasScope'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <HasScope fallback={'Access Denied'} scopes="roles">
      {children}
    </HasScope>
  )
}
